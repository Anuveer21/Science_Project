# CHANGELOG

All notable changes to the Smart Farm AI platform will be documented in this file.

## [1.0.0] - 2026-10-13

### Added
- **Full-Stack Server Foundation**: Express server (`server.ts`) running on port 3000 mounting Vite middleware for unified development.
- **Health & Subsystem Status Endpoints**: Implemented `GET /api/health` and `GET /api/system-status`.
- **Gemini Vision Integration**: Configured `gemini-3.8-flash` with `@google/genai` TypeScript SDK, system instructions, and structured JSON output schemas (`plant_identification`, `observed_symptoms`, `possible_issues`, `condition_summary`, `recommendations`, `uncertainty_notes`, `requires_expert_review`).
- **Precision Agriculture Dashboard**:
  - Top Bar Contract with 3 zones (brand wordmark, navigation tabs, primary action).
  - Navigation sidebar across 5 core views (Overview, Crop Monitoring, Environmental, Irrigation, System Status).
  - Drag-and-drop crop image uploader with preview and file size/type validation.
  - Sample competition test specimens for immediate one-click diagnostic evaluation.
  - Diagnostic inspection card rendering observed symptoms vs. hypothetical issues, actionable advice, and uncertainty limitations.
  - Chronological session history table with real-time search filtering.
  - Environmental monitoring station with strict disconnected states (0.0 metrics).
  - Irrigation safety panel enforcing non-AI deterministic actuation rules.
  - Subsystem diagnostic inspector with live `/api/health` ping prober.
- **Project Documentation**: Created `README.md`, `PROJECT_CONTEXT.md`, `ARCHITECTURE.md`, `CHANGELOG.md`, and `TODO.md`.
