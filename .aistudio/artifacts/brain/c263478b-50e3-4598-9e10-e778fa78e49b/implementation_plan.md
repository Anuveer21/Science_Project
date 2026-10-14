# Smart Farm AI — System Foundation Plan

A precision-agriculture monitoring dashboard and full-stack API foundation built for the November 2, 2026 smart farming competition. Integrates real-time crop image analysis via Google Gemini API with structured diagnostic schemas, telemetry management, and strict hardware boundaries.

### User Review & Critical Decisions

> [!IMPORTANT]
> The architectural foundation and scope decisions have been confirmed in Phase 1:
> - **Backend Runtime**: Node.js + Express full-stack architecture running Vite development middleware on port 3000 (`server.ts`).
> - **AI Vision Model**: `gemini-3.8-flash` via `@google/genai` with structured JSON schema output, system instructions, and server-side secret isolation.
> - **Hardware & Telemetry State**: Strict disconnected state with explicit offline indicators and zero fabricated metrics until physical ESP32 and patrol car devices handshake.
> - **Irrigation Safety Guardrail**: AI outputs are strictly diagnostic and advisory; automated or direct pump actuation is prohibited.

---

### 1. Overview & Core Concept

- **What It Does**: Provides an agronomic dashboard for field operators to upload or receive patrol car crop images, execute automated disease/pest diagnostics via Gemini 3.8 Flash, review verified observations vs. unconfirmed hypotheses, and monitor future ESP32 environmental sensors and irrigation status without hallucinated data.
- **Target Audience**: Field agronomists, competition evaluators, and system developers managing the patrol car and irrigation controllers.
- **Key Value**: Replaces guesswork with disciplined, structured visual assessment and establishes safe hardware boundaries before physical sensors go live.

---

### 2. User Experience & Visual Design

- **Visual Theme & Aesthetic**:
  - Precision agricultural aesthetic: Clean dark green (`#143823`), sage tones (`#4A6B53`), neutral slate backgrounds (`#F8FAF8` canvas, `#FFFFFF` cards, `#0F172A` text), and subtle amber/red alerts.
  - Zero-pill metadata discipline: Dates, categories, and confidence status formatted with typographic dots (`·`).
  - Strict anti-slop rules: No decorative pulsing dots, no fake telemetry widgets, no nested cards within cards, and no cartoonish illustrations.
- **Layout & Structure**:
  - Clean sidebar navigation (Overview, Crop Monitoring, Environmental, Irrigation, System Status).
  - Breadcrumb top-bar with active backend connection status and rapid upload action.
  - Crop Monitoring workspace: Drag-and-drop file upload with preview, file validation (JPEG/PNG/WebP, $\le 10\text{MB}$), live analysis state indicator, structured diagnosis breakdown (identification, symptoms, possible issues, recommendations, uncertainty notes), and chronological session history.
  - Environmental & Irrigation modules: Strict "Disconnected / Awaiting Hardware" notices with technical specifications and pinout targets, preventing fake data presentation.
  - System Status: Transparent health check diagnostics (Express server, Gemini API configuration check, patrol car link, ESP32 link) without ever exposing API keys.

---

### 3. Key Product Decisions & Trade-Offs

- **Node/Express Full-Stack vs. FastAPI**:
  - *Chosen*: Express server (`server.ts`) hosting both API routes (`/api/*`) and Vite asset serving.
  - *Why*: Perfectly conforms to the single-port development environment in AI Studio without needing multi-process orchestration or cross-origin proxy gymnastics, while reusing existing Node dependencies (`@google/genai`, `express`, `tsx`).
- **Structured JSON Schema via Gemini 3.8 Flash**:
  - *Chosen*: `ai.models.generateContent` with `responseMimeType: "application/json"` and strict `responseSchema` (Type.OBJECT).
  - *Why*: Eliminates unparseable markdown text, enforces clear distinction between confirmed symptoms and hypothetical diseases, and enforces explicit uncertainty notes.
- **Hardware Abstraction Boundaries**:
  - *Chosen*: Decoupled REST contracts (`/api/health`, `/api/system-status`, `/api/analyze-image`, `/api/telemetry/report`) with stubbed device listeners.
  - *Why*: Preserves patrol car movement code and prevents assumption of ESP32 pinouts or baud rates prior to hardware confirmation.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Browser                        │
│   (React 19 + TypeScript + Tailwind CSS + Lucide Icons)     │
│   - Overview Dashboard       - Crop Image Upload & Preview  │
│   - Diagnostic Card View     - Telemetry & Irrigation View  │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON (Port 3000)
┌──────────────────────────────▼──────────────────────────────┐
│                  Express Full-Stack Server                  │
│   - GET  /api/health         -> Service status check        │
│   - GET  /api/system-status  -> Subsystem connectivity      │
│   - POST /api/analyze-image  -> Multipart image handler     │
│   - Vite Dev / Static Middleware (SPA Fallback)             │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
┌──────────────▼──────────────┐ ┌──────────────▼──────────────┐
│     Google Gemini API       │ │  Future Hardware Handshake  │
│  Model: gemini-3.8-flash    │ │  - Patrol Car Camera Stream │
│  - Structured Vision Output │ │  - ESP32 Soil/DHT Sensors   │
│  - Server-Side Secret Key   │ │  - Deterministic Pump Rule  │
└─────────────────────────────┘ └─────────────────────────────┘
```

- **Required Documentation Assets**:
  - `README.md`: Setup, Windows 11 installation, environment configuration, command references.
  - `PROJECT_CONTEXT.md`: Objectives, confirmed requirements, current hardware state, multi-agent guide.
  - `ARCHITECTURE.md`: Subsystem boundaries, Gemini image flow, security & irrigation guardrails.
  - `CHANGELOG.md`: Initial foundation release records.
  - `TODO.md`: Categorized tracking (Implemented, In Progress, Blocked by Hardware).
