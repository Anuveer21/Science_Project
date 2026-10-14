/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SystemStatusResponse } from '../types.ts';
import {
  Server,
  Cpu,
  Key,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Terminal,
} from 'lucide-react';

interface SystemStatusSectionProps {
  systemStatus: SystemStatusResponse | null;
  onRefreshStatus: () => Promise<void>;
}

export const SystemStatusSection: React.FC<SystemStatusSectionProps> = ({
  systemStatus,
  onRefreshStatus,
}) => {
  const [testingHealth, setTestingHealth] = useState<boolean>(false);
  const [healthResponse, setHealthResponse] = useState<string | null>(null);

  const handleTestHealth = async () => {
    setTestingHealth(true);
    setHealthResponse(null);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealthResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setHealthResponse(JSON.stringify({ error: err.message || 'Fetch failed' }, null, 2));
    } finally {
      setTestingHealth(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900">
            System & Subsystem Diagnostics
          </h2>
          <p className="text-sm text-neutral-500">
            Hardware connectivity monitor · Server health & Gemini API secret isolation
          </p>
        </div>
        <button
          type="button"
          onClick={onRefreshStatus}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-neutral-500" />
          Recheck Subsystems
        </button>
      </div>

      {/* Grid of Subsystems */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Subsystem 1: Backend Server */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Server className="w-5 h-5 text-emerald-900" />
              <h3 className="font-semibold text-neutral-900 text-sm">
                Full-Stack Backend Server
              </h3>
            </div>
            <span className="inline-flex items-center gap-1 text-xs text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded-sm">
              <CheckCircle2 className="w-3.5 h-3.5" /> Online
            </span>
          </div>

          <div className="text-xs space-y-1.5 text-neutral-600 font-mono">
            <div className="flex justify-between">
              <span className="text-neutral-400 font-sans">Runtime:</span>
              <span>{systemStatus?.backend.runtime || 'Node.js / Express'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400 font-sans">Port:</span>
              <span>3000 (Vite middleware attached)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400 font-sans">Uptime:</span>
              <span>{systemStatus?.backend.uptime ?? 0}s</span>
            </div>
          </div>
        </div>

        {/* Subsystem 2: Gemini Vision API */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Key className="w-5 h-5 text-emerald-900" />
              <h3 className="font-semibold text-neutral-900 text-sm">
                Google Gemini API
              </h3>
            </div>
            {systemStatus?.ai.configured ? (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded-sm">
                <CheckCircle2 className="w-3.5 h-3.5" /> Key Configured
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded-sm">
                <AlertTriangle className="w-3.5 h-3.5" /> Key Missing
              </span>
            )}
          </div>

          <div className="text-xs space-y-1.5 text-neutral-600 font-mono">
            <div className="flex justify-between">
              <span className="text-neutral-400 font-sans">Vision Model:</span>
              <span>{systemStatus?.ai.model || 'gemini-3.8-flash'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400 font-sans">Isolation:</span>
              <span className="text-emerald-800 font-sans font-medium">Server-Only (Zero browser leak)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400 font-sans">Format:</span>
              <span>Strict JSON Schema (Type.OBJECT)</span>
            </div>
          </div>
        </div>

        {/* Subsystem 3: Patrol Car Bridge */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-5 h-5 text-neutral-500" />
              <h3 className="font-semibold text-neutral-900 text-sm">
                Field Patrol Car Bridge
              </h3>
            </div>
            <span className="inline-flex items-center gap-1 text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-sm">
              <XCircle className="w-3.5 h-3.5 text-neutral-400" /> Disconnected
            </span>
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed">
            Existing movement-control firmware is preserved. Camera frame ingestion bridge will link directly via Wi-Fi once hardware camera module is verified.
          </p>
        </div>

        {/* Subsystem 4: ESP32 Sensor & Relay Node */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-5 h-5 text-neutral-500" />
              <h3 className="font-semibold text-neutral-900 text-sm">
                ESP32 Soil & Irrigation Node
              </h3>
            </div>
            <span className="inline-flex items-center gap-1 text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-sm">
              <XCircle className="w-3.5 h-3.5 text-neutral-400" /> Disconnected
            </span>
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed">
            Physical sensor models and pinouts unconfirmed. Strict offline state maintained to prevent fabricated telemetry.
          </p>
        </div>
      </div>

      {/* Security & Secret Invariants */}
      <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs space-y-2">
        <div className="font-semibold text-emerald-950 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-800" />
          <span>Security & Architectural Guarantees</span>
        </div>
        <ul className="text-neutral-700 space-y-1 list-disc list-inside">
          <li>API keys are strictly confined to the backend server and never exposed in client bundles or network logs.</li>
          <li>No hardware commands can be triggered by AI inference without deterministic physical safety checks.</li>
          <li>Windows 11 laptop operates strictly on port 3000 without requiring dedicated GPU or complex local model setups.</li>
        </ul>
      </div>

      {/* Live /api/health Prober */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-neutral-700" />
            <h4 className="font-semibold text-neutral-900 text-xs">
              Live Backend API Ping Tester
            </h4>
          </div>
          <button
            type="button"
            disabled={testingHealth}
            onClick={handleTestHealth}
            className="px-3 py-1 text-xs font-medium text-white bg-emerald-900 hover:bg-emerald-800 rounded-lg transition-colors"
          >
            {testingHealth ? 'Pinging...' : 'GET /api/health'}
          </button>
        </div>

        {healthResponse && (
          <div className="bg-neutral-900 text-emerald-300 font-mono text-xs p-3 rounded-lg overflow-x-auto">
            <pre>{healthResponse}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
