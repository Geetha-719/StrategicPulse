import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Shield,
  Activity,
  Calendar,
  Layers,
  BrainCircuit,
  TrendingUp,
  Tag,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Competitor, IntelligenceEvent, HindsightMemory, StrategicPattern } from '../types';
import { CompetitorModal } from '../components/CompetitorModal';
import { api } from '../services/api';

interface CompetitorsPageProps {
  competitors: Competitor[];
  events: IntelligenceEvent[];
  memories: HindsightMemory[];
  patterns: StrategicPattern[];
  onRefresh: () => void;
  onSelectEventForTimeline: (eventId: string) => void;
  onSelectTab: (tab: any) => void;
}

export const CompetitorsPage: React.FC<CompetitorsPageProps> = ({
  competitors,
  events,
  memories,
  patterns,
  onRefresh,
  onSelectEventForTimeline,
  onSelectTab,
}) => {
  const [selectedCompetitorId, setSelectedCompetitorId] = useState<string>(
    competitors[0]?.id || 'comp-technova'
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [competitorToEdit, setCompetitorToEdit] = useState<Competitor | null>(null);

  const selectedCompetitor = competitors.find((c) => c.id === selectedCompetitorId) || competitors[0];

  const competitorEvents = events.filter((e) => e.competitorId === selectedCompetitor?.id);
  const competitorMemories = memories.filter((m) => m.competitorId === selectedCompetitor?.id);
  const competitorPatterns = patterns.filter((p) => p.competitorId === selectedCompetitor?.id);

  const handleEdit = (comp: Competitor) => {
    setCompetitorToEdit(comp);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCompetitorToEdit(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (comp: Competitor) => {
    if (confirm(`Are you sure you want to stop tracking ${comp.name}? This will remove associated events and memories.`)) {
      try {
        await api.deleteCompetitor(comp.id);
        onRefresh();
        if (selectedCompetitorId === comp.id && competitors.length > 1) {
          const next = competitors.find((c) => c.id !== comp.id);
          if (next) setSelectedCompetitorId(next.id);
        }
      } catch (err: any) {
        alert(`Failed to delete: ${err.message}`);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Competitor Tracking Profiles</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Entities continuously mapped into Hindsight persistent memory layer
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition active:scale-95 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Track New Competitor</span>
        </button>
      </div>

      {/* Competitor Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {competitors.map((comp) => {
          const isSelected = comp.id === selectedCompetitor?.id;
          const compEventCount = events.filter((e) => e.competitorId === comp.id).length;
          const compMemCount = memories.filter((m) => m.competitorId === comp.id).length;

          return (
            <div
              key={comp.id}
              onClick={() => setSelectedCompetitorId(comp.id)}
              className={`p-5 rounded-2xl border transition cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-900 border-indigo-500/80 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: comp.color }}
              />

              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{comp.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{comp.industry}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(comp);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(comp);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                  {comp.marketSegment}
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-mono text-[11px] ${
                    comp.activityLevel === 'Aggressive'
                      ? 'bg-rose-500/20 text-rose-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {comp.activityLevel} Activity
                </span>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center space-x-1">
                  <BrainCircuit className="w-3 h-3 text-cyan-400" />
                  <span>{compMemCount} Memories</span>
                </span>
                <span>Threat Score: <strong className="text-white font-mono">{comp.threatScore}/100</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Competitor Detailed Dossier */}
      {selectedCompetitor && (
        <div className="space-y-6">
          {/* Main Info Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center space-x-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-md"
                  style={{ backgroundColor: selectedCompetitor.color }}
                >
                  {selectedCompetitor.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-extrabold text-white">{selectedCompetitor.name}</h2>
                    <a
                      href={selectedCompetitor.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-400 hover:text-indigo-400"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <p className="text-xs text-slate-400">{selectedCompetitor.industry}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
                  <span className="text-slate-400 block text-[10px]">Threat Score</span>
                  <span className="text-rose-400 font-bold font-mono text-sm">
                    {selectedCompetitor.threatScore}/100
                  </span>
                </div>
                <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
                  <span className="text-slate-400 block text-[10px]">Last Activity</span>
                  <span className="text-slate-200 font-mono text-sm">
                    {selectedCompetitor.lastActivityDate}
                  </span>
                </div>
                <button
                  onClick={() => handleEdit(selectedCompetitor)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Strategic Profile & Positioning
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedCompetitor.description}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {selectedCompetitor.tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-slate-950 text-slate-300 text-xs border border-slate-800"
                >
                  <Tag className="w-3 h-3 text-indigo-400" />
                  <span>{tag}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Strategic Patterns Detected */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Strategic Patterns Detected for {selectedCompetitor.name}
                </h3>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800">
                Persistent Memory Inference
              </span>
            </div>

            {competitorPatterns.length === 0 ? (
              <p className="text-xs text-slate-400">
                No high-confidence multi-month patterns detected yet. Ingest more events to trigger pattern correlation.
              </p>
            ) : (
              <div className="space-y-4">
                {competitorPatterns.map((pat) => (
                  <div
                    key={pat.id}
                    className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/20 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-white">{pat.patternName}</h4>
                        <span className="text-xs text-indigo-400 font-medium">{pat.category}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 text-xs font-mono border border-amber-500/30 self-start">
                        Confidence: {pat.confidence}% ({pat.threatLevel} Threat)
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {pat.summary}
                    </p>

                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                      <span className="font-semibold text-rose-400 block mb-1">Strategic Thesis</span>
                      <p className="text-slate-300 text-xs">{pat.strategicThesis}</p>
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block mb-1.5">
                        Recommended Strategic Counter-Moves
                      </span>
                      <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                        {pat.recommendedCounterMoves.map((move, idx) => (
                          <li key={idx}>{move}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-900">
                      <span>Observed: {pat.firstObservedDate} → {pat.lastUpdatedDate}</span>
                      <span>Based on {pat.supportingMemoryIds.length} Hindsight historical memories</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Historical Activity Timeline for this Competitor */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">
                  Historical Intelligence Timeline ({competitorEvents.length} Events)
                </h3>
              </div>
              <button
                onClick={() => onSelectTab('timeline')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
              >
                <span>Full Timeline View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {competitorEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => {
                    onSelectTab('timeline');
                    onSelectEventForTimeline(evt.id);
                  }}
                  className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono text-cyan-400">{evt.date}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                        {evt.category}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                          evt.impact === 'Critical'
                            ? 'bg-rose-500/20 text-rose-300'
                            : evt.impact === 'High'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {evt.impact}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition">
                      {evt.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1">{evt.description}</p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-xs text-slate-400 flex items-center space-x-1">
                      <span>Inspect Memory Link</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Competitor Edit / Add Modal */}
      <CompetitorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        competitorToEdit={competitorToEdit}
        onSaved={onRefresh}
      />
    </div>
  );
};
