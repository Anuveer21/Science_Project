/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DashboardTab } from '../types.ts';
import { LayoutDashboard, Camera, Activity, Droplets, Server } from 'lucide-react';

interface SidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  cropAnalysesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  cropAnalysesCount,
}) => {
  const navItems = [
    {
      id: 'overview' as DashboardTab,
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'crops' as DashboardTab,
      label: 'Crop Monitoring',
      icon: Camera,
      badge: cropAnalysesCount > 0 ? cropAnalysesCount.toString() : null,
    },
    {
      id: 'environmental' as DashboardTab,
      label: 'Environmental',
      icon: Activity,
      badge: 'Offline',
    },
    {
      id: 'irrigation' as DashboardTab,
      label: 'Irrigation Hub',
      icon: Droplets,
      badge: 'Standby',
    },
    {
      id: 'system' as DashboardTab,
      label: 'System Status',
      icon: Server,
      badge: null,
    },
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-neutral-200 bg-white p-4">
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-semibold text-neutral-400 tracking-wider uppercase">
          Precision Agriculture
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-50 text-emerald-950 font-semibold border border-emerald-200'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-emerald-800' : 'text-neutral-400'
                  }`}
                />
                <span className="whitespace-nowrap">{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-xs font-mono text-neutral-400">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-neutral-100 hidden lg:block text-xs text-neutral-500 space-y-2">
        <div className="font-medium text-neutral-700">Project Target</div>
        <p className="leading-relaxed">
          National Science Competition · 2 November 2026. Patrol car vision & ESP32 telemetry platform.
        </p>
      </div>
    </aside>
  );
};
