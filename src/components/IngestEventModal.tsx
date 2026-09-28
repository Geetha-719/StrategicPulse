import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  Database,
  BrainCircuit,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  GitBranch,
  Layers,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { Competitor, EventCategory, ImpactLevel, PipelineExecutionResult } from '../types';
import { api } from '../services/api';

interface IngestEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  competitors: Competitor[];
  onEventIngested: () => void;
}

const PRESET_SCENARIOS = [
  {
    label: 'TechNova: Unbundled Compliance Add-On',
    competitorId: 'comp-technova',
    category: 'Pricing & Packaging' as EventCategory,
    impact: 'High' as ImpactLevel,
    title: 'Instituted Unbundled $50/Seat/Month Enterprise Audit & Compliance Add-On',
    source: 'TechNova Enterprise Pricing Tier Update',
    description: 'TechNova introduced mandatory paid add-ons for HIPAA and SOC2 automated compliance export modules, raising effective enterprise license fees by 30%.',
    tags: ['pricing-packaging', 'enterprise-tax', 'margin-expansion', 'add-on'],
  },
  {
    label: 'CloudSphere: Mandatory On-Prem Audit Clauses',
    competitorId: 'comp-cloudsphere',
    category: 'Pricing & Packaging' as EventCategory,
    impact: 'High' as ImpactLevel,
    title: 'Inserted Mandatory Annual Compliance Audit Penalties in Legacy Renewal Contracts',
    source: 'Customer Contract Advisory via Procurement Counsel',
    description: 'CloudSphere began notifying legacy customers that refusing annual cloud readiness assessments will incur a 25% surcharge on existing hypervisor maintenance.',
    tags: ['legacy-lock-in', 'contract-penalties', 'forced-migration', 'churn-driver'],
  },
  {
    label: 'DataForge: Exclusive Hyperscaler Co-Sell Expansion',
    competitorId: 'comp-dataforge',
    category: 'M&A & Partnership' as EventCategory,
    impact: 'High' as ImpactLevel,
    title: 'Signed Preferred Co-Sell Integration with Microsoft Azure AI Studio',
    source: 'Microsoft Ignite Partner Brief',
    description: 'Following their AWS co-sell agreement, DataForge expanded its hyperscaler footprint to Azure, allowing customers to spend committed MACC budgets on ForgeCloud.',
    tags: ['azure-macc', 'hyperscaler-cosell', 'channel-expansion', 'procurement-bypass'],
  },
];

