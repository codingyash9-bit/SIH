import { useEffect, useMemo, useRef, useState } from 'react'
import maplibregl, { Map as MapLibreMap } from 'maplibre-gl'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Activity, Archive, Bell, CalendarDays, Camera, Check, ChevronRight, CircleDot,
  Command, Crosshair, Database, Eye, FileCheck2, Gauge, History,
  LayoutDashboard, ListFilter, Map, Pause, Play, Radio, Search,
  ShieldCheck, Siren, SlidersHorizontal, Target, Waypoints, X,
} from 'lucide-react'
import { operationsApi } from './api'
import {
  AlertRecord, AlertStatus, CaseRecord, CaseStatus, Detection, cameras as fixtureCameras,
  corridors, detections as fixtureDetections, initialAlerts, initialCases, recordedDays as fixtureDays,
} from './prototypeData'
import { MagneticButton, TiltCard, AmbientGlow, SpringDrawer } from './components/motion'

type PageName = 'Command Centre' | 'Live Radar' | 'Alerts' | 'Vehicle Search' | 'Cases' | 'Traffic Analytics' | 'Camera Network'

const navItems: { label: PageName; icon: typeof Activity; count?: number }[] = [
  { label: 'Command Centre', icon: LayoutDashboard },
  { label: 'Live Radar', icon: Map },
  { label: 'Alerts', icon: Siren, count: 7 },
  { label: 'Vehicle Search', icon: Search },
  { label: 'Cases', icon: Target, count: 3 },
  { label: 'Traffic Analytics', icon: Gauge },
  { label: 'Camera Network', icon: Camera },
]

const cameraPoints: [number, number, string, string][] = [
  [77.241, 28.628, 'CAM-042', 'ITO Junction'],
  [77.163, 28.592, 'CAM-017', 'Dhaula Kuan'],
  [77.259, 28.572, 'CAM-031', 'Ashram Chowk'],
  [77.229, 28.612, 'CAM-009', 'India Gate'],
]

const routeObserved: [number, number][] = [
  [77.163, 28.592],
  [77.181, 28.598],
  [77.205, 28.607],
  [77.229, 28.612],
]

const routeInferred: [number, number][] = [
  [77.229, 28.612],
  [77.238, 28.619],
  [77.241, 28.628],
]

function OperationsMap({ selectedPlate, mode, expanded = false }: { selectedPlate: string; mode: 'replay' | 'paused'; expanded?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const [mapReady, setMapReady] = useState(false)
  const [layers, setLayers] = useState({ vehicles: true, routes: true, alerts: true, geofences: false, trails: true })
  const [following, setFollowing] = useState(true)
  const [speed, setSpeed] = useState(1)

  const selectedDetection = fixtureDetections.find(d => d.plate === selectedPlate) ?? fixtureDetections[0]
  const selectedRoute = selectedPlate === 'DL 8C AB 6214' ? routeObserved : [selectedDetection.location, selectedDetection.location]
  const selectedInference = selectedPlate === 'DL 8C AB 6214' ? routeInferred : [selectedDetection.location, selectedDetection.location]

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: 'https://tiles.openfreemap.org/styles/positron',
      center: [77.215, 28.606],
      zoom: expanded ? 11.1 : 11.4,
      attributionControl: false,
    })

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right')
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left')

    map.on('load', () => {
      setMapReady(true)
      map.addSource('observed-route', {
        type: 'geojson',
        data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: selectedRoute } },
      })
      map.addSource('inferred-route', {
        type: 'geojson',
        data: { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: selectedInference } },
      })

      map.addLayer({
        id: 'observed-glow',
        type: 'line',
        source: 'observed-route',
        paint: { 'line-color': '#FF9933', 'line-width': 9, 'line-opacity': 0.35, 'line-blur': 4 },
      })
      map.addLayer({
        id: 'observed-line',
        type: 'line',
        source: 'observed-route',
        paint: { 'line-color': '#E67E00', 'line-width': 3.5, 'line-opacity': 0.98 },
      })
      map.addLayer({
        id: 'inferred-line',
        type: 'line',
        source: 'inferred-route',
        paint: { 'line-color': '#000080', 'line-width': 2.8, 'line-opacity': 0.85, 'line-dasharray': [2, 2.5] },
      })

      cameraPoints.forEach(([lng, lat, id, place], index) => {
        const el = document.createElement('button')
        el.className = `camera-marker ${index === 0 ? 'is-active' : ''}`
        el.setAttribute('aria-label', `${id}, ${place}`)
        el.innerHTML = '<span></span>'
        new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat([lng, lat])
          .setPopup(new maplibregl.Popup({ offset: 18, closeButton: false }).setHTML(`<strong>${id}</strong><br/>${place}`))
          .addTo(map)
      })

      const target = document.createElement('div')
      target.className = 'vehicle-marker'
      target.innerHTML = `<span>${selectedPlate.slice(0, 2)}</span>`
      new maplibregl.Marker({ element: target, anchor: 'center' }).setLngLat(selectedDetection.location).addTo(map)
    })

    map.on('error', () => setMapReady(false))
    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [expanded, selectedPlate])

  useEffect(() => {
    const map = mapRef.current
    if (!mapReady || !map) return
    for (const id of ['observed-glow', 'observed-line']) {
      if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', layers.routes ? 'visible' : 'none')
    }
    if (map.getLayer('inferred-line')) {
      map.setLayoutProperty('inferred-line', 'visibility', layers.trails ? 'visible' : 'none')
    }
  }, [layers.routes, layers.trails, mapReady])

  const toggleLayer = (key: keyof typeof layers) => setLayers(current => ({ ...current, [key]: !current[key] }))
  const cycleSpeed = () => setSpeed(current => (current === 4 ? 0.5 : current === 0.5 ? 1 : current === 1 ? 2 : 4))

  return (
    <section className={`panel map-panel ${expanded ? 'map-expanded' : ''}`} aria-label="Live radar map">
      <div ref={containerRef} className="map-canvas" />
      {!mapReady && (
        <div className="map-fallback">
          <Radio size={30} />
          <span>Connecting to map layer</span>
        </div>
      )}
      {mode === 'replay' && <div className="map-scan" aria-hidden="true" />}
      <div className="panel-heading map-heading">
        <div>
          <p className="eyebrow"><span className="live-dot" /> Live radar · simulated</p>
          <h2>Delhi central network</h2>
        </div>
        <MagneticButton className="icon-button" aria-label="Map filters">
          <SlidersHorizontal size={17} />
        </MagneticButton>
      </div>
      <div className="target-chip">
        <Crosshair size={15} />
        <span><small>FOCUSED TARGET</small>{selectedPlate}</span>
        <strong>94%</strong>
      </div>
      <div className="map-legend">
        <span><i className="legend-observed" />Observed</span>
        <span><i className="legend-inferred" />Inferred</span>
        <span><i className="legend-camera" />Camera event</span>
      </div>
      <div className="timeline-control">
        <span className="timeline-state">{mode === 'replay' ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}</span>
        <div><span style={{ width: '64%' }} /></div>
        <time>10:42:18 IST</time>
        <button className="speed-button" onClick={cycleSpeed}>{speed}×</button>
      </div>
    </section>
  )
}

