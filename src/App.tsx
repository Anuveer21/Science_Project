/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DashboardTab, CropAnalysisResult, SystemStatusResponse } from './types.ts';
import { Navbar } from './components/Navbar.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { OverviewSection } from './components/OverviewSection.tsx';
import { CropMonitoringSection } from './components/CropMonitoringSection.tsx';
import { EnvironmentalSection } from './components/EnvironmentalSection.tsx';
import { IrrigationSection } from './components/IrrigationSection.tsx';
import { SystemStatusSection } from './components/SystemStatusSection.tsx';

export default function App() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [analyses, setAnalyses] = useState<CropAnalysisResult[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<CropAnalysisResult | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatusResponse | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean>(true);

  // Poll system status on mount
  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/system-status');
      if (res.ok) {
        const data = await res.json();
        setSystemStatus(data);
        setBackendOnline(true);
      } else {
        setBackendOnline(false);
      }
    } catch (err) {
      console.warn('System status check unreachable:', err);
      setBackendOnline(false);
    }
  };

  // Poll system status and autonomous patrol car frames
  useEffect(() => {
    fetchStatus();

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/patrol/latest');
        if (res.ok) {
          const data = await res.json();
          if (data.latest && data.latest.id) {
            setAnalyses((prev) => {
              const alreadyExists = prev.some((a) => a.id === data.latest.id);
              if (!alreadyExists) {
                // Auto-select latest autonomous capture
                setSelectedAnalysis(data.latest);
                return [data.latest, ...prev];
              }
              return prev;
            });
          }
        }
      } catch {
        // Silently catch background poll jitter
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleNewAnalysis = (result: CropAnalysisResult) => {
    setAnalyses((prev) => [result, ...prev]);
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col text-neutral-900 font-sans">
      {/* Top Bar Contract (3 zones) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickUpload={() => setActiveTab('crops')}
        backendOnline={backendOnline}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          cropAnalysesCount={analyses.length}
        />

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'overview' && (
            <OverviewSection
              analyses={analyses}
              systemStatus={systemStatus}
              onNavigate={setActiveTab}
              onSelectAnalysis={setSelectedAnalysis}
            />
          )}

          {activeTab === 'crops' && (
            <CropMonitoringSection
              analyses={analyses}
              onNewAnalysis={handleNewAnalysis}
              selectedAnalysis={selectedAnalysis}
              onSelectAnalysis={setSelectedAnalysis}
            />
          )}

          {activeTab === 'environmental' && <EnvironmentalSection />}

          {activeTab === 'irrigation' && <IrrigationSection />}

          {activeTab === 'system' && (
            <SystemStatusSection
              systemStatus={systemStatus}
              onRefreshStatus={fetchStatus}
            />
          )}
        </main>
      </div>

      {/* Subtle Anti-Slop Footer */}
      <footer className="bg-white border-t border-neutral-200 py-3 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Smart Farm AI · Precision Agriculture Research Baseline</span>
          <span className="font-mono text-neutral-400">Target Date: 2026-11-02</span>
        </div>
      </footer>
    </div>
  );
}
