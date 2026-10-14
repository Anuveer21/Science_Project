/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Droplets,
  ShieldAlert,
  AlertTriangle,
  Lock,
  PowerOff,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

export const IrrigationSection: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-neutral-900">
          Irrigation Subsystem & Safety Hub
        </h2>
        <p className="text-sm text-neutral-500">
          Deterministic water management · Safety-isolated actuator controls
        </p>
      </div>

      {/* Primary Safety Guardrail Notice */}
      <div className="bg-emerald-950 text-white rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-emerald-300 font-semibold text-sm">
          <ShieldAlert className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Irrigation Safety Architecture Guardrail</span>
        </div>
        <p className="text-xs text-neutral-200 leading-relaxed">
          Gemini AI vision models provide diagnostic observations only. AI models are strictly prohibited from determining or executing pump actuation commands directly. Physical watering actions will be driven exclusively by deterministic threshold logic based on calibrated physical soil moisture probes, hardware watchdog timers, and manual fail-safe overrides.
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pump Status */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Pump Relay Status
            </span>
            <PowerOff className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-neutral-800">
              DISENGAGED
            </span>
          </div>
          <div className="pt-2 border-t border-neutral-100 text-xs text-neutral-500">
            Relay Contact: Open (Normally Open)
          </div>
        </div>

        {/* Moisture Trigger Level */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Last Reported Moisture
            </span>
            <Droplets className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-neutral-400">
              -- %
            </span>
          </div>
          <div className="pt-2 border-t border-neutral-100 text-xs text-amber-800">
            Awaiting ESP32 hardware handshake
          </div>
        </div>

        {/* Pump Controller Link */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Controller Link
            </span>
            <Lock className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-neutral-800">
              OFFLINE / SAFE
            </span>
          </div>
          <div className="pt-2 border-t border-neutral-100 text-xs text-neutral-500">
            GPIO Relay Module: Disconnected
          </div>
        </div>
      </div>

      {/* Reserved Area for Future Manual Controls */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-neutral-700" />
            <h3 className="font-semibold text-neutral-900 text-sm">
              Manual Override Control Panel (Reserved Area)
            </h3>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono text-neutral-600 bg-neutral-100 border border-neutral-200">
            <Lock className="w-3 h-3" /> HARDWARE INTERLOCK ACTIVE
          </div>
        </div>

        <p className="text-xs text-neutral-500 leading-relaxed">
          The physical relay actuation controls are locked. Hardware activation requires verified ESP32 communication, a hardware timeout watchdog, and a physical safety interlock.
        </p>

        {/* Mock/Reserved Control Interface */}
        <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg space-y-4 opacity-60 pointer-events-none select-none">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">
                Target Zone
              </label>
              <select className="w-full text-xs p-2 rounded border border-neutral-300 bg-white" disabled>
                <option>Zone A - Solanaceae Crop Bed (Relay 1)</option>
                <option>Zone B - Experimental Row 2 (Relay 2)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-600 mb-1">
                Watering Duration (Seconds)
              </label>
              <input
                type="number"
                disabled
                value={15}
                className="w-full text-xs p-2 rounded border border-neutral-300 bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              disabled
              type="button"
              className="px-4 py-2 bg-neutral-300 text-neutral-600 text-xs font-medium rounded-lg cursor-not-allowed"
            >
              Start Manual Irrigation Pulse
            </button>
            <span className="text-[11px] text-neutral-500">
              * Disabled until physical pump and relay module are bench tested.
            </span>
          </div>
        </div>

        {/* Future Deterministic Automation Rules Spec */}
        <div className="pt-4 border-t border-neutral-100">
          <h4 className="text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-2">
            Approved Future Automated Threshold Rules
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <div className="font-semibold text-neutral-900">Low Moisture Threshold</div>
              <p className="text-neutral-500 mt-1">Trigger pulse when soil moisture drops below 30% for 3 consecutive readings.</p>
            </div>
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <div className="font-semibold text-neutral-900">Maximum Run Watchdog</div>
              <p className="text-neutral-500 mt-1">Automatic hardware shut-off after 45 seconds to prevent accidental flooding.</p>
            </div>
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <div className="font-semibold text-neutral-900">Temperature Lockout</div>
              <p className="text-neutral-500 mt-1">Suppress watering during peak ambient solar heat (&gt;35°C) to prevent foliar shock.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
