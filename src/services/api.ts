import {
  Competitor,
  IntelligenceEvent,
  HindsightMemory,
  StrategicPattern,
  StrategicInsight,
  ExecutiveReport,
  MemoryRetrievalResult,
  PipelineExecutionResult,
  HindsightSettings,
  EventCategory,
  ImpactLevel,
} from '../types';

export const api = {
  async getHealth() {
    const res = await fetch('/api/health');
    return res.json();
  },

  async getCompetitors(): Promise<Competitor[]> {
    const res = await fetch('/api/competitors');
    if (!res.ok) throw new Error('Failed to fetch competitors');
    return res.json();
  },

  async addCompetitor(data: Partial<Competitor>): Promise<Competitor> {
    const res = await fetch('/api/competitors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create competitor');
    return res.json();
  },

  async updateCompetitor(id: string, data: Partial<Competitor>): Promise<Competitor> {
    const res = await fetch(`/api/competitors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update competitor');
    return res.json();
  },

  async deleteCompetitor(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/competitors/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete competitor');
    return res.json();
  },

  async getEvents(): Promise<IntelligenceEvent[]> {
    const res = await fetch('/api/events');
    if (!res.ok) throw new Error('Failed to fetch events');
    return res.json();
  },

  async ingestEvent(data: {
    competitorId: string;
    date: string;
    title: string;
    description: string;
    category: EventCategory;
    impact: ImpactLevel;
    source: string;
    productArea?: string;
    tags?: string[];
  }): Promise<PipelineExecutionResult> {
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to ingest event');
    return res.json();
  },

  async getMemories(): Promise<HindsightMemory[]> {
    const res = await fetch('/api/memories');
    if (!res.ok) throw new Error('Failed to fetch memories');
    return res.json();
  },

  async retrieveMemories(query: {
    text?: string;
    competitorId?: string;
    category?: EventCategory;
    tags?: string[];
    currentDate?: string;
    topK?: number;
  }): Promise<MemoryRetrievalResult[]> {
    const res = await fetch('/api/memories/retrieve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    });
    if (!res.ok) throw new Error('Failed to query memories');
    return res.json();
  },

  async addManualMemory(data: Partial<HindsightMemory>): Promise<HindsightMemory> {
    const res = await fetch('/api/memories/manual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add memory');
    return res.json();
  },

  async getPatterns(): Promise<StrategicPattern[]> {
    const res = await fetch('/api/patterns');
    if (!res.ok) throw new Error('Failed to fetch patterns');
    return res.json();
  },

  async getInsights(): Promise<StrategicInsight[]> {
    const res = await fetch('/api/insights');
    if (!res.ok) throw new Error('Failed to fetch insights');
    return res.json();
  },

  async getReports(): Promise<ExecutiveReport[]> {
    const res = await fetch('/api/reports');
    if (!res.ok) throw new Error('Failed to fetch reports');
    return res.json();
  },

  async generateReport(data: { title?: string; competitorIds?: string[] }): Promise<ExecutiveReport> {
    const res = await fetch('/api/reports/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to generate report');
    return res.json();
  },

  async getSettings(): Promise<{ settings: HindsightSettings; stats: any }> {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async updateSettings(settings: Partial<HindsightSettings>): Promise<HindsightSettings> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },

  async runAnalysis() {
    const res = await fetch('/api/analysis/run', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to run analysis');
    return res.json();
  },

  async resetSeedData() {
    const res = await fetch('/api/reset', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset seed data');
    return res.json();
  },
};
