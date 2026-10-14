/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CropAnalysisResult {
  id: string;
  timestamp: string;
  imageName: string;
  imageDataUrl: string;
  plant_identification: string;
  observed_symptoms: string[];
  possible_issues: string[];
  condition_summary: string;
  recommendations: string[];
  uncertainty_notes: string;
  requires_expert_review: boolean;
  model: string;
}

export interface HardwareNodeStatus {
  connected: boolean;
  status: 'online' | 'offline' | 'disconnected' | 'standby';
  details: string;
  lastPing?: string;
}

export interface SystemStatusResponse {
  timestamp: string;
  backend: {
    status: 'online' | 'offline';
    runtime: string;
    port: number;
    uptime?: number;
  };
  ai: {
    provider: string;
    model: string;
    configured: boolean;
  };
  hardware: {
    patrolCar: HardwareNodeStatus;
    esp32Sensor: HardwareNodeStatus;
    irrigationController: HardwareNodeStatus;
  };
}

export type DashboardTab = 'overview' | 'crops' | 'environmental' | 'irrigation' | 'system';
