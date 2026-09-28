import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  BrainCircuit,
  Database,
  Cpu,
  RotateCcw,
  CheckCircle2,
  Save,
  Sliders,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { HindsightSettings } from '../types';
import { api } from '../services/api';

interface SettingsPageProps {
  onSettingsUpdated: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onSettingsUpdated }) => {
  const [settings, setSettings] = useState<HindsightSettings>({
    similarityThreshold: 55,
    temporalDecayFactor: 0.85,
    maxRetrievedMemories: 4,
    autoCommitPatterns: true,
    enableLiveGemini: true,
    activeModel: 'gemini-3.8-flash',
  });
  const [stats, setStats] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await api.getSettings();
      setSettings(data.settings);
      setStats(data.stats);
    } catch (e: any) {
      console.error('Failed to load settings:', e);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updateSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      onSettingsUpdated();
    } catch (err: any) {
      alert(`Failed to save settings: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetSeeds = async () => {
    if (confirm('Are you sure you want to reset Hindsight to the default 9-month seed intelligence data?')) {
      setIsResetting(true);
      try {
        await api.resetSeedData();
        await fetchSettings();
        onSettingsUpdated();
        alert('Hindsight memory store has been reset to default realistic seed intelligence.');
      } catch (err: any) {
        alert(`Reset error: ${err.message}`);
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <SettingsIcon className="w-6 h-6 text-indigo-400" />
          <h1 className="text-2xl font-bold text-white tracking-tight">System & Memory Settings</h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Tune Hindsight persistent memory retrieval parameters and verify persistence diagnostics
        </p>
      </div>

      {/* Diagnostics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Persistence Layer</span>
          <div className="text-base font-bold text-white flex items-center space-x-1.5">
            <Database className="w-4 h-4 text-cyan-400" />
            <span>Hindsight v2.4</span>
          </div>
          <span className="text-[11px] text-emerald-400 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Disk-backed JSON Store</span>
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Active AI Engine</span>
          <div className="text-base font-bold text-white flex items-center space-x-1.5">
            <Cpu className="w-4 h-4 text-yellow-400" />
            <span>{settings.activeModel}</span>
          </div>
          <span className="text-[11px] text-slate-400">
            {stats?.geminiApiKeyConfigured ? (
              <span className="text-emerald-400">Gemini API Connected</span>
            ) : (
              <span className="text-cyan-400">Deterministic Expert Engine</span>
            )}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Memory Ledger Size</span>
          <div className="text-base font-bold text-white font-mono">
            {stats?.memoriesCount || 0} Nodes
          </div>
          <span className="text-[11px] text-slate-400">
            {stats?.eventsCount || 0} events • {stats?.patternsCount || 0} patterns
          </span>
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <span>Hindsight Memory Retrieval Hyperparameters</span>
          </h2>
          {saveSuccess && (
            <span className="text-xs text-emerald-400 flex items-center space-x-1 font-semibold animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              <span>Settings saved!</span>
            </span>
          )}
        </div>

        <div className="space-y-4">
          {/* Similarity Threshold */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
              <label>Relevance Retrieval Cutoff Threshold ({settings.similarityThreshold}%)</label>
              <span className="font-mono text-cyan-400">{settings.similarityThreshold}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="90"
              step="5"
              value={settings.similarityThreshold}
              onChange={(e) =>
                setSettings({ ...settings, similarityThreshold: Number(e.target.value) })
              }
              className="w-full accent-indigo-500 bg-slate-950 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Minimum composite similarity score required for historical memories to be retrieved during event analysis.
            </p>
          </div>

          {/* Temporal Decay Factor */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
              <label>Temporal Decay Factor (Weighting: {settings.temporalDecayFactor})</label>
              <span className="font-mono text-cyan-400">{settings.temporalDecayFactor}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.0"
              step="0.05"
              value={settings.temporalDecayFactor}
              onChange={(e) =>
                setSettings({ ...settings, temporalDecayFactor: Number(e.target.value) })
              }
              className="w-full accent-indigo-500 bg-slate-950 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Determines how much older memories are discounted. 1.0 = zero decay (equal weight forever); 0.7 = strong recency bias.
            </p>
          </div>

          {/* Max Retrieved Memories (Top-K) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Max Historical Memories Per Analysis (Top-K: {settings.maxRetrievedMemories})
            </label>
            <select
              value={settings.maxRetrievedMemories}
              onChange={(e) =>
                setSettings({ ...settings, maxRetrievedMemories: Number(e.target.value) })
              }
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="2">2 Memories (Focused)</option>
              <option value="4">4 Memories (Balanced - Recommended)</option>
              <option value="6">6 Memories (Deep Context)</option>
              <option value="8">8 Memories (Comprehensive)</option>
            </select>
          </div>

          {/* Toggle Switches */}
          <div className="pt-2 space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoCommitPatterns}
                onChange={(e) =>
                  setSettings({ ...settings, autoCommitPatterns: e.target.checked })
                }
                className="w-4 h-4 rounded text-indigo-600 accent-indigo-500 bg-slate-950 border-slate-700"
              />
              <span className="text-xs text-slate-300">
                Auto-commit verified patterns back into Hindsight as Meta-Memory nodes
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableLiveGemini}
                onChange={(e) =>
                  setSettings({ ...settings, enableLiveGemini: e.target.checked })
                }
                className="w-4 h-4 rounded text-indigo-600 accent-indigo-500 bg-slate-950 border-slate-700"
              />
              <span className="text-xs text-slate-300">
                Enable live Google Gemini 3.8 Flash synthesis when GEMINI_API_KEY is available
              </span>
            </label>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center space-x-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-md transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>

      {/* Reset Seed Data Danger Zone */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-rose-900/40 space-y-4">
        <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
          <AlertTriangle className="w-5 h-5" />
          <span>Demo Data Management</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Need to restore the initial rich demo state? Resetting will reload the verified 9-month historical records for <strong>TechNova</strong>, <strong>CloudSphere</strong>, and <strong>DataForge</strong> with all corresponding Hindsight persistent memories and strategic patterns.
        </p>
        <button
          onClick={handleResetSeeds}
          disabled={isResetting}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-200 border border-rose-800 text-xs font-semibold transition disabled:opacity-50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isResetting ? 'Resetting Store...' : 'Reset to Default 9-Month Seed Data'}</span>
        </button>
      </div>
    </div>
  );
};
