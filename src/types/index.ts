export type ImpactLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type NavTab = 
  | 'dashboard'
  | 'competitors'
  | 'timeline'
  | 'memory'
  | 'analysis'
  | 'reports'
  | 'settings';

export type EventCategory = 
  | 'Pricing & Packaging'
  | 'Talent & Leadership'
  | 'Product & Feature'
  | 'Enterprise Expansion'
  | 'M&A & Partnership'
  | 'Security & Compliance'
  | 'Open Source & Developer'
  | 'Marketing & Rebranding';

export interface Competitor {
  id: string;
  name: string;
  industry: string;
  website: string;
  description: string;
  marketSegment: 'Enterprise' | 'Mid-Market' | 'SMB' | 'Developer-First' | 'Hybrid';
  activityLevel: 'Aggressive' | 'Moderate' | 'Low';
  lastActivityDate: string;
  threatScore: number; // 1-100
  color: string;
  tags: string[];
}

export interface IntelligenceEvent {
  id: string;
  competitorId: string;
  competitorName: string;
  date: string;
  title: string;
  description: string;
  category: EventCategory;
  impact: ImpactLevel;
  source: string;
  sourceUrl?: string;
  hindsightMemoryId: string;
  detectedPatternId?: string;
  tags: string[];
}

export interface HindsightMemory {
  id: string;
  competitorId: string;
  competitorName: string;
  eventDate: string;
  eventType: EventCategory;
  title: string;
  naturalLanguageContent: string;
  source: string;
  impactLevel: ImpactLevel;
  productArea: string;
  tags: string[];
  historicalContext: string;
  relatedMemoryIds: string[];
  detectedPatternId?: string;
  confidenceScore: number; // 0 - 1
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface StrategicPattern {
  id: string;
  competitorId: string;
  competitorName: string;
  patternName: string;
  confidence: number; // 0-100
  category: string;
  firstObservedDate: string;
  lastUpdatedDate: string;
  summary: string;
  strategicThesis: string;
  supportingMemoryIds: string[];
  threatLevel: 'Severe' | 'Elevated' | 'Guarded' | 'Informational';
  recommendedCounterMoves: string[];
}

export interface StrategicInsight {
  id: string;
  timestamp: string;
  targetEventId?: string;
  competitorId: string;
  competitorName: string;
  title: string;
  thesis: string;
  patternName: string;
  historicalConnectionSummary: string;
  retrievedMemoryIds: string[];
  confidence: number;
  timeframe: string;
  implications: {
    marketShareRisk: string;
    productImpact: string;
    pricingPressure: string;
  };
  recommendedActions: {
    immediate: string[];
    quarterly: string[];
  };
}

export interface MemoryRetrievalResult {
  memory: HindsightMemory;
  relevanceScore: number; // 0 - 100
  retrievalReason: string;
  temporalDeltaDays: number;
  sharedDimensions: string[];
}

export interface PipelineExecutionResult {
  currentEvent: {
    title: string;
    competitorName: string;
    date: string;
    category: EventCategory;
    description: string;
    impact: ImpactLevel;
  };
  retrievedMemories: MemoryRetrievalResult[];
  historicalConnection: {
    narrative: string;
    spanMonths: number;
    timelineBreadth: string;
  };
  patternDetection: {
    patternName: string;
    patternId?: string;
    confidence: number;
    patternSummary: string;
  };
  strategicInsight: StrategicInsight;
  executionDurationMs: number;
  aiModelUsed: string;
}

export interface ExecutiveReport {
  id: string;
  title: string;
  date: string;
  author: string;
  competitorsCovered: string[];
  summary: string;
  keyFindings: string[];
  patternSynthesis: string;
  recommendedPlaybooks: string[];
  memoriesReferencedCount: number;
}

export interface HindsightSettings {
  similarityThreshold: number; // e.g. 60
  temporalDecayFactor: number; // 0.1 - 1.0
  maxRetrievedMemories: number; // e.g. 5
  autoCommitPatterns: boolean;
  enableLiveGemini: boolean;
  activeModel: string;
}