function StatCard({
  label, value, detail, tone, icon: Icon, onClick,
}: {
  label: string; value: string; detail: string; tone: string; icon: typeof Activity; onClick?: () => void
}) {
  const content = (
    <>
      <div className="stat-icon"><Icon size={19} /></div>
      <div className="stat-copy">
        <p>{label}</p>
        <strong>{value}</strong>
        <span>{detail}</span>
      </div>
      <div className="mini-bars" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
    </>
  )

  return (
    <TiltCard
      className={`stat-card tone-${tone}`}
      asButton={Boolean(onClick)}
      onClick={onClick}
    >
      {content}
    </TiltCard>
  )
}

function SectionHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="panel-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  )
}

function AlertCard({ alert, selected, onClick }: { alert: AlertRecord; selected: boolean; onClick: () => void }) {
  return (
    <TiltCard
      className={`alert-card ${selected ? 'selected' : ''}`}
      asButton
      onClick={onClick}
      selected={selected}
      tiltLimit={3}
    >
      <span className={`severity-mark ${alert.severity}`} />
      <span className="alert-main">
        <span className="alert-line">
          <b>{alert.plate}</b>
          <em>{alert.time}</em>
        </span>
        <strong>{alert.title}</strong>
        <small>{alert.camera} · {alert.status.replace('_', ' ')}</small>
      </span>
      <span className="confidence-ring" style={{ '--score': `${alert.confidence * 3.6}deg` } as React.CSSProperties} aria-label={`${alert.confidence}% confidence`}>
        <span>{alert.confidence}</span>
      </span>
      <ChevronRight size={16} className="alert-chevron" />
    </TiltCard>
  )
}

