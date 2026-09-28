import React, { useState } from 'react';
import {
  BrainCircuit,
  Search,
  Database,
  Layers,
  Sparkles,
  ArrowRight,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Tag,
  Download,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { HindsightMemory, Competitor, MemoryRetrievalResult } from '../types';
import { api } from '../services/api';

interface HindsightMemoryPageProps {
  memories: HindsightMemory[];
  competitors: Competitor[];
  onRefresh: () => void;
  onSelectTab: (tab: any) => void;
}

export const HindsightMemoryPage: React.FC<HindsightMemoryPageProps> = ({
  memories,
  competitors,
  onRefresh,
  onSelectTab,
}) => {
  // Playground state
  const [queryText, setQueryText] = useState('enterprise pricing discounts SOC2 compliance');
  const [selectedCompId, setSelectedCompId] = useState<string>('comp-technova');
  const [isQuerying, setIsQuerying] = useState(false);
  const [retrievedResults, setRetrievedResults] = useState<MemoryRetrievalResult[] | null>(null);

  // Inspector / table search filter
  const [filterQuery, setFilterQuery] = useState('');
  const [filterCompetitor, setFilterCompetitor] = useState('all');
  const [filterImpact, setFilterImpact] = useState('all');

  // Manual memory creation form toggle
  const [showAddForm, setShowAddForm] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualContent, setManualContent] = useState('');
  const [manualCompId, setManualCompId] = useState(competitors[0]?.id || 'comp-technova');
  const [manualDate, setManualDate] = useState('2026-09-28');
  const [isSavingManual, setIsSavingManual] = useState(false);

  // Handle playground test
  const handleTestRetrieval = async () => {
    setIsQuerying(true);
    try {
      const results = await api.retrieveMemories({
        text: queryText,
        competitorId: selectedCompId === 'all' ? undefined : selectedCompId,
        topK: 5,
      });
      setRetrievedResults(results);
    } catch (err: any) {
      alert(`Retrieval query error: ${err.message}`);
    } finally {
      setIsQuerying(false);
    }
  };

  const handleSaveManualMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle || !manualContent) return;

    setIsSavingManual(true);
    try {
      const comp = competitors.find((c) => c.id === manualCompId);
      await api.addManualMemory({
        competitorId: manualCompId,
        competitorName: comp ? comp.name : 'Unknown',
        eventDate: manualDate,
        title: manualTitle,
        naturalLanguageContent: manualContent,
        impactLevel: 'Medium',
        productArea: 'Enterprise Strategy',
        tags: ['manual-intelligence', 'hindsight-direct'],
      });
      setShowAddForm(false);
      setManualTitle('');
      setManualContent('');
      onRefresh();
    } catch (err: any) {
      alert(`Error saving manual memory: ${err.message}`);
    } finally {
      setIsSavingManual(false);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(memories, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `hindsight_memories_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filtered table memories
  const filteredMemories = memories.filter((mem) => {
    if (filterCompetitor !== 'all' && mem.competitorId !== filterCompetitor) return false;
    if (filterImpact !== 'all' && mem.impactLevel !== filterImpact) return false;
    if (filterQuery) {
      const q = filterQuery.toLowerCase();
      return (
        mem.title.toLowerCase().includes(q) ||
        mem.naturalLanguageContent.toLowerCase().includes(q) ||
        mem.competitorName.toLowerCase().includes(q) ||
        mem.productArea.toLowerCase().includes(q) ||
        mem.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: Hindsight Persistent Memory Architecture */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
              <Database className="w-3.5 h-3.5" />
              <span>Hindsight Persistent Memory Layer</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Stateful Intelligence Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Traditional competitive intelligence forgets what happened last quarter. Hindsight continuously preserves natural-language memories, creates graph associations between pricing, product, and leadership events, and feeds them into AI reasoning layers when new signals emerge.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800 text-xs text-center min-w-[120px]">
              <span className="text-slate-400 block text-[10px] uppercase">Persistent Nodes</span>
              <span className="text-cyan-300 font-mono font-bold text-lg">{memories.length}</span>
            </div>
            <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800 text-xs text-center min-w-[120px]">
              <span className="text-slate-400 block text-[10px] uppercase">Storage State</span>
              <span className="text-emerald-400 font-bold text-xs flex items-center justify-center space-x-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>On-Disk Synced</span>
              </span>
            </div>
            <button
              onClick={handleExportJson}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center space-x-1.5"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Memory Retrieval Playground */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <BrainCircuit className="w-5 h-5 text-indigo-400" />
              <span>Interactive Hindsight Retrieval Playground</span>
            </h2>
            <p className="text-xs text-slate-400">
              Test how Hindsight surfaces relevant historical memories for any hypothesis or strategic signal
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/50 px-2 py-1 rounded border border-cyan-800">
            Vector & Temporal Recall
          </span>
        </div>

        {/* Query Input Controls */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-8">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Search Hypothesis / Strategic Clue
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                placeholder="e.g. enterprise pricing discounts SOC2 compliance"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Competitor Scope
            </label>
            <select
              value={selectedCompId}
              onChange={(e) => setSelectedCompId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">Cross-Competitor (All)</option>
              {competitors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              onClick={handleTestRetrieval}
              disabled={isQuerying}
              className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-md transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>{isQuerying ? 'Retrieving...' : 'Query Hindsight'}</span>
            </button>
          </div>
        </div>

        {/* Quick query suggestion chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-slate-400">Quick Queries:</span>
          {[
            'TechNova enterprise hiring and SOC2',
            'CloudSphere legacy contract price hikes',
            'DataForge open core to cloud monetization',
            'pricing war churn risk',
          ].map((sample, i) => (
            <button
              key={i}
              onClick={() => {
                setQueryText(sample);
                if (sample.includes('TechNova')) setSelectedCompId('comp-technova');
                else if (sample.includes('CloudSphere')) setSelectedCompId('comp-cloudsphere');
                else if (sample.includes('DataForge')) setSelectedCompId('comp-dataforge');
                else setSelectedCompId('all');
              }}
              className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition text-[11px]"
            >
              {sample}
            </button>
          ))}
        </div>

        {/* Results of retrieval query */}
        {retrievedResults && (
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-cyan-400 uppercase tracking-wider">
                Retrieved {retrievedResults.length} Memories from Hindsight Store
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                Ranked by Contextual Relevance
              </span>
            </div>

            <div className="space-y-2.5">
              {retrievedResults.map((res, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-cyan-500/40 transition space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-cyan-400 font-semibold">{res.memory.eventDate}</span>
                      <span className="text-slate-500">•</span>
                      <span className="font-semibold text-indigo-300">{res.memory.competitorName}</span>
                      <span className="text-slate-500">•</span>
                      <span className="font-bold text-white">{res.memory.title}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-[11px] border border-cyan-800">
                      {res.relevanceScore}% Relevance Score
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    "{res.memory.naturalLanguageContent}"
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-400">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-indigo-400 font-medium">Retrieval Vector:</span>
                      <span>{res.retrievalReason}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {res.sharedDimensions.map((dim, dIdx) => (
                        <span key={dIdx} className="px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 text-[10px] border border-slate-800">
                          {dim}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Memory Bank Explorer (Full Table & Filter) */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Database className="w-5 h-5 text-cyan-400" />
              <span>Hindsight Persistent Memory Ledger ({memories.length} Total Nodes)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Survives browser reloads and server restarts. Encodes rich natural-language observations.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'Close Form' : 'Add Manual Memory'}</span>
            </button>
            <button
              onClick={onRefresh}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
              title="Refresh store"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Manual Add Memory Form */}
        {showAddForm && (
          <form onSubmit={handleSaveManualMemory} className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-3 animate-fadeIn">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
              Inject Direct Memory Node into Hindsight
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Competitor</label>
                <select
                  value={manualCompId}
                  onChange={(e) => setManualCompId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200"
                >
                  {competitors.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Date</label>
                <input
                  type="date"
                  value={manualDate}
                  onChange={(e) => setManualDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Memory Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Secret stealth beta with 5 banking customers"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Natural Language Intelligence Narrative</label>
              <textarea
                rows={2}
                required
                placeholder="Write the full memory observation. Hindsight parses this for historical pattern correlation..."
                value={manualContent}
                onChange={(e) => setManualContent(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1 rounded bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingManual}
                className="px-4 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                {isSavingManual ? 'Committing...' : 'Commit to Hindsight'}
              </button>
            </div>
          </form>
        )}

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search natural language memories..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200"
            />
          </div>
          <select
            value={filterCompetitor}
            onChange={(e) => setFilterCompetitor(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300"
          >
            <option value="all">All Competitors</option>
            {competitors.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={filterImpact}
            onChange={(e) => setFilterImpact(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300"
          >
            <option value="all">All Impact Levels</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <div className="ml-auto text-[11px] font-mono text-slate-500">
            Displaying {filteredMemories.length} entries
          </div>
        </div>

        {/* Memories List */}
        <div className="space-y-3">
          {filteredMemories.map((mem) => (
            <div
              key={mem.id}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-cyan-400">{mem.eventDate}</span>
                  <span className="font-bold text-indigo-300">{mem.competitorName}</span>
                  <span className="px-2 py-0.2 rounded bg-slate-800 text-slate-300 font-medium">
                    {mem.eventType}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      mem.impactLevel === 'Critical'
                        ? 'bg-rose-500/20 text-rose-300'
                        : mem.impactLevel === 'High'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {mem.impactLevel}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  ID: {mem.id}
                </span>
              </div>

              <h4 className="text-sm font-semibold text-white">{mem.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{mem.naturalLanguageContent}</p>

              <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 border-t border-slate-900">
                <div className="flex items-center space-x-2">
                  <span>Source: <strong className="text-slate-300 font-normal">{mem.source}</strong></span>
                  <span>•</span>
                  <span>Product Area: <strong className="text-slate-300 font-normal">{mem.productArea}</strong></span>
                </div>

                <div className="flex items-center space-x-1">
                  {mem.tags.map((t, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px]">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
