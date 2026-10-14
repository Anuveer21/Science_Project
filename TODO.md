# TODO & Project Roadmap: Smart Farm AI

Competition Deadline: **2 November 2026**

---

## 1. Implemented
- [x] Initial full-stack Node.js + Express + React 19 architecture running on port 3000.
- [x] Server-side `@google/genai` SDK integration with `gemini-3.8-flash`.
- [x] Structured JSON schema for crop image analysis with uncertainty isolation.
- [x] Server API endpoints: `GET /api/health`, `GET /api/system-status`, `POST /api/analyze-image`.
- [x] API key protection and server-side secret isolation.
- [x] Crop image upload dropzone with preview, validation, and sample competition presets.
- [x] Diagnostic card interface separating symptoms from hypotheses.
- [x] Session analysis history with search filter.
- [x] Strict disconnected telemetry views for ESP32 and patrol car (no fake data).
- [x] Irrigation safety interlock and deterministic threshold specifications.
- [x] Complete project documentation (`README.md`, `PROJECT_CONTEXT.md`, `ARCHITECTURE.md`, `CHANGELOG.md`, `TODO.md`).

---

## 2. In Progress
- [ ] End-to-end testing of Gemini 3.8 Flash analysis against high-resolution field photos.
- [ ] Refinement of agronomic prompt guidelines for local competition crop species.

---

## 3. Not Started
- [ ] Batch image upload mode for processing multiple patrol car captures simultaneously.
- [ ] Local SQLite or lightweight JSON persistence for multi-day session export (CSV/JSON).
- [ ] Operator export function for competition presentation reports.

---

## 4. Blocked by Missing Hardware Information
- [ ] **Patrol Car Camera Stream Receiver**: Blocked until camera module model (ESP32-CAM vs USB webcam) and wireless stream protocol are confirmed.
- [ ] **ESP32 Telemetry Ingestion Driver**: Blocked until sensor pinouts (capacitive soil ADC channels, DHT22 GPIO) and transmission method (HTTP vs MQTT) are confirmed.
- [ ] **Pump Actuation Relay Circuit**: Blocked until relay module voltage (5V vs 3.3V) and pump flow-rate calibration are bench tested.
