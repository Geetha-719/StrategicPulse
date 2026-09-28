import React from 'react';
import {
  Users,
  GitCommit,
  BrainCircuit,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Calendar,
  ShieldAlert,
  Building2,
  ChevronRight,
  Layers,
  Database,
  CheckCircle2,
} from 'lucide-react';
import {
  Competitor,
  IntelligenceEvent,
  HindsightMemory,
  StrategicPattern,
  StrategicInsight,
  NavTab,
} from '../types';

interface DashboardPageProps {
  competitors: Competitor[];
  events: IntelligenceEvent[];
  memories: HindsightMemory[];
  patterns: StrategicPattern[];
  insights: StrategicInsight[];
  onOpenAnalysisModal: () => void;
  onOpenIngestModal: () => void;
  onSelectTab: (tab: any) => void;
  onSelectEventForTimeline: (eventId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  competitors,
  events,
  memories,
  patterns,
  insights,
  onOpenAnalysisModal,
  onOpenIngestModal,
  onSelectTab,
  onSelectEventForTimeline,
}) => {
  // Metric calculations
  const highImpactEvents = events.filter((e) => e.impact === 'Critical' || e.impact === 'High');
  const recentEvents = events.slice(0, 5);
  const latestInsight = insights[0];

  // Category counts for visual distribution
  const categoryCounts = events.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Competitor activity counts
  const compActivity = competitors.map((c) => ({
    name: c.name,
    color: c.color,
    count: events.filter((e) => e.competitorId === c.id).length,
    threat: c.threatScore,
  }));

  // Timeline monthly activity simulation for chart
  const months = ['Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026', 'Jun 2026', 'Jul 2026', 'Aug 2026', 'Sep 2026'];
  const monthlyData = months.map((m, idx) => {
    const monthNum = String(idx + 1).padStart(2, '0');
    const count = events.filter((e) => e.date.startsWith(`2026-${monthNum}`)).length;
    return { month: m.split(' ')[0], count };
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Callout */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/20 p-6 sm:p-8">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-cyan-500/5 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <BrainCircuit className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Hindsight Persistent Memory Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Competitive Intelligence with Long-Term Strategic Recall
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Unlike stateless scrapers that only track isolated daily moves, StrategicPulse stores competitor actions in <strong>Hindsight</strong>, correlating 9 months of historical moves to detect macro strategic shifts before they manifest in market share loss.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAnalysisModal}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition transform active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Run Intelligence Analysis</span>
            </button>
            <button
              onClick={() => onSelectTab('timeline')}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition"
            >
              <span>Explore Memory Timeline</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={onOpenIngestModal}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 text-xs sm:text-sm border border-indigo-500/30 transition"
            >
              <span>+ Ingest Event</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Competitors */}
        <div
          onClick={() => onSelectTab('competitors')}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Competitors Tracked
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{competitors.length}</span>
            <span className="text-xs text-blue-400 font-medium">Enterprise Tier</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">All entities mapped in Hindsight</p>
        </div>

        {/* Total Events */}
        <div
          onClick={() => onSelectTab('timeline')}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Intelligence Events
            </span>
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 group-hover:scale-110 transition">
              <GitCommit className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{events.length}</span>
            <span className="text-xs text-emerald-400 font-medium">+100% verified</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Chronological activity feed</p>
        </div>

        {/* Hindsight Memories Stored */}
        <div
          onClick={() => onSelectTab('memory')}
          className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 hover:border-cyan-500/50 transition cursor-pointer group shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Hindsight Memories
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition">
              <BrainCircuit className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-cyan-300 font-mono">{memories.length}</span>
            <span className="text-xs text-cyan-400 font-medium">Persistent Nodes</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Contextual recall surviving sessions</p>
        </div>

        {/* Strategic Patterns Detected */}
        <div
          onClick={() => onSelectTab('analysis')}
          className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Strategic Patterns
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-110 transition">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-amber-300">{patterns.length}</span>
            <span className="text-xs text-amber-400 font-medium">Active Vectors</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Multi-event intent correlated</p>
        </div>
      </div>

      {/* Latest Strategic Insight Highlight */}
      {latestInsight && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center space-x-2">
              <span className="p-1 rounded-md bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">
                Latest Strategic Synthesis via Hindsight Memory
              </span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Confidence: <strong className="text-emerald-400">{latestInsight.confidence}%</strong> • {latestInsight.timeframe}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white mb-2">
            {latestInsight.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
            {latestInsight.thesis}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block mb-1">
                Hindsight Historical Connection
              </span>
              <p className="text-slate-300 text-xs">
                {latestInsight.historicalConnectionSummary}
              </p>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                Primary Recommended Counter-Action
              </span>
              <p className="text-slate-300 text-xs">
                {latestInsight.recommendedActions.immediate[0] || 'Deploy targeted battlecards.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Charts & Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Competitor Activity Over Time (SVG Bar/Area) */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Competitor Activity Over Time (2026)</h3>
              <p className="text-xs text-slate-400">Events cataloged in Hindsight persistent memory</p>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/50 px-2 py-1 rounded border border-cyan-800">
              9-Month Intelligence Span
            </span>
          </div>

          {/* Clean SVG Bar Chart */}
          <div className="h-48 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-800">
            {monthlyData.map((item, idx) => {
              const maxVal = Math.max(...monthlyData.map((d) => d.count), 4);
              const heightPct = Math.max(12, Math.round((item.count / maxVal) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition">
                    {item.count}
                  </span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className="w-full max-w-[28px] rounded-t-md bg-gradient-to-t from-indigo-600 to-cyan-400 opacity-80 group-hover:opacity-100 transition shadow-sm group-hover:shadow-indigo-500/30"
                  />
                  <span className="text-[10px] font-medium text-slate-400">{item.month}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>Jan 2026: Pricing war begins</span>
            <span>Sep 2026: NovaEnterprise launch</span>
          </div>
        </div>

        {/* Activity by Competitor */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white tracking-tight">Activity by Competitor</h3>
              <span className="text-xs text-slate-400">Threat Index</span>
            </div>
            <div className="space-y-3 mt-4">
              {compActivity.map((comp, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: comp.color }} />
                      <span>{comp.name}</span>
                    </span>
                    <span className="font-mono text-slate-400">
                      {comp.count} moves • <strong className="text-rose-400">{comp.threat} Threat</strong>
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, comp.count * 16)}%`,
                        backgroundColor: comp.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Fastest Mover:</span>
            <span className="font-semibold text-indigo-400">TechNova (6 major maneuvers)</span>
          </div>
        </div>
      </div>

      {/* Event Categories & Strategic Patterns Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Strategic Patterns Detected */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Active Strategic Patterns in Hindsight
              </h3>
              <p className="text-xs text-slate-400">
                Persistent behavioral models synthesized across multiple months
              </p>
            </div>
            <button
              onClick={() => onSelectTab('analysis')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {patterns.map((pat) => (
              <div
                key={pat.id}
                onClick={() => onSelectTab('analysis')}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/40 transition cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-indigo-300">{pat.competitorName}</span>
                    <span className="text-slate-500">•</span>
                    <span className="font-bold text-white">{pat.patternName}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      pat.threatLevel === 'Severe'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {pat.threatLevel} ({pat.confidence}%)
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {pat.summary}
                </p>
                <div className="mt-2 flex items-center space-x-3 text-[11px] text-slate-500">
                  <span>First observed: {pat.firstObservedDate}</span>
                  <span>•</span>
                  <span>{pat.supportingMemoryIds.length} Correlated Memories</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High-Impact Events & Recent Activity */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Recent Competitor Activity</h3>
              <p className="text-xs text-slate-400">Live intelligence feed</p>
            </div>
            <button
              onClick={() => onSelectTab('timeline')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-1"
            >
              <span>Timeline</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => {
                  onSelectTab('timeline');
                  onSelectEventForTimeline(evt.id);
                }}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition cursor-pointer group"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-slate-300 group-hover:text-white transition">
                      {evt.competitorName}
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
                  <span className="text-[11px] font-mono text-slate-500">{evt.date}</span>
                </div>
                <div className="text-xs text-slate-200 font-medium truncate">{evt.title}</div>
                <div className="mt-1 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 truncate max-w-[200px]">{evt.category}</span>
                  <span className="text-cyan-400/80 font-mono text-[10px] flex items-center space-x-1">
                    <BrainCircuit className="w-3 h-3" />
                    <span>Memory Synced</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
