import React from 'react';
import {
  LayoutDashboard,
  Building2,
  GitCommit,
  BrainCircuit,
  Sparkles,
  FileText,
  Settings,
  PlusCircle,
  Database,
  Activity,
  Layers,
} from 'lucide-react';
import { NavTab } from '../types';
export type { NavTab };

interface NavigationProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenIngestModal: () => void;
  onOpenAnalysisModal: () => void;
  memoriesCount: number;
  competitorsCount: number;
  patternsCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  onOpenIngestModal,
  onOpenAnalysisModal,
  memoriesCount,
  competitorsCount,
  patternsCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'competitors' as NavTab,
      label: 'Competitors',
      icon: Building2,
      badge: competitorsCount,
    },
    {
      id: 'timeline' as NavTab,
      label: 'Intelligence Timeline',
      icon: GitCommit,
      badge: null,
    },
    {
      id: 'memory' as NavTab,
      label: 'Hindsight Memory',
      icon: BrainCircuit,
      badge: `${memoriesCount} nodes`,
      highlight: true,
    },
    {
      id: 'analysis' as NavTab,
      label: 'AI Strategic Analysis',
      icon: Sparkles,
      badge: `${patternsCount} patterns`,
    },
    {
      id: 'reports' as NavTab,
      label: 'Reports',
      icon: FileText,
      badge: null,
    },
    {
      id: 'settings' as NavTab,
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Agent Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-indigo-400 animate-pulse-subtle" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  StrategicPulse
                </span>
                <span className="px-1.5 py-0.5 text-[10px] uppercase font-semibold tracking-wider rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Agent
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Persistent Memory via <span className="text-cyan-400 font-semibold">Hindsight</span>
              </p>
            </div>
          </div>

          {/* Persistent Memory Health Pill */}
          <div className="hidden md:flex items-center space-x-3 bg-slate-950/80 px-3.5 py-1.5 rounded-full border border-slate-800/80 text-xs">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-300 font-medium">Hindsight Persistent Layer</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center space-x-1.5 text-cyan-400 font-mono">
              <Database className="w-3.5 h-3.5" />
              <span>{memoriesCount} Memories Online</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onOpenIngestModal}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>Ingest Event</span>
            </button>
            <button
              onClick={onOpenAnalysisModal}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-600/25 transition active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Run Intelligence Analysis</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar">
        <nav className="flex space-x-1 sm:space-x-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== null && (
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      item.highlight
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : isActive
                        ? 'bg-indigo-500/20 text-indigo-200'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
