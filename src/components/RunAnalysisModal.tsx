import React, { useState } from 'react';
import {
  X,
  Sparkles,
  BrainCircuit,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Database,
} from 'lucide-react';
import { api } from '../services/api';

interface RunAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalysisCompleted: () => void;
}

export const RunAnalysisModal: React.FC<RunAnalysisModalProps> = ({
  isOpen,
  onClose,
  onAnalysisCompleted,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleStartAnalysis = async () => {
    setIsRunning(true);
    try {
      const res = await api.runAnalysis();
      setResult(res);
      onAnalysisCompleted();
    } catch (e: any) {
      alert(`Error running analysis: ${e.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Run Cross-Competitor Intelligence Analysis
              </h3>
              <p className="text-xs text-slate-400">
                Queries Hindsight persistent memory store to correlate multi-month trajectories
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setResult(null);
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {!result ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400">
                  <Database className="w-4 h-4" />
                  <span>Hindsight Memory Cross-Referencing Protocol</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Executing this analysis scans all active competitor memories stored in Hindsight, calculates temporal linkages, clusters related moves across pricing, product, and talent, and validates ongoing strategic patterns with AI reasoning.
                </p>
                <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-400">
                  <div className="bg-slate-900 p-2 rounded border border-slate-800 text-center">
                    <span className="block text-slate-200 font-semibold">Semantic Scan</span>
                    <span>Multi-vector match</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800 text-center">
                    <span className="block text-slate-200 font-semibold">Time-Series</span>
                    <span>12-Month Window</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800 text-center">
                    <span className="block text-slate-200 font-semibold">Threat Model</span>
                    <span>Playbook synthesis</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStartAnalysis}
                  disabled={isRunning}
                  className="inline-flex items-center space-x-2 px-5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
                >
                  {isRunning ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Synthesizing Memory Graphs...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                      <span>Execute Full Intelligence Analysis</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Intelligence Synthesis Successfully Executed</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase">Strategic Patterns Detected</span>
                  <div className="text-xl font-bold text-white mt-0.5">{result.patternsDetected}</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase">Insights Generated</span>
                  <div className="text-xl font-bold text-cyan-400 mt-0.5">{result.insightsGenerated}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="font-semibold text-indigo-400 block mb-1">Executive Summary</span>
                <p className="text-slate-300 leading-relaxed">{result.summary}</p>
              </div>

              {result.highRiskCompetitors && result.highRiskCompetitors.length > 0 && (
                <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 text-xs flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="text-rose-200">
                    High-threat competitors requiring immediate defensive posture:{' '}
                    <strong>{result.highRiskCompetitors.join(', ')}</strong>
                  </span>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    onClose();
                  }}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
                >
                  Close & View Updated Intelligence
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