export const IngestEventModal: React.FC<IngestEventModalProps> = ({
  isOpen,
  onClose,
  competitors,
  onEventIngested,
}) => {
  const [competitorId, setCompetitorId] = useState(competitors[0]?.id || 'comp-technova');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-09-28');
  const [category, setCategory] = useState<EventCategory>('Product & Feature');
  const [impact, setImpact] = useState<ImpactLevel>('High');
  const [source, setSource] = useState('Competitive Intelligence Feed');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('enterprise, strategy, competitive-move');

  const [isLoading, setIsLoading] = useState(false);
  const [executionResult, setExecutionResult] = useState<PipelineExecutionResult | null>(null);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof PRESET_SCENARIOS[0]) => {
    setCompetitorId(preset.competitorId);
    setCategory(preset.category);
    setImpact(preset.impact);
    setTitle(preset.title);
    setSource(preset.source);
    setDescription(preset.description);
    setTagsInput(preset.tags.join(', '));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsLoading(true);
    try {
      const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
      const result = await api.ingestEvent({
        competitorId,
        date,
        title,
        description,
        category,
        impact,
        source,
        tags,
      });

      setExecutionResult(result);
      onEventIngested();
    } catch (err: any) {
      alert(`Error ingesting event: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Ingest Competitor Intelligence & Trigger Hindsight
              </h2>
              <p className="text-xs text-slate-400">
                Observe the 5-step loop: Current Event → Hindsight Memory Retrieval → Historical Connection → Pattern Detection → Strategic Insight
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setExecutionResult(null);
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content area: form or result */}
        <div className="p-6">
          {!executionResult ? (
            <div>
              {/* Preset buttons */}
              <div className="mb-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-2">
                  Quick Load Real Scenarios
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {PRESET_SCENARIOS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="text-left p-2.5 rounded-lg bg-slate-900 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 text-xs transition"
                    >
                      <div className="font-semibold text-slate-200 truncate">{preset.label}</div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">{preset.category}</div>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Competitor */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Competitor
                    </label>
                    <select
                      value={competitorId}
                      onChange={(e) => setCompetitorId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      {competitors.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.marketSegment})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Event Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Event Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as EventCategory)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Pricing & Packaging">Pricing & Packaging</option>
                      <option value="Enterprise Expansion">Enterprise Expansion</option>
                      <option value="Product & Feature">Product & Feature</option>
                      <option value="Talent & Leadership">Talent & Leadership</option>
                      <option value="M&A & Partnership">M&A & Partnership</option>
                      <option value="Security & Compliance">Security & Compliance</option>
                      <option value="Open Source & Developer">Open Source & Developer</option>
                      <option value="Marketing & Rebranding">Marketing & Rebranding</option>
                    </select>
                  </div>

                  {/* Impact */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Assessed Impact Level
                    </label>
                    <select
                      value={impact}
                      onChange={(e) => setImpact(e.target.value as ImpactLevel)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Critical">Critical (Immediate Strategic Threat)</option>
                      <option value="High">High (Disruptive Shift)</option>
                      <option value="Medium">Medium (Incremental Progress)</option>
                      <option value="Low">Low (Informational)</option>
                    </select>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Event Title / Headline
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Launched Dedicated High-SLA VPC Enterprise Deployment Option"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Detailed Event Narrative (Will be converted to Hindsight Memory)
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe what occurred, who is impacted, and what capability was altered..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Source */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Source / Verification Channel
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SEC Filing, Customer Contract Diff, Press Release"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Strategic Context Tags (Comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. upmarket, enterprise-sales, pricing-war"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center space-x-2 px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Querying Hindsight Memory & Synthesizing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                        <span>Commit Event & Trigger Hindsight</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* PIPELINE EXECUTION DEMO RESULTS VIEW */
            <div className="space-y-6 animate-fadeIn">
              {/* Pipeline Step Progress Visualizer */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Hindsight Pipeline Completed in {executionResult.executionDurationMs}ms</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Engine: <strong className="text-slate-200">{executionResult.aiModelUsed}</strong>
                  </span>
                </div>

                {/* 5-Step Pipeline Flow Bar */}
                <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-semibold">
                  <div className="p-2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    1. Current Event Ingested
                  </div>
                  <div className="p-2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    2. Hindsight Memory Retrieval
                  </div>
                  <div className="p-2 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    3. Historical Connection
                  </div>
                  <div className="p-2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    4. Pattern Detection
                  </div>
                  <div className="p-2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    5. Strategic Insight
                  </div>
                </div>
              </div>

              {/* Step 1: Current Event */}
              <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/30">
                <div className="flex items-center justify-between text-xs mb-1 text-indigo-400 font-semibold uppercase tracking-wider">
                  <span>Step 1: Current Event</span>
                  <span className="text-slate-400 font-mono">{executionResult.currentEvent.date}</span>
                </div>
                <h3 className="text-base font-bold text-white">
                  {executionResult.currentEvent.competitorName}: {executionResult.currentEvent.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  {executionResult.currentEvent.description}
                </p>
              </div>

              {/* Step 2 & 3: Hindsight Retrieval & Historical Connection */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-cyan-400 font-semibold uppercase tracking-wider flex items-center space-x-1.5">
                    <Database className="w-3.5 h-3.5" />
                    <span>Steps 2 & 3: Retrieved {executionResult.retrievedMemories.length} Historical Memories from Hindsight</span>
                  </span>
                  <span className="text-[11px] text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    Historical Span: {executionResult.historicalConnection.timelineBreadth} ({executionResult.historicalConnection.spanMonths} Months)
                  </span>
                </div>
                
                <p className="text-xs text-slate-300 mb-3 italic bg-slate-950/50 p-2.5 rounded-lg border border-slate-800">
                  "{executionResult.historicalConnection.narrative}"
                </p>

                <div className="space-y-2">
                  {executionResult.retrievedMemories.map((ret, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-400 font-mono text-[11px]">{ret.memory.eventDate}</span>
                          <span className="font-semibold text-slate-200">{ret.memory.title}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">{ret.retrievalReason}</div>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-[11px] border border-cyan-800">
                          {ret.relevanceScore}% Match
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {ret.temporalDeltaDays}d prior
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 4 & 5: Pattern & Strategic Insight */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/60 to-purple-950/40 border border-violet-500/40">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-yellow-400 font-semibold uppercase tracking-wider flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Steps 4 & 5: Pattern Detected & Strategic Synthesis</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-mono text-[11px] border border-violet-500/30">
                    Pattern: {executionResult.patternDetection.patternName} ({executionResult.patternDetection.confidence}%)
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-1.5">
                  {executionResult.strategicInsight.title}
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed mb-3">
                  {executionResult.strategicInsight.thesis}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    <span className="font-semibold text-rose-400 block mb-1">Market Share Risk</span>
                    <p className="text-slate-300 text-[11px]">{executionResult.strategicInsight.implications.marketShareRisk}</p>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    <span className="font-semibold text-emerald-400 block mb-1">Immediate Counter-Move</span>
                    <ul className="text-slate-300 text-[11px] list-disc list-inside space-y-0.5">
                      {executionResult.strategicInsight.recommendedActions.immediate.map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Footer action */}
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => {
                    setExecutionResult(null);
                    onClose();
                  }}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition"
                >
                  Done & Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
