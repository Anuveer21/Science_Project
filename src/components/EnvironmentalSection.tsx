/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Activity,
  AlertTriangle,
  Cpu,
  Thermometer,
  Droplets,
  CloudRain,
  Radio,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const EnvironmentalSection: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-neutral-900">
          Environmental Monitoring Hub
        </h2>
        <p className="text-sm text-neutral-500">
          ESP32 soil and atmospheric telemetry receiver · Strict disconnected state
        </p>
      </div>

      {/* Strict Disconnected Warning Callout */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold">Hardware Connection Notice:</span>{' '}
            Physical ESP32 sensor bus is currently offline. Fabricated values are strictly prohibited.
          </div>
        </div>
        <div className="font-mono text-[11px] text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-sm whitespace-nowrap">
          STATUS: DISCONNECTED (0.00)
        </div>
      </div>

      {/* Metric Cards (Strict Disconnected Representation) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Soil Moisture */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Soil Moisture
            </span>
            <Droplets className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-neutral-400">
              --
            </span>
            <span className="text-xs text-neutral-400">% VWC</span>
          </div>
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
            <span className="text-neutral-500">Target: Capacitive v1.2</span>
            <span className="text-amber-800 font-mono text-[11px]">No Signal</span>
          </div>
        </div>

        {/* Ambient Temperature */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Canopy Temperature
            </span>
            <Thermometer className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-neutral-400">
              --
            </span>
            <span className="text-xs text-neutral-400">°C</span>
          </div>
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
            <span className="text-neutral-500">Target: DHT22 / DS18B20</span>
            <span className="text-amber-800 font-mono text-[11px]">No Signal</span>
          </div>
        </div>

        {/* Ambient Humidity */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Relative Humidity
            </span>
            <CloudRain className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tabular-nums text-neutral-400">
              --
            </span>
            <span className="text-xs text-neutral-400">% RH</span>
          </div>
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
            <span className="text-neutral-500">Target: DHT22 / SHT31</span>
            <span className="text-amber-800 font-mono text-[11px]">No Signal</span>
          </div>
        </div>
      </div>

      {/* Hardware Integration Architecture Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ESP32 Interface Specification */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-900" />
            <h3 className="font-semibold text-neutral-900 text-sm">
              ESP32 Sensor Interface Architecture
            </h3>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            The telemetry subsystem is architected to ingest environmental packets over Wi-Fi HTTP POST or MQTT JSON payload once hardware pin assignments are confirmed for the competition prototype.
          </p>

          <div className="bg-neutral-50 rounded-lg p-3 text-xs space-y-2 border border-neutral-200 font-mono">
            <div className="text-neutral-500 uppercase tracking-wider text-[11px] font-sans font-semibold">
              Planned Telemetry Ingestion Contract:
            </div>
            <pre className="text-neutral-800 overflow-x-auto text-[11px] leading-relaxed">
{`POST /api/telemetry/report
{
  "node_id": "esp32-node-01",
  "temperature_c": 24.5,
  "humidity_rh": 62.0,
  "soil_moisture_pct": 48.2,
  "battery_mv": 3950,
  "timestamp": 1793582400
}`}
            </pre>
          </div>

          <div className="text-xs text-neutral-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0" />
            <span>Data payloads will undergo CRC and threshold validation prior to storage.</span>
          </div>
        </div>

        {/* Hardware Status & Limitations */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-neutral-500" />
            <h3 className="font-semibold text-neutral-900 text-sm">
              Hardware Boundaries & Current Status
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 flex items-start gap-3">
              <Clock className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-neutral-800">Sensors Under Benchmark:</span>
                <p className="text-neutral-500 mt-0.5">
                  Exact pin assignments (ADC channels for capacitive sensors, I2C vs 1-Wire) remain pending hardware bench tests.
                </p>
              </div>
            </div>

            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 flex items-start gap-3">
              <Activity className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-neutral-800">Windows 11 Host Role:</span>
                <p className="text-neutral-500 mt-0.5">
                  The laptop host acts purely as the aggregation server and Gemini relay on port 3000, offloading sensor sampling to ESP32 microcontrollers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
