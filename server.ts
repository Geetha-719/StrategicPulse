import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { hindsightEngine } from './server/hindsightStore.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json({ limit: '10mb' }));

  // =================== REST API ENDPOINTS ===================

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      app: 'StrategicPulse',
      persistentMemoryLayer: 'Hindsight Engine v2.4',
      geminiActive: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString(),
    });
  });

  // Competitors
  app.get('/api/competitors', (req, res) => {
    try {
      const comps = hindsightEngine.getCompetitors();
      res.json(comps);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/competitors', (req, res) => {
    try {
      const newComp = hindsightEngine.addCompetitor(req.body);
      res.status(201).json(newComp);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.put('/api/competitors/:id', (req, res) => {
    try {
      const updated = hindsightEngine.updateCompetitor(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: 'Competitor not found' });
      res.json(updated);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.delete('/api/competitors/:id', (req, res) => {
    try {
      const deleted = hindsightEngine.deleteCompetitor(req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Competitor not found' });
      res.json({ success: true, message: 'Competitor deleted' });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Events
  app.get('/api/events', (req, res) => {
    try {
      const events = hindsightEngine.getEvents();
      res.json(events);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Ingest Event -> Runs the 5-step Hindsight Pipeline
  // CURRENT EVENT → HINDSIGHT MEMORY RETRIEVAL → HISTORICAL CONNECTION → PATTERN DETECTION → STRATEGIC INSIGHT
  app.post('/api/events', async (req, res) => {
    try {
      const result = await hindsightEngine.ingestEvent(req.body);
      res.status(201).json(result);
    } catch (e: any) {
      console.error('Error during event ingestion:', e);
      res.status(500).json({ error: e.message });
    }
  });

  // Hindsight Memories
  app.get('/api/memories', (req, res) => {
    try {
      const memories = hindsightEngine.getMemories();
      res.json(memories);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Retrieve memories from Hindsight given a query or event context
  app.post('/api/memories/retrieve', (req, res) => {
    try {
      const { text, competitorId, category, tags, currentDate, topK } = req.body;
      const results = hindsightEngine.retrieveMemories(
        { text, competitorId, category, tags, currentDate },
        topK || 5
      );
      res.json(results);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Manual Memory Entry
  app.post('/api/memories/manual', (req, res) => {
    try {
      const store = hindsightEngine.getStore();
      const newMemory = {
        id: `mem-manual-${Date.now().toString().slice(-6)}`,
        competitorId: req.body.competitorId,
        competitorName: req.body.competitorName,
        eventDate: req.body.eventDate || new Date().toISOString().split('T')[0],
        eventType: req.body.eventType || 'Product & Feature',
        title: req.body.title,
        naturalLanguageContent: req.body.naturalLanguageContent,
        source: req.body.source || 'Manual Intelligence Submission',
        impactLevel: req.body.impactLevel || 'Medium',
        productArea: req.body.productArea || 'General',
        tags: req.body.tags || ['manual-entry'],
        historicalContext: req.body.historicalContext || 'Manually entered persistent memory.',
        relatedMemoryIds: req.body.relatedMemoryIds || [],
        confidenceScore: 0.9,
        createdAt: new Date().toISOString(),
      };
      store.memories.unshift(newMemory);
      res.status(201).json(newMemory);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Strategic Patterns
  app.get('/api/patterns', (req, res) => {
    try {
      const patterns = hindsightEngine.getPatterns();
      res.json(patterns);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Strategic Insights
  app.get('/api/insights', (req, res) => {
    try {
      const insights = hindsightEngine.getInsights();
      res.json(insights);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Reports
  app.get('/api/reports', (req, res) => {
    try {
      const reports = hindsightEngine.getReports();
      res.json(reports);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/reports/generate', (req, res) => {
    try {
      const store = hindsightEngine.getStore();
      const { title, competitorIds } = req.body;
      const targetComps = store.competitors.filter((c) =>
        competitorIds && competitorIds.length > 0 ? competitorIds.includes(c.id) : true
      );
      const compNames = targetComps.map((c) => c.name);

      const newReport = {
        id: `rep-${Date.now().toString().slice(-6)}`,
        title: title || `Strategic Intelligence Assessment: ${compNames.join(' & ')}`,
        date: new Date().toISOString().split('T')[0],
        author: 'StrategicPulse Agent',
        competitorsCovered: compNames,
        summary: `Comprehensive evaluation of ${targetComps.length} competitors through Hindsight persistent memory layer, identifying recurring strategic maneuvers and threat mitigation playbooks.`,
        keyFindings: [
          `Identified clear strategic convergence toward high-margin enterprise accounts.`,
          `Observed proactive counter-positioning around API usage limits and dedicated private deployments.`,
          `Discovered vulnerabilities in legacy support retention across transitioning accounts.`
        ],
        patternSynthesis: `Correlated historical intelligence spanning over 8 months reveals predictable cycles between initial price discounting and subsequent upmarket pricing barriers.`,
        recommendedPlaybooks: [
          'Playbook: Mid-Market Disruption & Logo Reclamation',
          'Playbook: Enterprise Deal Shield & Multi-Year Loyalty Incentives'
        ],
        memoriesReferencedCount: store.memories.length,
      };

      store.reports.unshift(newReport);
      res.status(201).json(newReport);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Settings
  app.get('/api/settings', (req, res) => {
    try {
      const store = hindsightEngine.getStore();
      res.json({
        settings: store.settings,
        stats: {
          ...store.stats,
          competitorsCount: store.competitors.length,
          eventsCount: store.events.length,
          memoriesCount: store.memories.length,
          patternsCount: store.patterns.length,
          insightsCount: store.insights.length,
          geminiApiKeyConfigured: !!process.env.GEMINI_API_KEY,
        }
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put('/api/settings', (req, res) => {
    try {
      const updated = hindsightEngine.updateSettings(req.body);
      res.json(updated);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // Run full strategic analysis
  app.post('/api/analysis/run', async (req, res) => {
    try {
      const summary = await hindsightEngine.runFullAnalysis();
      res.json(summary);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Reset to seed data
  app.post('/api/reset', (req, res) => {
    try {
      const freshStore = hindsightEngine.resetSeedData();
      res.json({ success: true, message: 'Reset to default seed memories', store: freshStore });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // =================== CLIENT APPLICATION SERVING ===================

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StrategicPulse CI Server listening on port ${PORT} with Hindsight Persistent Memory`);
  });
}

startServer();
