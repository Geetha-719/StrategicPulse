import React, { useState } from 'react';
import {
  GitCommit,
  Filter,
  BrainCircuit,
  Calendar,
  Layers,
  ArrowDown,
  Sparkles,
  Link2,
  Clock,
  ExternalLink,
  ChevronRight,
  Database,
  Search,
  CheckCircle,
} from 'lucide-react';
import {
  IntelligenceEvent,
  HindsightMemory,
  Competitor,
  EventCategory,
  ImpactLevel,
  MemoryRetrievalResult,
} from '../types';
import { api } from '../services/api';

interface TimelinePageProps {
  events: IntelligenceEvent[];
  memories: HindsightMemory[];
  competitors: Competitor[];
  selectedEventId: string | null;
  onSelectEvent: (id: string) => void;
  onSelectTab: (tab: any) => void;
}

export const TimelinePage: React.FC<TimelinePageProps> = ({
  events,
  memories,
  competitors,
  selectedEventId,
  onSelectEvent,
  onSelectTab,
}) => {
  // Filters
  const [selectedCompetitorFilter, setSelectedCompetitorFilter] = useState<string>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedImpactFilter, setSelectedImpactFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamically retrieved memories for currently active event
  const [dynamicRetrieved, setDynamicRetrieved] = useState<MemoryRetrievalResult[] | null>(null);
  const [isRetrieving, setIsRetrieving] = useState(false);

  // Active event
  const currentEvent =
    events.find((e) => e.id === selectedEventId) || events[0] || null;

  // Filter events
  const filteredEvents = events.filter((e) => {
    if (selectedCompetitorFilter !== 'all' && e.competitorId !== selectedCompetitorFilter) return false;
    if (selectedCategoryFilter !== 'all' && e.category !== selectedCategoryFilter) return false;
    if (selectedImpactFilter !== 'all' && e.impact !== selectedImpactFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.competitorName.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Corresponding Hindsight memory for current event
  const currentEventMemory = currentEvent
    ? memories.find((m) => m.id === currentEvent.hindsightMemoryId || m.title === currentEvent.title)
    : null;

  // Static related memories from relatedMemoryIds if dynamic not yet triggered
  const staticRelatedMemories = currentEventMemory
    ? memories.filter(
        (m) =>
          m.id !== currentEventMemory.id &&
          (currentEventMemory.relatedMemoryIds.includes(m.id) ||
            m.relatedMemoryIds.includes(currentEventMemory.id) ||
            (m.competitorId === currentEventMemory.competitorId &&
              new Date(m.eventDate) < new Date(currentEventMemory.eventDate)))
      ).slice(0, 4)
    : [];

  const handleFetchLiveHindsightRetrieval = async () => {
    if (!currentEvent) return;
    setIsRetrieving(true);
    try {
      const results = await api.retrieveMemories({
        text: `${currentEvent.title} ${currentEvent.description}`,
        competitorId: currentEvent.competitorId,
        category: currentEvent.category,
        tags: currentEvent.tags,
        currentDate: currentEvent.date,
        topK: 5,
      });
      // Filter out self
      const withoutSelf = results.filter((r) => r.memory.id !== currentEvent.hindsightMemoryId);
      setDynamicRetrieved(withoutSelf);
    } catch (err: any) {
      console.error('Error querying Hindsight:', err);
    } finally {
      setIsRetrieving(false);
    }
  };

  const handleSelectEventItem = (id: string) => {
    onSelectEvent(id);
    setDynamicRetrieved(null); // reset so user can observe fresh retrieval
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <GitCommit className="w-6 h-6 text-indigo-400" />
          <h1 className="text-2xl font-bold text-white tracking-tight">Intelligence Timeline & Memory Lineage</h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Select any current or past competitor event to observe how <strong>Hindsight</strong> retrieves historical precedents and links them across time.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search timeline events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Competitor filter */}
          <select
            value={selectedCompetitorFilter}
            onChange={(e) => setSelectedCompetitorFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Competitors</option>
            {competitors.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Category filter */}
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Categories</option>
            <option value="Pricing & Packaging">Pricing & Packaging</option>
            <option value="Enterprise Expansion">Enterprise Expansion</option>
            <option value="Product & Feature">Product & Feature</option>
            <option value="Talent & Leadership">Talent & Leadership</option>
            <option value="M&A & Partnership">M&A & Partnership</option>
            <option value="Security & Compliance">Security & Compliance</option>
            <option value="Open Source & Developer">Open Source & Developer</option>
          </select>

          {/* Impact filter */}
          <select
            value={selectedImpactFilter}
            onChange={(e) => setSelectedImpactFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Impacts</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="text-[11px] font-mono text-slate-400">
          Showing {filteredEvents.length} of {events.length} events
        </div>
      </div>

      {/* Main Grid: Left Event Feed, Right Memory Retrieval Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Chronological Event Feed */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-semibold uppercase tracking-wider">
            <span>Chronological Feed</span>
            <span>Click to Inspect Lineage</span>
          </div>

          <div className="space-y-2.5 max-h-[780px] overflow-y-auto pr-1">
            {filteredEvents.map((evt) => {
              const isSelected = evt.id === currentEvent?.id;
              const comp = competitors.find((c) => c.id === evt.competitorId);

              return (
                <div
                  key={evt.id}
                  onClick={() => handleSelectEventItem(evt.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer relative ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                  }`}
                >
                  {/* Left accent bar */}
                  <div
                    className="absolute left-0 top-3 bottom-3 w-1 rounded-r"
                    style={{ backgroundColor: comp?.color || '#6366F1' }}
                  />

                  <div className="flex items-center justify-between text-xs mb-1.5 pl-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white">{evt.competitorName}</span>
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
                    <span className="font-mono text-[11px] text-cyan-400">{evt.date}</span>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-100 pl-2 leading-snug">
                    {evt.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 pl-2 mt-1 line-clamp-2">
                    {evt.description}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between pl-2 text-[10px] text-slate-500 font-mono">
                    <span>{evt.category}</span>
                    <span className="flex items-center space-x-1 text-cyan-400">
                      <BrainCircuit className="w-3 h-3" />
                      <span>Hindsight Stored</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: CRITICAL PROJECT DEMONSTRATION VIEW */}
        {/* CURRENT EVENT -> HINDSIGHT MEMORY RETRIEVAL -> RELATED HISTORICAL MEMORIES */}
        <div className="lg:col-span-7 sticky top-24 space-y-4">
          {currentEvent ? (
            <div className="space-y-4">
              {/* CURRENT EVENT CARD */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border-2 border-indigo-500/60 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                    <span>Current Event</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{currentEvent.date}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-1.5">
                  <span className="text-sm font-semibold text-indigo-300">
                    {currentEvent.competitorName}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-xs font-medium text-slate-400">{currentEvent.category}</span>
                </div>

                <h3 className="text-lg font-extrabold text-white tracking-tight mb-2">
                  {currentEvent.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                  {currentEvent.description}
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">Source:</span>
                    <span className="text-slate-300 font-medium">{currentEvent.source}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {currentEvent.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Glowing Connection Bridge / Hindsight Retrieval Pipeline */}
              <div className="relative py-2 flex flex-col items-center">
                <div className="w-0.5 h-6 bg-gradient-to-b from-indigo-500 to-cyan-400" />
                <div className="my-1 px-4 py-1.5 rounded-full bg-slate-950 border border-cyan-500/50 shadow-lg shadow-cyan-500/20 text-xs font-mono text-cyan-300 flex items-center space-x-2">
                  <BrainCircuit className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                  <span>HINDSIGHT HISTORICAL MEMORY RETRIEVAL</span>
                  <ArrowDown className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
                </div>
                <div className="w-0.5 h-6 bg-gradient-to-b from-cyan-400 to-violet-500" />
              </div>

              {/* RELATED HISTORICAL MEMORIES FROM HINDSIGHT */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/30 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                      <Database className="w-4 h-4 text-cyan-400" />
                      <span>Related Historical Memories from Hindsight</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Persistent memories retrieved across previous months that connect to this event
                    </p>
                  </div>
                  <button
                    onClick={handleFetchLiveHindsightRetrieval}
                    disabled={isRetrieving}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-xs font-medium transition self-start"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isRetrieving ? 'Querying Hindsight...' : 'Re-Run Memory Retrieval'}</span>
                  </button>
                </div>

                {/* Display retrieved results (Dynamic or Seed Linked) */}
                {dynamicRetrieved ? (
                  <div className="space-y-3">
                    {dynamicRetrieved.length === 0 ? (
                      <p className="text-xs text-slate-400">No prior memories met the retrieval threshold.</p>
                    ) : (
                      dynamicRetrieved.map((res, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2">
                              <span className="font-mono text-cyan-400 font-semibold">{res.memory.eventDate}</span>
                              <span className="text-slate-500">•</span>
                              <span className="font-bold text-white">{res.memory.title}</span>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-[11px] border border-cyan-800">
                              {res.relevanceScore}% Relevance
                            </span>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed italic">
                            "{res.memory.naturalLanguageContent}"
                          </p>

                          <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                            <span className="text-indigo-300 font-medium">
                              Why Hindsight Retrieved This:
                            </span>
                            <span className="text-slate-300">{res.retrievalReason}</span>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-500">
                            <span>Occurred {res.temporalDeltaDays} days before current event</span>
                            <span>Product Area: {res.memory.productArea}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {staticRelatedMemories.length === 0 ? (
                      <p className="text-xs text-slate-400">
                        Initial baseline event in Hindsight. Subsequent events will retrieve this node as historical context.
                      </p>
                    ) : (
                      staticRelatedMemories.map((mem, i) => {
                        const daysDiff = Math.abs(
                          Math.round(
                            (new Date(currentEvent.date).getTime() - new Date(mem.eventDate).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )
                        );
                        return (
                          <div
                            key={mem.id}
                            className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition space-y-2"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center space-x-2">
                                <span className="font-mono text-cyan-400 font-semibold">{mem.eventDate}</span>
                                <span className="text-slate-500">•</span>
                                <span className="font-bold text-white">{mem.title}</span>
                              </div>
                              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-[11px] border border-cyan-800">
                                Correlated Historical Fact
                              </span>
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed italic">
                              "{mem.naturalLanguageContent}"
                            </p>

                            <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                              <span className="text-indigo-300 font-medium">Historical Context:</span>
                              <span className="text-slate-300 truncate max-w-[340px]">{mem.historicalContext}</span>
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-slate-500">
                              <span>Occurred {daysDiff} days prior to current event</span>
                              <span>Category: {mem.eventType}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}

                {/* Strategic Takeaway summary */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Persistent Pattern Linkage:</span>
                  <button
                    onClick={() => onSelectTab('analysis')}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
                  >
                    <span>View Strategic Synthesis</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">
              Select an event from the left timeline to inspect Hindsight memory retrieval.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
