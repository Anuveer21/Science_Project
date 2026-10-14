/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DashboardTab } from '../types.ts';
import { Sprout } from 'lucide-react';

interface NavbarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  onQuickUpload: () => void;
  backendOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onQuickUpload,
  backendOnline,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Title (One line, no tags) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-900 text-emerald-100 flex items-center justify-center font-bold text-sm">
            <Sprout className="w-5 h-5 text-emerald-300" />
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 whitespace-nowrap">
            Smart Farm AI
          </span>
        </div>

        {/* Zone 2: Navigation links (single line, clean typography) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`whitespace-nowrap transition-colors hover:text-neutral-900 pb-0.5 ${
              activeTab === 'overview'
                ? 'text-emerald-900 font-semibold border-b-2 border-emerald-900'
                : ''
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('crops')}
            className={`whitespace-nowrap transition-colors hover:text-neutral-900 pb-0.5 ${
              activeTab === 'crops'
                ? 'text-emerald-900 font-semibold border-b-2 border-emerald-900'
                : ''
            }`}
          >
            Crop Monitoring
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('environmental')}
            className={`whitespace-nowrap transition-colors hover:text-neutral-900 pb-0.5 ${
              activeTab === 'environmental'
                ? 'text-emerald-900 font-semibold border-b-2 border-emerald-900'
                : ''
            }`}
          >
            Environmental
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('irrigation')}
            className={`whitespace-nowrap transition-colors hover:text-neutral-900 pb-0.5 ${
              activeTab === 'irrigation'
                ? 'text-emerald-900 font-semibold border-b-2 border-emerald-900'
                : ''
            }`}
          >
            Irrigation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('system')}
            className={`whitespace-nowrap transition-colors hover:text-neutral-900 pb-0.5 ${
              activeTab === 'system'
                ? 'text-emerald-900 font-semibold border-b-2 border-emerald-900'
                : ''
            }`}
          >
            System Status
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500 font-mono">
            <span
              className={`w-2 h-2 rounded-full ${
                backendOnline ? 'bg-emerald-600' : 'bg-amber-500'
              }`}
            />
            <span>{backendOnline ? 'API Connected' : 'Checking API'}</span>
          </div>
          <button
            type="button"
            onClick={onQuickUpload}
            className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white bg-emerald-900 rounded-lg hover:bg-emerald-800 transition-colors whitespace-nowrap shadow-xs"
          >
            Analyze Crop
          </button>
        </div>
      </div>
    </header>
  );
};
