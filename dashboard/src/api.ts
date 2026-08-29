import { cameras, detections, initialAlerts, initialCases, recordedDays } from './prototypeData'

const apiBase = import.meta.env.VITE_OPERATIONS_API_URL?.replace(/\/$/, '')

async function getOrFallback<T>(path: string, fallback: T): Promise<T> {
  if (!apiBase) return fallback
  try {
    const response = await fetch(`${apiBase}${path}`, { headers: { Accept: 'application/json' } })
    if (!response.ok) throw new Error(`API ${response.status}`)
    return await response.json() as T
  } catch {
    return fallback
  }
}

export const operationsApi = {
  getTodayDetections: () => getOrFallback('/api/v1/live/detections', detections),
  getRecordedDays: () => getOrFallback('/api/v1/archive/days', recordedDays),
  getAlerts: () => getOrFallback('/api/v1/alerts', initialAlerts),
  getCases: () => getOrFallback('/api/v1/cases', initialCases),
  getCameras: () => getOrFallback('/api/v1/cameras', cameras),
}

