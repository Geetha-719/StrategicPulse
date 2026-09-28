import React, { useState, useEffect } from 'react';
import { X, Building2, Globe, Shield, Activity, Tag } from 'lucide-react';
import { Competitor } from '../types';
import { api } from '../services/api';

interface CompetitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  competitorToEdit?: Competitor | null;
  onSaved: () => void;
}

export const CompetitorModal: React.FC<CompetitorModalProps> = ({
  isOpen,
  onClose,
  competitorToEdit,
  onSaved,
}) => {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [marketSegment, setMarketSegment] = useState<Competitor['marketSegment']>('Enterprise');
  const [activityLevel, setActivityLevel] = useState<Competitor['activityLevel']>('Aggressive');
  const [threatScore, setThreatScore] = useState(75);
  const [color, setColor] = useState('#3B82F6');
  const [tagsInput, setTagsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (competitorToEdit) {
      setName(competitorToEdit.name);
      setIndustry(competitorToEdit.industry);
      setWebsite(competitorToEdit.website);
      setDescription(competitorToEdit.description);
      setMarketSegment(competitorToEdit.marketSegment);
      setActivityLevel(competitorToEdit.activityLevel);
      setThreatScore(competitorToEdit.threatScore);
      setColor(competitorToEdit.color);
      setTagsInput(competitorToEdit.tags.join(', '));
    } else {
      setName('');
      setIndustry('');
      setWebsite('');
      setDescription('');
      setMarketSegment('Enterprise');
      setActivityLevel('Moderate');
      setThreatScore(70);
      setColor('#3B82F6');
      setTagsInput('Cloud, AI, Enterprise');
    }
  }, [competitorToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setIsSubmitting(true);
    try {
      const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
      const data = {
        name,
        industry,
        website,
        description,
        marketSegment,
        activityLevel,
        threatScore: Number(threatScore),
        color,
        tags,
        lastActivityDate: competitorToEdit ? competitorToEdit.lastActivityDate : new Date().toISOString().split('T')[0],
      };

      if (competitorToEdit) {
        await api.updateCompetitor(competitorToEdit.id, data);
      } else {
        await api.addCompetitor(data);
      }

      onSaved();
      onClose();
    } catch (err: any) {
      alert(`Error saving competitor: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {competitorToEdit ? `Edit Competitor: ${competitorToEdit.name}` : 'Track New Competitor'}
              </h3>
              <p className="text-xs text-slate-400">
                Configure profile and initialize Hindsight memory tracking
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Competitor Name</label>
              <input
                type="text"
                required
                placeholder="e.g. ApexAI"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Industry / Domain</label>
              <input
                type="text"
                required
                placeholder="e.g. LLM Serving & Gateway"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Website URL</label>
              <input
                type="text"
                placeholder="https://example.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Market Segment</label>
              <select
                value={marketSegment}
                onChange={(e) => setMarketSegment(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Enterprise">Enterprise</option>
                <option value="Mid-Market">Mid-Market</option>
                <option value="SMB">SMB</option>
                <option value="Developer-First">Developer-First</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Strategic Overview</label>
            <textarea
              rows={2}
              required
              placeholder="Primary products, market posture, typical deal sizes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Activity Level</label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Aggressive">Aggressive</option>
                <option value="Moderate">Moderate</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Threat Score (1-100)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={threatScore}
                onChange={(e) => setThreatScore(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Theme Color</label>
              <div className="flex items-center space-x-2 mt-1">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 rounded border border-slate-700 cursor-pointer bg-slate-950 p-0.5"
                />
                <span className="text-xs font-mono text-slate-300">{color}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. AI, Observability, Private Cloud"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
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
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : competitorToEdit ? 'Save Changes' : 'Create Competitor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