function AlertDrawer({
  alert, isOpen, onClose, onStatus,
}: {
  alert: AlertRecord; isOpen: boolean; onClose: () => void; onStatus: (s: AlertStatus) => void
}) {
  return (
    <SpringDrawer isOpen={isOpen} onClose={onClose} ariaLabel="Alert evidence">
      <div className="drawer-header">
        <div>
          <p className="eyebrow">{alert.id} · machine-correlated</p>
          <h2>{alert.plate}</h2>
        </div>
        <MagneticButton className="icon-button" onClick={onClose} aria-label="Close evidence drawer">
          <X size={18} />
        </MagneticButton>
      </div>
      <div className="evidence-visual">
        <div className="vehicle-silhouette">
          <span className="scan-line" />
          <span className="plate-box">{alert.plate.replaceAll(' ', '')}</span>
        </div>
        <span className="privacy-label"><ShieldCheck size={13} />Synthetic evidence · faces masked</span>
      </div>
      <div className="drawer-score">
        <div>
          <span>Association confidence</span>
          <strong>{alert.confidence}%</strong>
        </div>
        <p>Machine-generated assessment. Human confirmation is required before escalation.</p>
      </div>
      <section>
        <div className="section-title">
          <h3>Identity comparison</h3>
          <span>Registry mock</span>
        </div>
        <div className="comparison-row">
          <span>Observed</span>
          <strong>{alert.observed}</strong>
        </div>
        <div className="comparison-row">
          <span>Registered</span>
          <strong>{alert.registered}</strong>
        </div>
      </section>
      <section>
        <div className="section-title">
          <h3>Why this was flagged</h3>
          <span>{alert.evidence.length} signals</span>
        </div>
        <ul className="evidence-list">
          {alert.evidence.map((item, index) => (
            <li key={item}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {item}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <div className="section-title">
          <h3>Contrary evidence</h3>
          <span>review before action</span>
        </div>
        <ul className="evidence-list contrary">
          {alert.contraryEvidence.map(item => (
            <li key={item}>
              <span>—</span>
              {item}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <div className="metadata-grid">
          <span>Rule<strong>{alert.ruleVersion}</strong></span>
          <span>Model<strong>{alert.modelVersion}</strong></span>
          <span>Assigned<strong>{alert.assignedTo}</strong></span>
          <span>Integrity<strong>Hash verified</strong></span>
        </div>
      </section>
      <div className="drawer-actions three">
        <MagneticButton className="secondary-button" onClick={() => onStatus('dismissed')}>
          Reject
        </MagneticButton>
        <MagneticButton className="secondary-button" onClick={() => onStatus('pending')}>
          Pend
        </MagneticButton>
        <MagneticButton className="primary-button" onClick={() => onStatus('in_review')}>
          <Target size={16} />Confirm review
        </MagneticButton>
      </div>
    </SpringDrawer>
  )
}

function CameraCompact({ setPage }: { setPage: (p: PageName) => void }) {
  return (
    <section className="panel camera-panel">
      <SectionHeader
        eyebrow="Live node telemetry"
        title="Camera network"
        action={<button className="text-button" onClick={() => setPage('Camera Network')}>Manage <ChevronRight size={14} /></button>}
      />
      <div className="camera-table">
        {fixtureCameras.map(c => (
          <div className="camera-row" key={c.id}>
            <span className={`camera-status ${c.status.toLowerCase()}`}><Camera size={15} /></span>
            <span><strong>{c.id}</strong><small>{c.place}</small></span>
            <span className="health-value"><strong>{c.health}%</strong><small>Health</small></span>
            <span className="flow-value"><strong>{c.flow}</strong><small>veh/min</small></span>
            <ChevronRight size={15} />
          </div>
        ))}
      </div>
    </section>
  )
}

function CommandCentre({
  alerts, selectedAlert, openAlert, setPage, mode,
}: {
  alerts: AlertRecord[]; selectedAlert: AlertRecord; openAlert: (a: AlertRecord) => void; setPage: (p: PageName) => void; mode: 'replay' | 'paused'
}) {
  return (
    <motion.section
      className="dashboard-content"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
    >
      <div className="stats-grid">
        <StatCard label="Vehicles observed" value="24,892" detail="Today · 93.1% readable" tone="cyan" icon={Waypoints} onClick={() => setPage('Live Radar')} />
        <StatCard label="Active targets" value="03" detail="2 awaiting field review" tone="violet" icon={Target} onClick={() => setPage('Cases')} />
        <StatCard label="Open alerts" value={String(alerts.filter(a => !['resolved', 'dismissed'].includes(a.status)).length).padStart(2, '0')} detail="Human triage required" tone="amber" icon={Siren} onClick={() => setPage('Alerts')} />
        <StatCard label="Camera health" value="96%" detail="48 online · 2 degraded" tone="green" icon={Camera} onClick={() => setPage('Camera Network')} />
      </div>
      <div className="primary-grid">
        <OperationsMap selectedPlate={selectedAlert.plate} mode={mode} />
        <section className="panel alert-panel">
          <SectionHeader
            eyebrow="Requires attention"
            title="Alert queue"
            action={<button className="text-button" onClick={() => setPage('Alerts')}>View all <ChevronRight size={14} /></button>}
          />
          <div className="alert-summary">
            <span><i className="critical" />critical</span>
            <span><i className="review" />review</span>
            <span><i className="notice" />notice</span>
          </div>
          <div className="alerts-list">
            {alerts.slice(0, 3).map(a => (
              <AlertCard key={a.id} alert={a} selected={selectedAlert.id === a.id} onClick={() => openAlert(a)} />
            ))}
          </div>
          <div className="alert-footer">
            <Command size={14} />
            <span>Average triage time</span>
            <strong>01:42</strong>
          </div>
        </section>
      </div>
      <div className="secondary-grid">
        <section className="panel activity-panel">
          <SectionHeader
            eyebrow="Last 60 minutes"
            title="Network activity"
            action={<button className="text-button" onClick={() => setPage('Traffic Analytics')}>Detection rate <ChevronRight size={14} /></button>}
          />
          <div className="activity-chart" aria-label="Network activity chart">
            {[38, 48, 42, 61, 55, 69, 78, 65, 86, 72, 94, 82, 88, 76, 92, 87, 98, 91, 84, 96, 89, 93, 82, 97].map((h, i) => (
              <i key={i} style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="chart-axis">
            <span>09:45</span><span>10:00</span><span>10:15</span><span>10:30</span><span>Now</span>
          </div>
        </section>
        <CameraCompact setPage={setPage} />
      </div>
    </motion.section>
  )
}

function LiveRadarPage({
  mode, setMode, selectedPlate, detections,
}: {
  mode: 'replay' | 'paused'; setMode: (m: 'replay' | 'paused') => void; selectedPlate: string; detections: Detection[]
}) {
  const [tab, setTab] = useState<'today' | 'archive'>('today')
  const [day, setDay] = useState(fixtureDays[0])

  return (
    <motion.section
      className="workspace"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
    >
      <div className="workspace-toolbar">
        <div className="segmented">
          <button className={tab === 'today' ? 'active' : ''} onClick={() => setTab('today')}>
            <Radio size={14} />Live today
          </button>
          <button className={tab === 'archive' ? 'active' : ''} onClick={() => setTab('archive')}>
            <Archive size={14} />Recorded days
          </button>
        </div>
        <div className="freshness"><span className="live-dot" />Data freshness: 8 sec · IST</div>
      </div>
      {tab === 'today' ? (
        <div className="radar-layout">
          <OperationsMap selectedPlate={selectedPlate} mode={mode} expanded />
          <section className="panel event-rail">
            <SectionHeader eyebrow="Today · 25 Aug" title="Detection stream" action={<MagneticButton className="icon-button" aria-label="Detection filters"><ListFilter size={16} /></MagneticButton>} />
            <div className="event-list">
              {detections.map(d => (
                <TiltCard key={d.id} className="event-card" tiltLimit={2}>
                  <span className="event-index">{d.camera.replace('CAM-', '')}</span>
                  <div>
                    <strong>{d.plate}</strong>
                    <p>{d.place} · {d.direction}</p>
                    <small>{d.time} · {d.confidence}% OCR</small>
                  </div>
                  <span className="event-speed">{d.speed}<small>km/h</small></span>
                </TiltCard>
              ))}
            </div>
            <div className="replay-dock">
              <MagneticButton onClick={() => setMode(mode === 'replay' ? 'paused' : 'replay')}>
                {mode === 'replay' ? <Pause size={15} /> : <Play size={15} />}
                {mode === 'replay' ? 'Pause replay' : 'Resume replay'}
              </MagneticButton>
              <span>Observed events are solid; route interpolation is dashed.</span>
            </div>
          </section>
        </div>
      ) : (
        <div className="archive-layout">
          <section className="panel days-panel">
            <SectionHeader eyebrow="Automatic IST rollover" title="Recorded days" />
            <div className="day-list">
              {fixtureDays.map(d => (
                <TiltCard
                  key={d.iso}
                  asButton
                  className={`day-card ${day.iso === d.iso ? 'active' : ''}`}
                  onClick={() => setDay(d)}
                  selected={day.iso === d.iso}
                  tiltLimit={2}
                >
                  <CalendarDays size={16} />
                  <span>
                    <strong>{d.date}</strong>
                    <small>{d.detections.toLocaleString('en-IN')} detections</small>
                  </span>
                  <em>{d.coverage}% coverage</em>
                </TiltCard>
              ))}
            </div>
          </section>
          <section className="panel archive-detail">
            <SectionHeader eyebrow="Daily archive summary" title={day.date} action={<span className="status-chip verified"><FileCheck2 size={13} />Immutable index</span>} />
            <div className="archive-stats">
              <StatCard label="Detections" value={day.detections.toLocaleString('en-IN')} detail="Canonical event rows" tone="cyan" icon={Database} />
              <StatCard label="Active cameras" value={String(day.cameras)} detail={`${day.coverage}% coverage`} tone="green" icon={Camera} />
              <StatCard label="Readable plates" value={day.readable.toLocaleString('en-IN')} detail="OCR threshold met" tone="violet" icon={Eye} />
              <StatCard label="Alerts raised" value={String(day.alerts)} detail="Human-reviewable" tone="amber" icon={Siren} />
            </div>
            <div className="archive-explainer">
              <History size={22} />
              <div>
                <strong>No midnight copy job</strong>
                <p>This section reads the `recorded_days` view. The current IST day rolls into history automatically while UTC timestamps remain preserved.</p>
              </div>
            </div>
          </section>
        </div>
      )}
    </motion.section>
  )
}

function AlertsPage({
  alerts, selected, openAlert,
}: {
  alerts: AlertRecord[]; selected: AlertRecord; openAlert: (a: AlertRecord) => void
}) {
  const [filter, setFilter] = useState<'all' | AlertStatus>('all')
  const visible = filter === 'all' ? alerts : alerts.filter(a => a.status === filter)

  return (
    <motion.section
      className="workspace"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
    >
      <div className="workspace-toolbar">
        <div className="filter-row">
          {(['all', 'new', 'in_review', 'pending', 'resolved'] as const).map(f => (
            <button className={filter === f ? 'active' : ''} onClick={() => setFilter(f)} key={f}>
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
        <span className="freshness">Jurisdiction: Delhi Central · role-scoped</span>
      </div>
      <div className="triage-layout">
        <section className="panel triage-list">
          <SectionHeader eyebrow="Explainable alert management" title={`${visible.length} alerts`} />
          {visible.length ? (
            visible.map(a => (
              <AlertCard key={a.id} alert={a} selected={selected.id === a.id} onClick={() => openAlert(a)} />
            ))
          ) : (
            <div className="empty-state">
              <Check size={28} />
              <strong>No alerts in this state</strong>
              <span>Try another status filter.</span>
            </div>
          )}
        </section>
        <section className="panel triage-preview">
          <SectionHeader eyebrow={`${selected.id} · ${selected.status.replace('_', ' ')}`} title={selected.title} action={<span className={`status-chip ${selected.severity}`}>{selected.confidence}% confidence</span>} />
          <div className="triage-summary">
            <div className="evidence-visual compact">
              <div className="vehicle-silhouette">
                <span className="plate-box">{selected.plate.replaceAll(' ', '')}</span>
              </div>
            </div>
            <div className="identity-stack">
              <span>Observed<strong>{selected.observed}</strong></span>
              <span>Registry mock<strong>{selected.registered}</strong></span>
              <span>Assigned officer<strong>{selected.assignedTo}</strong></span>
            </div>
          </div>
          <div className="explanation-grid">
            <article>
              <h3>Triggering signals</h3>
              {selected.evidence.map(e => <p key={e}><Check size={13} />{e}</p>)}
            </article>
            <article>
              <h3>Contrary evidence</h3>
              {selected.contraryEvidence.map(e => <p key={e}><ShieldCheck size={13} />{e}</p>)}
            </article>
          </div>
          <MagneticButton className="primary-button preview-action" onClick={() => openAlert(selected)}>
            Open full evidence and actions
          </MagneticButton>
        </section>
      </div>
    </motion.section>
  )
}

function VehicleSearchPage({ detections, onFocus }: { detections: Detection[]; onFocus: (p: string) => void }) {
  const [query, setQuery] = useState('DL 8C AB 6214')
  const normalized = query.replace(/\s/g, '').toUpperCase()
  const results = detections.filter(d => d.plate.replace(/\s/g, '').includes(normalized) || d.ocrAlternatives.some(a => a.includes(normalized)))
  const unique = results.filter((d, i, a) => a.findIndex(x => x.plate === d.plate) === i)
  const timeline = detections.filter(d => d.plate === unique[0]?.plate)

  useEffect(() => {
    if (unique[0]) onFocus(unique[0].plate)
  }, [unique[0]?.plate, onFocus])

  return (
    <motion.section
      className="workspace"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
    >
      <div className="search-hero">
        <p className="eyebrow">OCR-tolerant vehicle query</p>
        <div>
          <Search size={21} />
          <input value={query} onChange={e => setQuery(e.target.value)} aria-label="Search plate" placeholder="Enter full or partial plate" />
          <MagneticButton>Search</MagneticButton>
        </div>
        <span>Matches normalized plates and stored OCR alternatives. Synthetic data only.</span>
      </div>
      {unique.length ? (
        <div className="vehicle-layout">
          <section className="panel identity-panel">
            <SectionHeader eyebrow="Best identity candidate" title={unique[0].plate} action={<span className="status-chip verified"><ShieldCheck size={13} />Registry consistent</span>} />
            <div className="vehicle-profile">
              <div className="evidence-visual compact">
                <div className="vehicle-silhouette"><span className="plate-box">{unique[0].plate.replaceAll(' ', '')}</span></div>
              </div>
              <div className="identity-stack">
                <span>Observed vehicle<strong>{unique[0].colour} · {unique[0].model}</strong></span>
                <span>OCR alternatives<strong>{unique[0].ocrAlternatives.join(' · ')}</strong></span>
                <span>Evidence integrity<strong>{unique[0].evidenceHash}</strong></span>
                <span>Access level<strong>Operational · synthetic</strong></span>
              </div>
            </div>
            <SectionHeader eyebrow="Chronological observations" title={`${timeline.length} camera sightings`} />
            <div className="route-timeline">
              {timeline.map((d, i) => (
                <article key={d.id}>
                  <span>{i + 1}</span>
                  <div>
                    <strong>{d.camera} · {d.place}</strong>
                    <p>{d.time} / {d.utc}</p>
                    <small>{d.direction} · {d.speed} km/h · OCR {d.confidence}%</small>
                  </div>
                  <em>{i === timeline.length - 1 ? 'LAST SEEN' : 'OBSERVED'}</em>
                </article>
              ))}
            </div>
          </section>
          <OperationsMap selectedPlate={unique[0].plate} mode="paused" expanded />
        </div>
      ) : (
        <div className="empty-state panel">
          <Search size={30} />
          <strong>No matching synthetic observation</strong>
          <span>Try DL8CAB6214, HR26DK9081 or UP16CV4402.</span>
        </div>
      )}
    </motion.section>
  )
}

function CasesPage({ cases, setCases }: { cases: CaseRecord[]; setCases: React.Dispatch<React.SetStateAction<CaseRecord[]>> }) {
  const [filter, setFilter] = useState<'all' | CaseStatus>('all')
  const [selectedId, setSelectedId] = useState(cases[0].id)
  const selected = cases.find(c => c.id === selectedId) ?? cases[0]
  const visible = filter === 'all' ? cases : cases.filter(c => c.status === filter)

  const update = (status: CaseStatus) =>
    setCases(current =>
      current.map(c =>
        c.id === selected.id
          ? {
              ...c,
              status,
              events: [
                ...c.events,
                `${new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' }).format(new Date())} · Status changed to ${status} by Arjun Sharma`,
              ],
            }
          : c
      )
    )

  return (
    <motion.section
      className="workspace"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
    >
      <div className="workspace-toolbar">
        <div className="filter-row">
          {(['all', 'live', 'pending', 'resolved'] as const).map(f => (
            <button className={filter === f ? 'active' : ''} onClick={() => setFilter(f)} key={f}>
              {f}
            </button>
          ))}
        </div>
        <span className="freshness">All state changes create an audit event</span>
      </div>
      <div className="case-layout">
        <section className="panel case-list">
          <SectionHeader eyebrow="Target lifecycle" title={`${visible.length} cases`} />
          {visible.map(c => (
            <TiltCard
              asButton
              className={`case-card ${selected.id === c.id ? 'active' : ''}`}
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              selected={selected.id === c.id}
              tiltLimit={2.5}
            >
              <span className={`priority p${c.priority}`}>P{c.priority}</span>
              <span><strong>{c.title}</strong><small>{c.id} · {c.plate}</small></span>
              <em>{c.status}</em>
            </TiltCard>
          ))}
        </section>
        <section className="panel case-workspace">
          <SectionHeader eyebrow={selected.id} title={selected.title} action={<span className={`status-chip ${selected.status}`}>{selected.status}</span>} />
          <div className="case-meta">
            <span>Owner<strong>{selected.owner}</strong></span>
            <span>Review deadline<strong>{selected.deadline}</strong></span>
            <span>Authority / purpose<strong>{selected.authority}</strong></span>
            <span>Priority<strong>P{selected.priority}</strong></span>
          </div>
          <article className="case-reason">
            <ShieldCheck size={20} />
            <div>
              <strong>Reason for target state</strong>
              <p>{selected.reason}</p>
            </div>
          </article>
          <SectionHeader eyebrow="Append-only history" title="Audit timeline" />
          <div className="audit-timeline">
            {selected.events.map((e, i) => (
              <p key={`${e}-${i}`}><span /><strong>{e}</strong></p>
            ))}
          </div>
          <div className="case-actions">
            <MagneticButton onClick={() => update('pending')} className="secondary-button">
              Move to pending
            </MagneticButton>
            <MagneticButton onClick={() => update('live')} className="secondary-button">
              Resume case
            </MagneticButton>
            <MagneticButton onClick={() => update('resolved')} className="primary-button">
              <Check size={15} />Resolve with reason
            </MagneticButton>
          </div>
        </section>
      </div>
    </motion.section>
  )
}

function TrafficPage() {
  const [period, setPeriod] = useState('Live 15 min')

  return (
    <motion.section
      className="workspace"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
    >
      <div className="workspace-toolbar">
        <div className="segmented">
          {['Live 15 min', 'Today', '7-day comparison'].map(p => (
            <button key={p} className={period === p ? 'active' : ''} onClick={() => setPeriod(p)}>
              {p}
            </button>
          ))}
        </div>
        <span className="freshness">Aggregate view · vehicle identities suppressed</span>
      </div>
      <div className="analytics-grid">
        <section className="panel density-panel">
          <SectionHeader eyebrow="Lane-aware adaptive timing" title="Corridor density and signal recommendation" action={<span className="status-chip review">Decision support only</span>} />
          <div className="corridor-list">
            {corridors.map(c => (
              <article key={c.name}>
                <div>
                  <strong>{c.name}</strong>
                  <small>Average speed {c.speed} km/h · trend {c.trend}</small>
                </div>
                <div className="density-meter"><span style={{ width: `${c.density}%` }} /></div>
                <em>{c.density}%<small>density</small></em>
                <b>{c.signal}s<small>suggested green</small></b>
              </article>
            ))}
          </div>
          <div className="analytics-note">
            <Gauge size={20} />
            <p><strong>How it links to ANPR:</strong> anonymous lane counts, dwell time and camera-to-camera travel time estimate queue pressure. Plate tokens are discarded from this aggregate view; signal recommendations remain subject to controller safety constraints.</p>
          </div>
        </section>
        <section className="panel od-panel">
          <SectionHeader eyebrow="Origin–destination aggregation" title="Movement corridors" />
          <div className="od-visual">
            <span className="od-node n1">Dhaula Kuan</span>
            <span className="od-node n2">ITO</span>
            <span className="od-node n3">Ashram</span>
            <span className="od-node n4">India Gate</span>
            <i className="arc a1" />
            <i className="arc a2" />
            <i className="arc a3" />
          </div>
          <div className="coverage-row">
            <span>Coverage quality<strong>94%</strong></span>
            <span>Active lanes<strong>112 / 118</strong></span>
            <span>Clock synchronized<strong>47 / 50</strong></span>
          </div>
        </section>
      </div>
    </motion.section>
  )
}

function CamerasPage() {
  const [selected, setSelected] = useState(fixtureCameras[2])

  return (
    <motion.section
      className="workspace"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
    >
      <div className="camera-workspace">
        <section className="panel camera-directory">
          <SectionHeader eyebrow="50 authorized nodes · 4 shown" title="Camera health" action={<MagneticButton className="icon-button"><ListFilter size={15} /></MagneticButton>} />
          {fixtureCameras.map(c => (
            <TiltCard
              asButton
              key={c.id}
              className={`camera-detail-row ${selected.id === c.id ? 'active' : ''}`}
              onClick={() => setSelected(c)}
              selected={selected.id === c.id}
              tiltLimit={2}
            >
              <span className={`camera-status ${c.status.toLowerCase()}`}><Camera size={16} /></span>
              <span><strong>{c.id} · {c.place}</strong><small>{c.heartbeat} · OCR {c.ocr}%</small></span>
              <em>{c.status}</em>
            </TiltCard>
          ))}
        </section>
        <section className="panel camera-inspector">
          <SectionHeader eyebrow={`${selected.id} · ${selected.status}`} title={selected.place} action={<span className={`status-chip ${selected.status.toLowerCase()}`}>{selected.health}% health</span>} />
          <div className="camera-preview">
            <Camera size={40} />
            <span>Authorized preview loads on demand</span>
            <small>Synthetic placeholder · no unrestricted CCTV access</small>
          </div>
          <div className="camera-metrics">
            <span>Last heartbeat<strong>{selected.heartbeat}</strong></span>
            <span>OCR quality<strong>{selected.ocr}%</strong></span>
            <span>Flow<strong>{selected.flow} veh/min</strong></span>
            <span>Bearing<strong>{selected.bearing}</strong></span>
            <span>Diagnostics<strong>{selected.issue}</strong></span>
            <span>Clock status<strong>{selected.issue.includes('clock') ? 'Needs sync' : 'Synchronized'}</strong></span>
          </div>
          <article className="maintenance-note">
            <ShieldCheck size={18} />
            <p><strong>Maintenance priority:</strong> {selected.status === 'Degraded' ? 'High—blur and timestamp offset can reduce cross-camera association confidence.' : 'Normal monitoring; no intervention required.'}</p>
          </article>
        </section>
      </div>
    </motion.section>
  )
}

export default function App() {
  const [page, setPage] = useState<PageName>('Command Centre')
  const [alerts, setAlerts] = useState<AlertRecord[]>(initialAlerts)
  const [cases, setCases] = useState<CaseRecord[]>(initialCases)
  const [detections, setDetections] = useState<Detection[]>(fixtureDetections)
  const [selectedAlert, setSelectedAlert] = useState(initialAlerts[0])
  const [selectedPlate, setSelectedPlate] = useState(initialAlerts[0].plate)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mode, setMode] = useState<'replay' | 'paused'>('replay')
  const [now, setNow] = useState(new Date())
  const [globalQuery, setGlobalQuery] = useState('')

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    operationsApi.getTodayDetections().then(setDetections)
    return () => window.clearInterval(timer)
  }, [])

  const time = useMemo(
    () => new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' }).format(now),
    [now]
  )
  const date = useMemo(
    () => new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(now).toUpperCase(),
    [now]
  )

  const openAlert = (alert: AlertRecord) => {
    setSelectedAlert(alert)
    setSelectedPlate(alert.plate)
    setDrawerOpen(true)
  }

  const changeAlertStatus = (status: AlertStatus) => {
    setAlerts(current =>
      current.map(a => (a.id === selectedAlert.id ? { ...a, status, assignedTo: a.assignedTo === 'Unassigned' ? 'Arjun Sharma' : a.assignedTo } : a))
    )
    setSelectedAlert(a => ({ ...a, status, assignedTo: a.assignedTo === 'Unassigned' ? 'Arjun Sharma' : a.assignedTo }))
    setDrawerOpen(false)
  }

  const submitGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (globalQuery.trim()) {
      setSelectedPlate(globalQuery.toUpperCase())
      setPage('Vehicle Search')
    }
  }

  let content: React.ReactNode
  if (page === 'Command Centre') content = <CommandCentre alerts={alerts} selectedAlert={selectedAlert} openAlert={openAlert} setPage={setPage} mode={mode} />
  else if (page === 'Live Radar') content = <LiveRadarPage mode={mode} setMode={setMode} selectedPlate={selectedPlate} detections={detections} />
  else if (page === 'Alerts') content = <AlertsPage alerts={alerts} selected={selectedAlert} openAlert={openAlert} />
  else if (page === 'Vehicle Search') content = <VehicleSearchPage detections={detections} onFocus={setSelectedPlate} />
  else if (page === 'Cases') content = <CasesPage cases={cases} setCases={setCases} />
  else if (page === 'Traffic Analytics') content = <TrafficPage />
  else content = <CamerasPage />

  return (
    <div className="app-shell">
      {/* Dynamic Cursor-following Ambient Saffron/Green Glow */}
      <AmbientGlow />

      <aside className="sidebar">
        <div className="brand" aria-label="BharatANPR home">
          <div className="brand-mark">
            <CircleDot size={22} />
          </div>
          <div>
            <strong>BHARAT</strong>
            <span>ANPR</span>
          </div>
        </div>

        <nav aria-label="Primary navigation">
          <p>OPERATIONS</p>
          {navItems.map(({ label, icon: Icon, count }) => (
            <MagneticButton
              key={label}
              className={`nav-button ${page === label ? 'active' : ''}`}
              onClick={() => setPage(label)}
            >
              <Icon size={18} />
              <span>{label}</span>
              {count && (
                <em>
                  {label === 'Alerts' ? alerts.filter(a => !['resolved', 'dismissed'].includes(a.status)).length : count}
                </em>
              )}
            </MagneticButton>
          ))}
        </nav>

        <div className="sidebar-status">
          <div>
            <Radio size={15} />
            <span>
              <strong>Simulation stable</strong>
              <small>48 of 50 nodes online</small>
            </span>
          </div>
          <div className="health-track">
            <span />
          </div>
        </div>

        <button className="profile">
          <span className="avatar">AS</span>
          <span>
            <strong>Arjun Sharma</strong>
            <small>Control Officer · Central</small>
          </span>
          <ChevronRight size={15} />
        </button>
      </aside>

      <main>
        <header className="topbar">
          <div>
            <p className="eyebrow">Unified vehicle intelligence</p>
            <h1>{page}</h1>
          </div>

          <form className="global-search" onSubmit={submitGlobalSearch}>
            <Search size={17} />
            <input
              value={globalQuery}
              onChange={e => setGlobalQuery(e.target.value)}
              aria-label="Search vehicles or cases"
              placeholder="Search plate, vehicle or case…"
            />
            <kbd>↵</kbd>
          </form>

          <div className="top-actions">
            <div className="mode-switch">
              <button
                type="button"
                className={mode === 'replay' ? 'active' : ''}
                onClick={() => setMode('replay')}
              >
                <Play size={13} fill="currentColor" />Replay
              </button>
              <button
                type="button"
                className={mode === 'paused' ? 'active' : ''}
                onClick={() => setMode('paused')}
              >
                <Pause size={13} fill="currentColor" />Paused
              </button>
            </div>

            <MagneticButton className="icon-button notification" aria-label="Notifications">
              <Bell size={18} />
              <i />
            </MagneticButton>

            <div className="clock">
              <strong>{time}</strong>
              <span>IST · {date}</span>
            </div>
          </div>
        </header>

        <div className="simulation-banner">
          <ShieldCheck size={15} />
          <strong>SIMULATION MODE</strong>
          <span>All records and events are synthetic. Restricted government integrations are mocked.</span>
          <button onClick={() => setPage('Live Radar')}>View scenario</button>
        </div>

        {content}
      </main>

      {/* Spring Drawer with AnimatePresence */}
      <AlertDrawer
        alert={selectedAlert}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onStatus={changeAlertStatus}
      />
    </div>
  )
}
