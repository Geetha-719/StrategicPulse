/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navigation, NavTab } from './components/Navigation';
import { DashboardPage } from './pages/DashboardPage';
import { CompetitorsPage } from './pages/CompetitorsPage';
import { TimelinePage } from './pages/TimelinePage';
import { HindsightMemoryPage } from './pages/HindsightMemoryPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { IngestEventModal } from './components/IngestEventModal';
import { RunAnalysisModal } from './components/RunAnalysisModal';
import {
  Competitor,
  IntelligenceEvent,
  HindsightMemory,
  StrategicPattern,
  StrategicInsight,
  ExecutiveReport,
} from './types';
import { api } from './services/api';
import { BrainCircuit, Loader2 } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [events, setEvents] = useState<IntelligenceEvent[]>([]);
  const [memories, setMemories] = useState<HindsightMemory[]>([]);
  const [patterns, setPatterns] = useState<StrategicPattern[]>([]);
  const [insights, setInsights] = useState<StrategicInsight[]>([]);
  const [reports, setReports] = useState<ExecutiveReport[]>([]);

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [comps, evts, mems, pats, ins, reps] = await Promise.all([
        api.getCompetitors(),
        api.getEvents(),
        api.getMemories(),
        api.getPatterns(),
        api.getInsights(),
        api.getReports(),
      ]);

      setCompetitors(comps);
      setEvents(evts);
      setMemories(mems);
      setPatterns(pats);
      setInsights(ins);
      setReports(reps);

      if (evts.length > 0 && !selectedEventId) {
        setSelectedEventId(evts[0].id);
      }
    } catch (err) {
      console.error('Failed to load intelligence data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectEventForTimeline = (eventId: string) => {
    setSelectedEventId(eventId);
    setCurrentTab('timeline');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center animate-pulse">
          <BrainCircuit className="w-6 h-6 text-indigo-400" />
        </div>
        <div className="flex items-center space-x-2 text-sm font-medium">
          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Synchronizing Hindsight Persistent Memory Store...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navigation Header */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenIngestModal={() => setIsIngestModalOpen(true)}
        onOpenAnalysisModal={() => setIsAnalysisModalOpen(true)}
        memoriesCount={memories.length}
        competitorsCount={competitors.length}
        patternsCount={patterns.length}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'dashboard' && (
          <DashboardPage
            competitors={competitors}
            events={events}
            memories={memories}
            patterns={patterns}
            insights={insights}
            onOpenAnalysisModal={() => setIsAnalysisModalOpen(true)}
            onOpenIngestModal={() => setIsIngestModalOpen(true)}
            onSelectTab={setCurrentTab}
            onSelectEventForTimeline={handleSelectEventForTimeline}
          />
        )}

        {currentTab === 'competitors' && (
          <CompetitorsPage
            competitors={competitors}
            events={events}
            memories={memories}
            patterns={patterns}
            onRefresh={loadAllData}
            onSelectEventForTimeline={handleSelectEventForTimeline}
            onSelectTab={setCurrentTab}
          />
        )}

        {currentTab === 'timeline' && (
          <TimelinePage
            events={events}
            memories={memories}
            competitors={competitors}
            selectedEventId={selectedEventId}
            onSelectEvent={setSelectedEventId}
            onSelectTab={setCurrentTab}
          />
        )}

        {currentTab === 'memory' && (
          <HindsightMemoryPage
            memories={memories}
            competitors={competitors}
            onRefresh={loadAllData}
            onSelectTab={setCurrentTab}
          />
        )}

        {currentTab === 'analysis' && (
          <AnalysisPage
            patterns={patterns}
            insights={insights}
            competitors={competitors}
            memories={memories}
            onRefresh={loadAllData}
            onOpenIngestModal={() => setIsIngestModalOpen(true)}
          />
        )}

        {currentTab === 'reports' && (
          <ReportsPage
            reports={reports}
            competitors={competitors}
            onRefresh={loadAllData}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsPage onSettingsUpdated={loadAllData} />
        )}
      </main>

      {/* Modals */}
      <IngestEventModal
        isOpen={isIngestModalOpen}
        onClose={() => setIsIngestModalOpen(false)}
        competitors={competitors}
        onEventIngested={loadAllData}
      />

      <RunAnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
        onAnalysisCompleted={loadAllData}
      />
    </div>
  );
}
