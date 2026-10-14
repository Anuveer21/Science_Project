# System Architecture: Smart Farm AI

## 1. System Overview

```
                      +----------------------------------+
                      |         Patrol Car (Field)       |
                      |  - Preserved movement firmware   |
                      |  - Camera module (Future)        |
                      +-----------------+----------------+
                                        | (Planned Wi-Fi Frame Post)
                                        v
+-----------------------+     +--------------------------+     +--------------------------+
|  ESP32 Telemetry Node |     |  Node/Express Host Server|     |     Google Gemini API    |
|  - Soil Moisture ADC  | --> |  - Port 3000             | --> |  Model: gemini-3.8-flash |
|  - DHT22 Temp/Humidity|     |  - API validation & auth |     |  - Structured vision JSON|
|  - Relay Actuator Pin |     |  - Vite SPA Middleware   |     |  - Server-side secret    |
+-----------------------+     +------------+-------------+     +--------------------------+
                                           |
                                           | HTTP / REST
                                           v
                              +--------------------------+
                              |   Operator Browser UI    |
                              |  - Crop Monitoring       |
                              |  - Telemetry Dashboard   |
                              |  - System Diagnostics    |
                              +--------------------------+
```

---

## 2. Frontend & Backend Responsibilities

### Frontend (React 19 + TypeScript + Tailwind CSS)
- **Zero API Secret Exposure**: Does not import `@google/genai` or store keys in browser memory.
- **Client Validation**: Validates image MIME type (JPEG/PNG/WebP) and file size ($\le 10\text{MB}$) before upload.
- **UI State Machine**: Handles file selection, preview, loading progress, structured diagnosis rendering, and historical session logs.
- **Hardware Telemetry Representation**: Enforces strict disconnected states when hardware is offline.

### Backend (Node.js + Express 4)
- **Port 3000 Convergence**: Serves API endpoints (`/api/*`) and mounts Vite middleware in development (`server.ts`).
- **Gemini Vision Integration**: Reads `process.env.GEMINI_API_KEY`, configures `GoogleGenAI` with `User-Agent: aistudio-build`, sends image data as base64 inline parts, and enforces strict JSON schemas (`Type.OBJECT`).
- **Error Shielding**: Catches quota exhaustion, invalid keys, or malformed data and responds with sanitized error descriptions without dumping internal stack traces.

---

## 3. Gemini Image Analysis Workflow

```
[User / Patrol Car]
        |
        | 1. Selects image / Captures frame
        v
[Browser / Client]
        |
        | 2. Validates format (JPEG/PNG/WebP) and size (<10MB)
        | 3. Encodes to Base64
        v
[POST /api/analyze-image]
        |
        | 4. Server verifies presence of GEMINI_API_KEY
        | 5. Calls ai.models.generateContent({ model: 'gemini-3.8-flash', ... })
        |    with strict agronomic system prompt & JSON response schema
        v
[Google Gemini Cloud]
        |
        | 6. Returns structured JSON containing plant_identification,
        |    observed_symptoms, possible_issues, recommendations, uncertainty_notes
        v
[Backend Validation]
        |
        | 7. Parses JSON, attaches metadata ID and timestamp
        v
[Operator Dashboard]
        |
        | 8. Displays verified visual observations vs. unconfirmed hypotheses
```

---

## 4. API Endpoints

### `GET /api/health`
Returns service health, version, and uptime.
- **Response**:
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-10-13T17:00:00.000Z",
    "uptime": 124,
    "version": "1.0.0",
    "service": "Smart Farm AI Backend"
  }
  ```

### `GET /api/system-status`
Returns status of host backend, Gemini AI configuration, and hardware connection flags.
- **Response**:
  ```json
  {
    "timestamp": "2026-10-13T17:00:00.000Z",
    "backend": { "status": "online", "runtime": "Node.js / Express", "port": 3000 },
    "ai": { "provider": "Google Gemini", "model": "gemini-3.8-flash", "configured": true },
    "hardware": {
      "patrolCar": { "connected": false, "status": "disconnected" },
      "esp32Sensor": { "connected": false, "status": "disconnected" },
      "irrigationController": { "connected": false, "status": "disconnected" }
    }
  }
  ```

### `POST /api/analyze-image`
Analyzes a crop image payload using Gemini 3.8 Flash.
- **Payload**: `{ "image": "data:image/jpeg;base64,...", "mimeType": "image/jpeg", "filename": "leaf.jpg" }`
- **Response**: Structured `CropAnalysisResult` object.

---

## 5. Future Hardware Integration Boundaries

### Patrol Car Camera Bridge (Planned)
- The car retains independent movement firmware.
- Camera frames will be transmitted over Wi-Fi via `POST /api/patrol/frame` as multipart or JPEG stream.
- No remote steering control is permitted through the AI dashboard to protect physical drive trains.

### ESP32 Telemetry Node (Planned)
- ESP32 connects to local Wi-Fi and sends structured JSON:
  `POST /api/telemetry/report`
- Ingested fields: `temperature_c`, `humidity_rh`, `soil_moisture_pct`, `battery_mv`.

### Irrigation Safety Interlock (Non-AI)
- AI observations are strictly non-actuating.
- Watering pump triggers rely on deterministic threshold equations:
  $$\text{Trigger} = (\text{Moisture} < \text{Threshold}_{\text{min}}) \land (\text{TimeSinceLastRun} > \Delta T) \land (\text{Watchdog} \le 45\text{s})$$
