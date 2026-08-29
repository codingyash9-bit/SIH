export type Severity = 'critical' | 'review' | 'notice'
export type AlertStatus = 'new' | 'in_review' | 'pending' | 'resolved' | 'dismissed'
export type CaseStatus = 'live' | 'pending' | 'resolved'

export type Detection = {
  id: string
  plate: string
  camera: string
  place: string
  time: string
  utc: string
  confidence: number
  colour: string
  model: string
  direction: string
  speed: number
  location: [number, number]
  evidenceHash: string
  ocrAlternatives: string[]
}

export type AlertRecord = {
  id: string
  plate: string
  title: string
  camera: string
  time: string
  confidence: number
  severity: Severity
  status: AlertStatus
  evidence: string[]
  contraryEvidence: string[]
  observed: string
  registered: string
  ruleVersion: string
  modelVersion: string
  assignedTo: string
}

export type CaseRecord = {
  id: string
  title: string
  plate: string
  status: CaseStatus
  priority: number
  owner: string
  opened: string
  deadline: string
  reason: string
  authority: string
  events: string[]
}

export const detections: Detection[] = [
  { id: 'DET-8821', plate: 'DL 8C AB 6214', camera: 'CAM-017', place: 'Dhaula Kuan', time: '10:24:08 IST', utc: '04:54:08 UTC', confidence: 96, colour: 'White', model: 'Hyundai Creta', direction: 'Eastbound', speed: 41, location: [77.163, 28.592], evidenceHash: 'sha256:a12f…90d2', ocrAlternatives: ['DL8CAB6214', 'DL8CAB62I4'] },
  { id: 'DET-8829', plate: 'DL 8C AB 6214', camera: 'CAM-009', place: 'India Gate', time: '10:35:42 IST', utc: '05:05:42 UTC', confidence: 94, colour: 'White', model: 'Hyundai Creta', direction: 'North-east', speed: 36, location: [77.229, 28.612], evidenceHash: 'sha256:b18c…e821', ocrAlternatives: ['DL8CAB6214', 'DL8CABG214'] },
  { id: 'DET-8836', plate: 'DL 8C AB 6214', camera: 'CAM-042', place: 'ITO Junction', time: '10:42:18 IST', utc: '05:12:18 UTC', confidence: 94, colour: 'White', model: 'Hyundai Creta', direction: 'Northbound', speed: 29, location: [77.241, 28.628], evidenceHash: 'sha256:9bc4…771a', ocrAlternatives: ['DL8CAB6214', 'DL8CABG214'] },
  { id: 'DET-8832', plate: 'HR 26 DK 9081', camera: 'CAM-017', place: 'Dhaula Kuan', time: '10:39:12 IST', utc: '05:09:12 UTC', confidence: 87, colour: 'Black', model: 'Toyota Fortuner', direction: 'Southbound', speed: 34, location: [77.163, 28.592], evidenceHash: 'sha256:1c84…2caa', ocrAlternatives: ['HR26DK9081', 'HR26DK9O81'] },
  { id: 'DET-8814', plate: 'UP 16 CV 4402', camera: 'CAM-031', place: 'Ashram Chowk', time: '10:18:51 IST', utc: '04:48:51 UTC', confidence: 78, colour: 'Blue', model: 'Maruti Baleno', direction: 'Westbound', speed: 22, location: [77.259, 28.572], evidenceHash: 'sha256:819e…bb42', ocrAlternatives: ['UP16CV4402', 'UP16CV44O2'] },
]

export const initialAlerts: AlertRecord[] = [
  { id: 'ALT-2041', plate: 'DL 8C AB 6214', title: 'Suspected clone pair', camera: 'CAM-DL-042 · ITO Junction', time: '12 sec ago', confidence: 94, severity: 'critical', status: 'new', evidence: ['Impossible travel: 18.4 km in 4 min', 'Same plate, different visual fingerprint', 'OCR exact match across two cameras'], contraryEvidence: ['Observed class and registered class agree', 'Low-resolution rear crop limits plate-physical analysis'], observed: 'White · Hyundai Creta', registered: 'White · Hyundai Creta', ruleVersion: 'clone-feasibility/1.4.2', modelVersion: 'anpr-fusion/0.9.6', assignedTo: 'Unassigned' },
  { id: 'ALT-2039', plate: 'HR 26 DK 9081', title: 'Registry colour mismatch', camera: 'CAM-DL-017 · Dhaula Kuan', time: '46 sec ago', confidence: 87, severity: 'review', status: 'in_review', evidence: ['Observed colour: black', 'Registry colour: silver', 'Two confirming sightings'], contraryEvidence: ['Strong night lighting may affect colour estimation'], observed: 'Black · Toyota Fortuner', registered: 'Silver · Toyota Fortuner', ruleVersion: 'attribute-match/2.1.0', modelVersion: 'vehicle-attributes/1.3.1', assignedTo: 'Arjun Sharma' },
  { id: 'ALT-2036', plate: 'UP 16 CV 4402', title: 'Low-confidence OCR resolved', camera: 'CAM-DL-031 · Ashram Chowk', time: '2 min ago', confidence: 78, severity: 'notice', status: 'pending', evidence: ['Initial OCR: UP16CV44O2', 'Second camera consensus', 'Vehicle attributes consistent'], contraryEvidence: ['Initial plate crop contains motion blur'], observed: 'Blue · Maruti Baleno', registered: 'Blue · Maruti Baleno', ruleVersion: 'ocr-consensus/1.8.3', modelVersion: 'ocr-india/0.7.4', assignedTo: 'Meera Nair' },
]

