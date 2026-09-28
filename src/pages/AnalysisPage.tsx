import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  BrainCircuit,
  Database,
  ShieldAlert,
  ArrowRight,
  GitBranch,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react';
import {
  StrategicPattern,
  StrategicInsight,
  Competitor,
  HindsightMemory,
  PipelineExecutionResult,
} from '../types';
import { api } from '../services/api';

interface AnalysisPageProps {
  patterns: StrategicPattern[];
  insights: StrategicInsight[];
  competitors: Competitor[];
  memories: HindsightMemory[];
  onRefresh: () => void;
  onOpenIngestModal: () => void;
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({
  patterns,
  insights,
  competitors,
  memories,
  onRefresh,
  onOpenIngestModal,
}) => {
  const [selectedPatternId, setSelectedPatternId] = useState<string>(patterns[0]?.id || '');
  const [activeSimulation, setActiveSimulation] = useState<PipelineExecutionResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const selectedPattern = patterns.find((p) => p.id === selectedPatternId) || patterns[0];
  const supportingMemories = selectedPattern
    ? memories.filter((m) => selectedPattern.supportingMemoryIds.includes(m.id))
    : [];

  const handleSimulateScenario = async (scenario: {
    competitorId: string;
    title: string;
    category: any;
    impact: any;
    description: string;
  }) => {
    setIsSimulating(true);
    try {
      const res = await api.ingestEvent({
        competitorId: scenario.competitorId,
        date: '2026-09-28',
        title: scenario.title,
        description: scenario.description,
        category: scenario.category,
        impact: scenario.impact,
        source: 'Real-Time Market Observation Simulation',
        tags: ['simulation', 'pattern-verification'],
      });
      setActiveSimulation(res);
      onRefresh();
    } catch (err: any) {
      alert(`Simulation error: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              AI Strategic Analysis & Pattern Detection
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Grounded in Hindsight persistent memory. Connecting disparate moves across months into coherent strategic intent.
          </p>
        </div>

        <button
          onClick={onOpenIngestModal}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs sm:text-sm shadow-md transition self-start"
        >
          <Play className="w-3.5 h-3.5 text-yellow-300" />
          <span>Simulate Live Competitor Event</span>
        </button>
      </div>

      {/* 5-Step Pipeline Architecture Banner */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-indigo-500/30">
        <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">
          The Persistent Hindsight Reasoning Loop
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div className="text-[10px] font-mono text-indigo-400 font-semibold mb-1">STEP 1</div>
            <div className="font-bold text-white text-xs">Current Event Ingestion</div>
            <div className="text-[11px] text-slate-400 mt-1">Pricing, talent, feature or M&A action captured</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/30 flex flex-col justify-between">
            <div className="text-[10px] font-mono text-cyan-400 font-semibold mb-1">STEP 2</div>
            <div className="font-bold text-cyan-300 text-xs">Hindsight Memory Retrieval</div>
            <div className="text-[11px] text-slate-400 mt-1">Pulls correlated memories from 3-12 months prior</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div className="text-[10px] font-mono text-violet-400 font-semibold mb-1">STEP 3</div>
            <div className="font-bold text-violet-300 text-xs">Historical Connection</div>
            <div className="text-[11px] text-slate-400 mt-1">Cross-references time-series & strategic levers</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div className="text-[10px] font-mono text-amber-400 font-semibold mb-1">STEP 4</div>
            <div className="font-bold text-amber-300 text-xs">Pattern Detection</div>
            <div className="text-[11px] text-slate-400 mt-1">Identifies macro playbooks (e.g. Upmarket Pivot)</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 flex flex-col justify-between">
            <div className="text-[10px] font-mono text-emerald-400 font-semibold mb-1">STEP 5</div>
            <div className="font-bold text-emerald-300 text-xs">Actionable Counter-Moves</div>
            <div className="text-[11px] text-slate-400 mt-1">Evidence-based playbooks for sales & product</div>
          </div>
        </div>
      </div>

      {/* Live Simulation Runner Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Play className="w-4 h-4 text-emerald-400" />
              <span>Simulate New Event & Watch Hindsight Connect the Dots</span>
            </h3>
            <p className="text-xs text-slate-400">
              Click a preset scenario to see how Hindsight immediately retrieves historical memories from earlier this year
            </p>
          </div>
          {activeSimulation && (
            <button
              onClick={() => setActiveSimulation(null)}
              className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset View</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() =>
              handleSimulateScenario({
                competitorId: 'comp-technova',
                category: 'Pricing & Packaging',
                impact: 'High',
                title: 'TechNova Introduces $250k Minimum Annual Commit on Dedicated VPCs',
                description:
                  'TechNova revised their contract terms to require minimum 2-year commitments at $250k/year for any customer requiring single-tenant VPC isolation.',
              })
            }
            disabled={isSimulating}
            className="p-3 rounded-xl bg-slate-950/80 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/40 text-left transition disabled:opacity-50"
          >
            <div className="text-xs font-bold text-indigo-300">TechNova: Upmarket Lock-In</div>
            <div className="text-[11px] text-slate-300 mt-1 line-clamp-2">
              Imposes $250k minimum annual contract thresholds on dedicated VPC tier.
            </div>
            <div className="mt-2 text-[10px] text-cyan-400 font-mono flex items-center space-x-1">
              <span>Tests recall of Jan price cut & May VPC launch</span>
            </div>
          </button>

          <button
            onClick={() =>
              handleSimulateScenario({
                competitorId: 'comp-cloudsphere',
                category: 'M&A & Partnership',
                impact: 'High',
                title: 'CloudSphere Acquires Observability Startup DataScope for $30M',
                description:
                  'CloudSphere acquired an early-stage telemetry startup to bundle APM with their MicroKube container layer, bypassing internal engineering teams.',
              })
            }
            disabled={isSimulating}
            className="p-3 rounded-xl bg-slate-950/80 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/40 text-left transition disabled:opacity-50"
          >
            <div className="text-xs font-bold text-purple-300">CloudSphere: Inorganic M&A</div>
            <div className="text-[11px] text-slate-300 mt-1 line-clamp-2">
              Acquires APM startup to bundle with legacy stack after engineering freeze.
            </div>
            <div className="mt-2 text-[10px] text-cyan-400 font-mono flex items-center space-x-1">
              <span>Tests recall of April freeze & June MicroKube deal</span>
            </div>
          </button>

          <button
            onClick={() =>
              handleSimulateScenario({
                competitorId: 'comp-dataforge',
                category: 'Product & Feature',
                impact: 'High',
                title: 'DataForge Deprecates Direct S3 Ingestion in Open Core Distribution',
                description:
                  'DataForge moved high-throughput S3 parallel chunking from ForgeCore open source into closed ForgeCloud managed enterprise license.',
              })
            }
            disabled={isSimulating}
            className="p-3 rounded-xl bg-slate-950/80 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/40 text-left transition disabled:opacity-50"
          >
            <div className="text-xs font-bold text-emerald-300">DataForge: Open-Core Monetization</div>
            <div className="text-[11px] text-slate-300 mt-1 line-clamp-2">
              Gates parallel S3 indexing to managed cloud tier only.
            </div>
            <div className="mt-2 text-[10px] text-cyan-400 font-mono flex items-center space-x-1">
              <span>Tests recall of Feb open-source launch & April SaaS</span>
            </div>
          </button>
        </div>

        {/* Live Simulation Pipeline Output */}
        {activeSimulation && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
              <span className="font-bold text-cyan-300 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Simulation Complete: Hindsight Connected {activeSimulation.retrievedMemories.length} Historical Memories</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Pattern: <strong>{activeSimulation.patternDetection.patternName} ({activeSimulation.patternDetection.confidence}%)</strong>
              </span>
            </div>

            <p className="text-xs text-slate-300 italic">
              "{activeSimulation.strategicInsight.thesis}"
            </p>

            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Historical Memory Chain Retrieved:
              </span>
              {activeSimulation.retrievedMemories.map((r, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-cyan-400 font-mono mr-2">{r.memory.eventDate}</span>
                    <span className="text-slate-200 font-semibold">{r.memory.title}</span>
                  </div>
                  <span className="text-xs font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                    {r.relevanceScore}% Relevance
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Pattern Matrix Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Pattern Selector Tabs */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block px-1">
            Detected Strategic Vectors ({patterns.length})
          </span>

          <div className="space-y-2">
            {patterns.map((pat) => {
              const isSelected = pat.id === selectedPattern?.id;
              return (
                <div
                  key={pat.id}
                  onClick={() => setSelectedPatternId(pat.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/40'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-white">{pat.competitorName}</span>
                    <span
                      className={`px-2 py-0.2 rounded font-mono text-[10px] ${
                        pat.threatLevel === 'Severe'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {pat.confidence}% Conf.
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-indigo-300">{pat.patternName}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{pat.summary}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Pattern Deep Dive with Supporting Memory Chain */}
        <div className="lg:col-span-8 space-y-4">
          {selectedPattern ? (
            <div className="space-y-4">
              {/* Pattern Overview Card */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block">
                      {selectedPattern.competitorName} Strategic Vector
                    </span>
                    <h2 className="text-xl font-extrabold text-white mt-0.5">
                      {selectedPattern.patternName}
                    </h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs border border-amber-500/30">
                      {selectedPattern.threatLevel} Threat • {selectedPattern.confidence}% Confidence
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {selectedPattern.summary}
                </p>

                {/* Strategic Thesis */}
                <div className="p-4 rounded-xl bg-slate-950 border border-rose-500/30">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-rose-400 mb-1">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Evidence-Backed Strategic Thesis</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {selectedPattern.strategicThesis}
                  </p>
                </div>

                {/* Recommended Counter-Moves */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    Recommended Organizational Counter-Moves
                  </h4>
                  <div className="space-y-1.5">
                    {selectedPattern.recommendedCounterMoves.map((move, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 flex items-start space-x-2.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{move}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Supporting Historical Evidence Trail in Hindsight */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Database className="w-4 h-4 text-cyan-400" />
                    <span>Hindsight Persistent Evidence Trail ({supportingMemories.length} Memories)</span>
                  </h3>
                  <span className="text-[11px] font-mono text-cyan-400">
                    Spanning {selectedPattern.firstObservedDate} → {selectedPattern.lastUpdatedDate}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {supportingMemories.map((mem, idx) => (
                    <div
                      key={mem.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-cyan-400 text-[11px] font-semibold">{mem.eventDate}</span>
                          <span className="text-slate-500">•</span>
                          <span className="font-semibold text-white">{mem.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">{mem.eventType}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 italic">"{mem.naturalLanguageContent}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">
              Select a pattern to inspect historical evidence.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
