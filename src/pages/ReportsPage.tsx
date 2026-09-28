import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Download,
  Share2,
  Calendar,
  Building2,
  Layers,
  BrainCircuit,
  CheckCircle2,
  Printer,
  Copy,
} from 'lucide-react';
import { ExecutiveReport, Competitor } from '../types';
import { api } from '../services/api';

interface ReportsPageProps {
  reports: ExecutiveReport[];
  competitors: Competitor[];
  onRefresh: () => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({
  reports,
  competitors,
  onRefresh,
}) => {
  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0]?.id || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const selectedReport = reports.find((r) => r.id === selectedReportId) || reports[0];

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const newReport = await api.generateReport({
        title: `Comprehensive Cross-Competitor Dossier (Q3 2026)`,
        competitorIds: competitors.map((c) => c.id),
      });
      onRefresh();
      setSelectedReportId(newReport.id);
    } catch (err: any) {
      alert(`Report generation failed: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopySummary = () => {
    if (!selectedReport) return;
    const text = `# ${selectedReport.title}\nDate: ${selectedReport.date}\nAuthor: ${selectedReport.author}\n\n## Executive Summary\n${selectedReport.summary}\n\n## Key Findings\n${selectedReport.keyFindings.map((f) => `- ${f}`).join('\n')}\n\n## Pattern Synthesis\n${selectedReport.patternSynthesis}\n\n## Recommended Playbooks\n${selectedReport.recommendedPlaybooks.map((p) => `- ${p}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-bold text-white tracking-tight">Executive Intelligence Reports</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Board-level briefs synthesized from Hindsight persistent memory records
          </p>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-md transition disabled:opacity-50 self-start"
        >
          <Plus className="w-4 h-4" />
          <span>{isGenerating ? 'Compiling Dossier...' : 'Generate New Brief'}</span>
        </button>
      </div>

      {/* Main Grid: Left Reports List, Right Report Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Report List */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block px-1">
            Published Briefings ({reports.length})
          </span>

          <div className="space-y-2">
            {reports.map((rep) => {
              const isSelected = rep.id === selectedReport?.id;
              return (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReportId(rep.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500 shadow-md ring-1 ring-indigo-500/40'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-cyan-400">{rep.date}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {rep.memoriesReferencedCount} Memories
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{rep.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{rep.summary}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Report Viewer */}
        <div className="lg:col-span-8">
          {selectedReport ? (
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center space-x-2 text-xs text-indigo-400 font-semibold mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{selectedReport.date}</span>
                    <span>•</span>
                    <span>{selectedReport.author}</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight">
                    {selectedReport.title}
                  </h2>
                </div>

                <div className="flex items-center space-x-2 self-start">
                  <button
                    onClick={handleCopySummary}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition flex items-center space-x-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copyFeedback ? 'Copied!' : 'Copy Brief'}</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition flex items-center space-x-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              {/* Competitors covered pill */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-400">Target Competitors:</span>
                {selectedReport.competitorsCovered.map((cName, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium"
                  >
                    {cName}
                  </span>
                ))}
              </div>

              {/* Executive Summary */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Executive Summary
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                  {selectedReport.summary}
                </p>
              </div>

              {/* Key Findings */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Key Strategic Findings
                </h3>
                <div className="space-y-2">
                  {selectedReport.keyFindings.map((finding, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start space-x-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{finding}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pattern Synthesis */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Hindsight Pattern Synthesis
                </h3>
                <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/20 text-xs text-slate-300 leading-relaxed">
                  {selectedReport.patternSynthesis}
                </div>
              </div>

              {/* Recommended Playbooks */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Recommended Response Playbooks
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedReport.recommendedPlaybooks.map((play, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 text-xs space-y-1"
                    >
                      <span className="font-bold text-emerald-400 block">{play}</span>
                      <p className="text-slate-400 text-[11px]">
                        Tactical execution sequence prepared for sales enablement and roadmap defense.
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evidence Attribution Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center space-x-1.5 font-mono">
                  <BrainCircuit className="w-4 h-4 text-cyan-400" />
                  <span>Verified across {selectedReport.memoriesReferencedCount} persistent Hindsight memories</span>
                </span>
                <span>Classification: Executive Internal Eyes Only</span>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">No report selected.</div>
          )}
        </div>
      </div>
    </div>
  );
};