export const initialCases: CaseRecord[] = [
  { id: 'CASE-DL-2026-031', title: 'Clone feasibility review', plate: 'DL 8C AB 6214', status: 'live', priority: 1, owner: 'Arjun Sharma', opened: '10:44 IST', deadline: 'Today · 14:00 IST', reason: 'Two physical fingerprints associated with one plate and an impossible travel interval.', authority: 'Prototype scenario / synthetic evidence', events: ['10:44 · Case opened from ALT-2041', '10:47 · Assigned to Arjun Sharma', '10:51 · Camera sequence preserved'] },
  { id: 'CASE-DL-2026-028', title: 'Vehicle colour verification', plate: 'HR 26 DK 9081', status: 'pending', priority: 2, owner: 'Meera Nair', opened: '09:36 IST', deadline: '26 Aug · 11:00 IST', reason: 'Observed colour differs from mock registry snapshot.', authority: 'Prototype scenario / synthetic evidence', events: ['09:36 · Alert accepted for review', '09:42 · Awaiting second daylight sighting'] },
  { id: 'CASE-DL-2026-024', title: 'OCR consensus audit', plate: 'UP 16 CV 4402', status: 'resolved', priority: 4, owner: 'Kabir Singh', opened: '08:15 IST', deadline: 'Resolved · 09:02 IST', reason: 'Low-confidence OCR was resolved by repeated observation.', authority: 'Prototype scenario / synthetic evidence', events: ['08:15 · Case opened', '08:44 · Second camera consensus received', '09:02 · Closed: identity consistent'] },
]

export const cameras = [
  { id: 'CAM-042', place: 'ITO Junction', status: 'Online', health: 98, flow: 126, heartbeat: '8 sec ago', ocr: 96, issue: 'None', bearing: '024°' },
  { id: 'CAM-017', place: 'Dhaula Kuan', status: 'Online', health: 94, flow: 184, heartbeat: '5 sec ago', ocr: 92, issue: 'Mild glare', bearing: '112°' },
  { id: 'CAM-031', place: 'Ashram Chowk', status: 'Degraded', health: 72, flow: 151, heartbeat: '31 sec ago', ocr: 71, issue: 'Blur · clock +420 ms', bearing: '278°' },
  { id: 'CAM-009', place: 'India Gate', status: 'Online', health: 96, flow: 83, heartbeat: '11 sec ago', ocr: 95, issue: 'None', bearing: '046°' },
]

export const recordedDays = [
  { date: '25 Aug 2026', iso: '2026-08-25', detections: 24892, cameras: 48, readable: 23178, alerts: 7, coverage: 96 },
  { date: '24 Aug 2026', iso: '2026-08-24', detections: 184306, cameras: 50, readable: 171420, alerts: 23, coverage: 98 },
  { date: '23 Aug 2026', iso: '2026-08-23', detections: 176884, cameras: 49, readable: 162908, alerts: 19, coverage: 95 },
  { date: '22 Aug 2026', iso: '2026-08-22', detections: 191022, cameras: 50, readable: 180144, alerts: 28, coverage: 99 },
]

export const corridors = [
  { name: 'Dhaula Kuan → AIIMS', density: 92, speed: 18, signal: 78, trend: '+16%' },
  { name: 'ITO → Mandi House', density: 81, speed: 23, signal: 64, trend: '+9%' },
  { name: 'Ashram → Lajpat Nagar', density: 74, speed: 27, signal: 58, trend: '-3%' },
  { name: 'India Gate → Pragati Maidan', density: 53, speed: 39, signal: 42, trend: '-11%' },
]

