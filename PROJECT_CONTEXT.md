# PROJECT CONTEXT: Smart Farm AI

## 1. Project Objective
Build a specialized precision agriculture AI system for the Science Competition on **2 November 2026**.

The operational system combines:
1. A motorized patrol car capturing crop leaf and canopy images.
2. A Windows 11 laptop running a local Node/Express backend that receives frames.
3. Google Gemini Vision API (`gemini-3.8-flash`) analyzing crop imagery for symptoms, stress, and pests.
4. An ESP32 sensor node monitoring soil moisture, temperature, and humidity.
5. A web dashboard for monitoring crop health, environmental context, and irrigation safety.

---

## 2. Confirmed Requirements & Constraints
- **Preserve Patrol Car Code**: Movement-control code on the car is already verified and must NOT be rewritten.
- **Strict Separation of Observations vs. Diagnoses**: Gemini must never claim plant diseases as absolute facts from photography alone. Observations (chlorosis, lesions) are separated from hypotheses (Early Blight, Nitrogen deficiency).
- **Irrigation Safety Guardrail**: AI models NEVER actuate water valves or pumps. Actuation must be deterministic based on verified soil moisture probes with safety limits.
- **No Fabricated Telemetry**: In offline/disconnected states, sensors must display disconnected status and zero metrics, never synthetic or fake live data.
- **Server-Side API Key Isolation**: `GEMINI_API_KEY` resides strictly on the backend. No browser exposure.

---

## 3. Current Hardware Status
- **Patrol Car**: Built and mechanically operational. Camera module confirmed: **OV7670 VGA CMOS (640x480, 0.3MP)**. Auto-ingestion listener deployed at `POST /api/patrol/capture`.
- **ESP32 & Sensors**: Prototyped. Specific ADC pin assignments and calibration curves for soil capacitive sensors pending laboratory bench tests.
- **Irrigation Relays**: Disconnected. Reserved control interface locked.
- **Host Machine**: Windows 11 laptop, 16GB RAM, integrated graphics (no local GPU models needed; cloud Gemini API used).

---

## 4. Approved Architecture
- **Runtime**: Single-process full-stack Express server (`server.ts`) mounting Vite middleware in development on port 3000.
- **Model**: `gemini-3.8-flash` via `@google/genai` TypeScript SDK with strict `responseSchema` (Type.OBJECT) and `User-Agent: aistudio-build`.
- **Styling**: Tailwind CSS v4, Plus Jakarta Sans, JetBrains Mono for telemetry figures.

---

## 5. Features Implemented (Phase 1 Baseline)
- [x] Full-stack Express server on port 3000 with `/api/health`, `/api/system-status`, and `/api/analyze-image`.
- [x] Gemini 3.8 Flash structured schema integration for crop vision analysis.
- [x] Crop image upload dropzone with preview, format/size validation, and specimen presets.
- [x] Diagnostic card view distinguishing observed symptoms, possible hypotheses, uncertainty notes, and expert review triggers.
- [x] Crop analysis session history with search/filter.
- [x] Strict disconnected telemetry views for ESP32 and patrol car with zero fake metrics.
- [x] Safety-interlocked irrigation panel with deterministic rules specification.
- [x] System diagnostics panel with live health ping prober.

---

## 6. Features Not Yet Implemented
- [ ] Patrol car camera Wi-Fi / HTTP stream ingestion endpoint (`POST /api/patrol/frame`).
- [ ] Physical ESP32 telemetry packet ingestion endpoint (`POST /api/telemetry/report`).
- [ ] Deterministic soil moisture pump relay trigger driver on ESP32 GPIO.
- [ ] Persistent database for multi-week agronomic historical trends (e.g., SQLite/PostgreSQL once sensor rate is established).

---

## 7. Unresolved Hardware Decisions Requiring Human Approval
1. **Patrol Car Camera Module**: Camera hardware specification (ESP32-CAM vs. USB UVC vs. Raspberry Pi Cam) and transmission protocol (HTTP multipart vs. WebSocket).
2. **ESP32 Communication Protocol**: HTTP REST polling vs. MQTT broker for field telemetry.
3. **Moisture Threshold Baseline**: Exact calibration mV/resistance curve for the soil type used in the competition bed.

---

## 8. Instructions for Future AI Coding Agents
- **Ponytail Rule**: Be lazy in code quantity, rigorous in architecture. Omit useless libraries. Keep one-liners and platform native web standards where possible.
- **Do NOT Touch Car Movement Firmware**: Car navigation is out of scope for this repository.
- **Keep Model Configurable**: Keep `GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash'`.
- **Never Fake Live Data**: If a physical sensor is not sending live packets, display disconnected.
- **Never Allow AI to Drive Pump Relays Directly**: Always route pump triggers through deterministic threshold safety checks.
