# Smart Farm AI

> Precision crop diagnostics and environmental monitoring dashboard developed for the November 2, 2026 science competition.

## Project Overview

Smart Farm AI is a specialized edge-and-cloud agronomic platform. It provides field operators with:
- Automated multimodal crop disease, pest, and nutrient stress diagnosis using Google Gemini vision models (`gemini-3.8-flash`).
- Structured separation between visible physical symptoms and unconfirmed hypothetical diagnoses.
- Environmental telemetry ingestion architecture for ESP32-based sensors (soil moisture, temperature, humidity).
- Safety-isolated irrigation controls with deterministic rule enforcement (AI direct pump actuation is prohibited).
- Preserved hardware boundaries for future patrol car camera bridge integration.

---

## Technologies Used

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Backend**: Node.js, Express 4, `tsx`
- **AI / Vision**: `@google/genai` TypeScript SDK (model: `gemini-3.8-flash`)
- **Build & Dev**: Vite 8 with Express development middleware
- **Target OS**: Windows 11 (16GB RAM, standard integrated CPU/graphics)

---

## Prerequisites (Windows 11)

- **Node.js**: v20.x or v22.x LTS ([Download Node.js](https://nodejs.org/))
- **npm**: v10.x+ (bundled with Node.js)
- **Git**: (Optional, for version control)
- **Gemini API Key**: Obtainable from Google AI Studio ([https://aistudio.google.com/](https://aistudio.google.com/))

---

## Installation & Setup on Windows 11

1. **Clone or Open the Project Directory**:
   ```powershell
   cd smart-farm-ai
   ```

2. **Install Dependencies**:
   ```powershell
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```powershell
   copy .env.example .env
   ```
   Open `.env` in Notepad or VS Code and set your key:
   ```env
   GEMINI_API_KEY="AIzaSy..."
   GEMINI_MODEL="gemini-3.8-flash"
   ```
   *(Note: Never commit `.env` containing your real secret key).*

4. **Launch the Full-Stack Development Server**:
   ```powershell
   npm run dev
   ```
   The application will start on `http://localhost:3000`.

---

## Available Commands

| Command | Action |
|---|---|
| `npm run dev` | Starts the Express full-stack backend with Vite middleware on port 3000 |
| `npm run build` | Compiles frontend assets into `dist/` |
| `npm run start` | Runs the Express server in production mode serving `dist/` |
| `npm run lint` | Runs TypeScript compiler checks (`tsc --noEmit`) |

---

## API Configuration & Endpoints

- `GET /api/health` — Returns server health, version, uptime, and status.
- `GET /api/system-status` — Subsystem prober (backend, Gemini model status, hardware link status).
- `POST /api/analyze-image` — Accepts base64 encoded crop image (`{ image, mimeType, filename }`) and queries Gemini 3.8 Flash using a strict JSON schema.

---

## Current Hardware State & Known Limitations

1. **Patrol Car**: Movement firmware has been preserved and is physically built. Camera wireless frame transmission bridge to the laptop backend is not yet active.
2. **ESP32 & Sensors**: Exact ADC pinouts and calibrated sensor models (capacitive soil moisture v1.2, DHT22/DS18B20) are awaiting physical bench testing. The dashboard strictly reports disconnected status with `0.0` to prevent fabricated telemetry.
3. **Irrigation Pump**: AI actuation is strictly disabled. Physical pump relays will only trigger on deterministic soil moisture thresholds with a hardware watchdog timer.
