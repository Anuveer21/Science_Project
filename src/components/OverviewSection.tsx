/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CropAnalysisResult, SystemStatusResponse, DashboardTab } from '../types.ts';
import {
  Camera,
  Activity,
  Droplets,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface OverviewSectionProps {
  analyses: CropAnalysisResult[];
  systemStatus: SystemStatusResponse | null;
  onNavigate: (tab: DashboardTab) => void;
  onSelectAnalysis: (analysis: CropAnalysisResult) => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  analyses,
  systemStatus,
  onNavigate,
  onSelectAnalysis,
}) => {
  const healthyCount = analyses.filter(
    (a) =>
      a.condition_summary.toLowerCase().includes('healthy') ||
      a.condition_summary.toLowerCase().includes('nominal')
  ).length;
  const issuesCount = analyses.length - healthyCount;

  return (
    <div className="space-y-6">
      {/* Top Banner: Status Header */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-neutral-900">
            Smart Farm Control Center
          </h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            Real-time crop diagnostic pipeline · ESP32 telemetry gateway · Competition ready for Nov 2, 2026
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('crops')}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-white bg-emerald-900 rounded-lg hover:bg-emerald-800 transition-colors shadow-xs"
          >
            <Camera className="w-4 h-4" />
            Analyze Crop Image
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Analyzed Crops Metric */}
        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Total Crops Analyzed
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight font-mono tabular-nums text-neutral-900">
              {analyses.length}
            </span>
            <span className="text-xs text-neutral-400">Gemini 3.8 Flash</span>
          </div>
          <div className="mt-2 text-xs text-neutral-500 flex items-center gap-1.5">
            <span>{healthyCount} healthy</span>
            <span aria-hidden="true">·</span>
            <span>{issuesCount} with observed signs</span>
          </div>
        </div>

        {/* AI Model State */}
        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Diagnostic Engine
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-lg font-bold tracking-tight text-neutral-900">
              {systemStatus?.ai.model || 'gemini-3.8-flash'}
            </span>
            <span className="text-xs text-emerald-800 font-medium">Ready</span>
          </div>
          <div className="mt-2 text-xs text-neutral-500">
            {systemStatus?.ai.configured
              ? 'Server API Key Active'
              : 'Checking API configuration'}
          </div>
        </div>

        {/* Environmental Sensors: Strict Offline Status */}
        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Field Sensors (ESP32)
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold tracking-tight font-mono text-neutral-400">
              OFFLINE
            </span>
            <span className="text-xs text-neutral-400">0.0 Readings</span>
          </div>
          <div className="mt-2 text-xs text-amber-700 font-medium">
            Strict Disconnected State
          </div>
        </div>

        {/* Irrigation Controller */}
        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Irrigation Actuator
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-lg font-bold tracking-tight text-neutral-900">
              Safety Standby
            </span>
            <span className="text-xs text-neutral-400 font-mono">Relay 0</span>
          </div>
          <div className="mt-2 text-xs text-neutral-500">
            AI pump control prohibited
          </div>
        </div>
      </div>

      {/* 2-Column Split: Environmental & Irrigation Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Environmental Status Card */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-neutral-500" />
              <h3 className="font-semibold text-neutral-900">Environmental Telemetry</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('environmental')}
              className="text-xs text-emerald-800 hover:text-emerald-950 font-medium flex items-center gap-1"
            >
              Hardware Details <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-xs text-neutral-600 space-y-1.5">
            <div className="flex items-center gap-2 font-medium text-amber-800">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Sensors Disconnected · No Fabricated Telemetry</span>
            </div>
            <p>
              In accordance with project integrity standards, live temperature, humidity, and soil moisture metrics will remain at 0.0 until physical ESP32 hardware handshakes.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 text-center">
              <div className="text-xs text-neutral-500">Soil Moisture</div>
              <div className="text-lg font-bold font-mono text-neutral-400 mt-1">-- %</div>
              <div className="text-xs text-neutral-400 mt-0.5">Awaiting Sensor</div>
            </div>
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 text-center">
              <div className="text-xs text-neutral-500">Temperature</div>
              <div className="text-lg font-bold font-mono text-neutral-400 mt-1">-- °C</div>
              <div className="text-xs text-neutral-400 mt-0.5">Awaiting Sensor</div>
            </div>
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 text-center">
              <div className="text-xs text-neutral-500">Air Humidity</div>
              <div className="text-lg font-bold font-mono text-neutral-400 mt-1">-- %</div>
              <div className="text-xs text-neutral-400 mt-0.5">Awaiting Sensor</div>
            </div>
          </div>
        </div>

        {/* Irrigation Status Card */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-emerald-800" />
              <h3 className="font-semibold text-neutral-900">Irrigation Subsystem</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('irrigation')}
              className="text-xs text-emerald-800 hover:text-emerald-950 font-medium flex items-center gap-1"
            >
              Safety Rules <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-xs text-neutral-600 space-y-1.5">
            <div className="flex items-center gap-2 font-medium text-neutral-800">
              <ShieldAlert className="w-4 h-4 shrink-0 text-neutral-600" />
              <span>Deterministic Safety Guardrail</span>
            </div>
            <p>
              AI vision observations are non-actuating. Water valves and pumps can only be triggered by deterministic sensor thresholds once hardware is online.
            </p>
          </div>

          <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-lg space-y-2 text-xs">
            <div className="flex justify-between items-center text-neutral-700">
              <span className="font-medium">Pump Relay Status:</span>
              <span className="font-mono font-semibold text-neutral-800">SAFE DISENGAGED</span>
            </div>
            <div className="flex justify-between items-center text-neutral-700">
              <span className="font-medium">Trigger Mode:</span>
              <span>Deterministic Rules Only (Non-AI)</span>
            </div>
            <div className="flex justify-between items-center text-neutral-700">
              <span className="font-medium">Hardware Interface:</span>
              <span className="font-mono text-neutral-500">ESP32 GPIO Relay (Pending)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Crop Analyses History */}
      <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-neutral-900">Recent Crop Analyses</h3>
            <p className="text-xs text-neutral-500">
              Observations and uncertainty records generated by Gemini 3.8 Flash
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('crops')}
            className="text-xs text-emerald-800 hover:text-emerald-950 font-medium flex items-center gap-1"
          >
            Open Monitoring Station <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {analyses.length === 0 ? (
          <div className="text-center py-10 px-4 bg-neutral-50 rounded-lg border border-neutral-100">
            <Camera className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-neutral-700">No crop images analyzed yet</h4>
            <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1 mb-4">
              Upload a photograph of crop leaves or choose a sample competition specimen to test the diagnostic engine.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('crops')}
              className="px-4 py-2 text-xs font-medium text-white bg-emerald-900 rounded-lg hover:bg-emerald-800 transition-colors shadow-xs"
            >
              Analyze First Crop Specimen
            </button>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {analyses.slice(0, 5).map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectAnalysis(item);
                  onNavigate('crops');
                }}
                className="py-3 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50 rounded-lg cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0">
                    <img
                      src={item.imageDataUrl}
                      alt={item.plant_identification}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-neutral-900">
                      {item.plant_identification}
                    </div>
                    <div className="text-xs text-neutral-500 flex items-center gap-2 mt-0.5">
                      <span>{item.condition_summary}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-neutral-400">
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center text-xs">
                  {item.requires_expert_review ? (
                    <span className="text-amber-800 flex items-center gap-1 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Expert Review
                    </span>
                  ) : (
                    <span className="text-emerald-800 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Routine
                    </span>
                  )}
                  <span className="text-neutral-400 font-mono">{item.model}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
