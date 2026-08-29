from __future__ import annotations

import hashlib
import hmac
from datetime import date, datetime
from typing import Any
from uuid import UUID, uuid4
from zoneinfo import ZoneInfo

import httpx
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    supabase_url: str | None = None
    supabase_service_role_key: str | None = None
    plate_hmac_secret: str = "prototype-only-change-me"
    ingestion_api_key: str = "prototype-ingestion-key"
    simulation_mode: bool = True


settings = Settings()
app = FastAPI(title="BharatANPR Ingestion and Spatial API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

simulation_events: list[dict[str, Any]] = []


class DetectionIn(BaseModel):
    source_event_id: str
    jurisdiction_id: UUID
    camera_id: UUID
    captured_at: datetime
    plate_text: str | None = None
    plate_masked: str | None = None
    ocr_confidence: float | None = Field(default=None, ge=0, le=1)
    longitude: float
    latitude: float
    direction: str | None = None
    speed_kph: float | None = Field(default=None, ge=0)
    observed_vehicle_class: str | None = None
    observed_model_family: str | None = None
    observed_colour: str | None = None
    quality: dict[str, Any] = Field(default_factory=dict)
    model_versions: dict[str, str] = Field(default_factory=dict)
    is_simulated: bool = True


def normalized_plate(value: str) -> str:
    return "".join(character for character in value.upper() if character.isalnum())


def plate_token(value: str) -> str:
    return hmac.new(
        settings.plate_hmac_secret.encode(),
        normalized_plate(value).encode(),
        hashlib.sha256,
    ).hexdigest()


async def insert_supabase(row: dict[str, Any]) -> dict[str, Any]:
    if not settings.supabase_url or not settings.supabase_service_role_key:
        simulation_events.append(row)
        return row
    headers = {
        "apikey": settings.supabase_service_role_key,
        "Authorization": f"Bearer {settings.supabase_service_role_key}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.post(
            f"{settings.supabase_url}/rest/v1/detections", headers=headers, json=row
        )
    response.raise_for_status()
    return response.json()[0]


@app.get("/health")
def health() -> dict[str, Any]:
    return {
        "status": "ok",
        "simulation": settings.simulation_mode,
        "supabase_connected": bool(settings.supabase_url and settings.supabase_service_role_key),
    }


@app.post("/api/v1/detections", status_code=201)
async def ingest_detection(
    detection: DetectionIn, x_ingestion_key: str | None = Header(default=None)
) -> dict[str, Any]:
    if x_ingestion_key != settings.ingestion_api_key:
        raise HTTPException(status_code=401, detail="Invalid ingestion credential")
    row = {
        "id": str(uuid4()),
        "source_event_id": detection.source_event_id,
        "jurisdiction_id": str(detection.jurisdiction_id),
        "camera_id": str(detection.camera_id),
        "captured_at": detection.captured_at.isoformat(),
        "observed_on": detection.captured_at.astimezone(ZoneInfo("Asia/Kolkata")).date().isoformat(),
        "plate_token": plate_token(detection.plate_text) if detection.plate_text else None,
        "plate_masked": detection.plate_masked,
        "ocr_text_synthetic": normalized_plate(detection.plate_text)
        if detection.plate_text and detection.is_simulated
        else None,
        "ocr_confidence": detection.ocr_confidence,
        "location": f"SRID=4326;POINT({detection.longitude} {detection.latitude})",
        "direction": detection.direction,
        "speed_kph": detection.speed_kph,
        "observed_vehicle_class": detection.observed_vehicle_class,
        "observed_model_family": detection.observed_model_family,
        "observed_colour": detection.observed_colour,
        "quality": detection.quality,
        "model_versions": detection.model_versions,
        "is_simulated": detection.is_simulated,
    }
    return await insert_supabase(row)


@app.get("/api/v1/live/detections")
def live_detections() -> list[dict[str, Any]]:
    today = date.today().isoformat()
    return [event for event in simulation_events if event["observed_on"] == today]


@app.get("/api/v1/archive/days")
def recorded_days() -> list[dict[str, Any]]:
    summary: dict[str, int] = {}
    for event in simulation_events:
        summary[event["observed_on"]] = summary.get(event["observed_on"], 0) + 1
    return [
        {"observed_on": day, "detection_count": count}
        for day, count in sorted(summary.items(), reverse=True)
    ]
