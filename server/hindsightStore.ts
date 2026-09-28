import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  Competitor,
  IntelligenceEvent,
  HindsightMemory,
  StrategicPattern,
  StrategicInsight,
  ExecutiveReport,
  HindsightSettings,
  MemoryRetrievalResult,
  PipelineExecutionResult,
  EventCategory,
  ImpactLevel,
} from '../src/types/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'hindsight_store.json');

interface DatabaseStore {
  competitors: Competitor[];
  events: IntelligenceEvent[];
  memories: HindsightMemory[];
  patterns: StrategicPattern[];
  insights: StrategicInsight[];
  reports: ExecutiveReport[];
  settings: HindsightSettings;
  stats: {
    totalQueriesExecuted: number;
    lastReindexTimestamp: string;
    memoryGraphEdgesCount: number;
  };
}

const DEFAULT_SETTINGS: HindsightSettings = {
  similarityThreshold: 55,
  temporalDecayFactor: 0.85,
  maxRetrievedMemories: 4,
  autoCommitPatterns: true,
  enableLiveGemini: true,
  activeModel: 'gemini-3.8-flash',
};

const SEED_COMPETITORS: Competitor[] = [
  {
    id: 'comp-technova',
    name: 'TechNova',
    industry: 'Cloud Infrastructure & AI Developer Platform',
    website: 'https://technova.internal.cloud',
    description: 'Fast-growing cloud platform targeting mid-market and enterprise engineering teams. Known for rapid product velocity and aggressive pricing tactics.',
    marketSegment: 'Enterprise',
    activityLevel: 'Aggressive',
    lastActivityDate: '2026-09-14',
    threatScore: 88,
    color: '#3B82F6', // Blue
    tags: ['Cloud IDE', 'AI Orchestration', 'Mid-Market Disruption', 'Enterprise Pivot']
  },
  {
    id: 'comp-cloudsphere',
    name: 'CloudSphere',
    industry: 'Legacy Enterprise Virtualization & Managed Services',
    website: 'https://cloudsphere-ops.net',
    description: 'Incumbent infrastructure powerhouse struggling with legacy technical debt. Defending enterprise margins while attempting inorganic modernization via M&A.',
    marketSegment: 'Enterprise',
    activityLevel: 'Moderate',
    lastActivityDate: '2026-08-19',
    threatScore: 68,
    color: '#8B5CF6', // Purple
    tags: ['Legacy Virtualization', 'Private Cloud', 'M&A Driven', 'Margin Defense']
  },
  {
    id: 'comp-dataforge',
    name: 'DataForge',
    industry: 'AI Data Infrastructure & Vector ETL Pipelines',
    website: 'https://dataforge-engine.io',
    description: 'Developer-favorite open-core data company that transitioned to proprietary cloud services and hyperscaler partnerships to capture enterprise lock-in.',
    marketSegment: 'Developer-First',
    activityLevel: 'Aggressive',
    lastActivityDate: '2026-08-30',
    threatScore: 82,
    color: '#10B981', // Emerald
    tags: ['Vector DB', 'Open-Core', 'Hyperscaler Co-Sell', 'High Velocity']
  }
];

const SEED_MEMORIES: HindsightMemory[] = [
  // TechNova Series (Jan -> Sep 2026)
  {
    id: 'mem-tn-01',
    competitorId: 'comp-technova',
    competitorName: 'TechNova',
    eventDate: '2026-01-10',
    eventType: 'Pricing & Packaging',
    title: '15% Subscription Price Cut Across Starter & Pro Tiers',
    naturalLanguageContent: 'On January 10, 2026, TechNova reduced subscription pricing by 15% across all mid-market tiers. This aggressive discount aimed to undercut incumbent rivals and initiate a high-volume land-grab across developer teams.',
    source: 'Competitor Pricing Portal Diff',
    impactLevel: 'High',
    productArea: 'Self-Serve Cloud Tiers',
    tags: ['pricing-war', 'customer-acquisition', 'mid-market', 'plg'],
    historicalContext: 'TechNova closed its Series C round two months earlier with explicit mandates to double mid-market logo count.',
    relatedMemoryIds: ['mem-tn-02', 'mem-tn-03'],
    detectedPatternId: 'pat-tn-upmarket',
    confidenceScore: 0.95,
    createdAt: '2026-01-10T14:30:00Z'
  },
  {
    id: 'mem-tn-02',
    competitorId: 'comp-technova',
    competitorName: 'TechNova',
    eventDate: '2026-02-18',
    eventType: 'Security & Compliance',
    title: 'Achieved SOC 2 Type II Certification & FedRAMP In-Process Status',
    naturalLanguageContent: 'On February 18, 2026, TechNova announced complete SOC 2 Type II compliance and confirmed FedRAMP High Moderate in-process authorization. This signaled their initial preparation for rigorous Fortune 500 procurement.',
    source: 'Trust & Security Center Announcement',
    impactLevel: 'Medium',
    productArea: 'Enterprise Governance',
    tags: ['compliance', 'soc2', 'fedramp', 'enterprise-readiness'],
    historicalContext: 'Followed January pricing aggression; enterprise buyers required compliance gates before pilots.',
    relatedMemoryIds: ['mem-tn-01', 'mem-tn-03', 'mem-tn-04'],
    detectedPatternId: 'pat-tn-upmarket',
    confidenceScore: 0.92,
    createdAt: '2026-02-18T11:15:00Z'
  },
  {
    id: 'mem-tn-03',
    competitorId: 'comp-technova',
    competitorName: 'TechNova',
    eventDate: '2026-03-12',
    eventType: 'Talent & Leadership',
    title: 'Aggressive Hiring of 20 Enterprise Sales Executives from Snowflake & Datadog',
    naturalLanguageContent: 'On March 12, 2026, TechNova hired 20 seasoned enterprise account executives and sales engineers directly from incumbent cloud giants Snowflake and Datadog, establishing dedicated regional enterprise pods.',
    source: 'LinkedIn Talent Ingestion & Press Release',
    impactLevel: 'High',
    productArea: 'Go-To-Market & Field Sales',
    tags: ['sales-ramp', 'enterprise-sales', 'talent-poaching', 'gtm'],
    historicalContext: 'Building upon SOC 2 compliance, TechNova assembled senior sales firepower to convert mid-market logos into 6-figure enterprise annual commitments.',
    relatedMemoryIds: ['mem-tn-01', 'mem-tn-02', 'mem-tn-04'],
    detectedPatternId: 'pat-tn-upmarket',
    confidenceScore: 0.96,
    createdAt: '2026-03-12T16:00:00Z'
  },
  {
    id: 'mem-tn-04',
    competitorId: 'comp-technova',
    competitorName: 'TechNova',
    eventDate: '2026-05-04',
    eventType: 'Product & Feature',
    title: 'Dedicated VPC Isolation & 99.99% Financial SLA Tier Launched',
    naturalLanguageContent: 'On May 04, 2026, TechNova rolled out Virtual Private Cloud (VPC) dedicated deployment clusters with customized single-tenant isolation and contract-backed 99.99% uptime guarantees for contracts above $150k ARR.',
    source: 'Product Release Notes v4.2',
    impactLevel: 'High',
    productArea: 'Enterprise Infrastructure',
    tags: ['vpc', 'single-tenant', 'enterprise-sla', 'high-arr'],
    historicalContext: 'Addresses technical blockers identified by the new enterprise sales reps hired in March.',
    relatedMemoryIds: ['mem-tn-02', 'mem-tn-03', 'mem-tn-05'],
    detectedPatternId: 'pat-tn-upmarket',
    confidenceScore: 0.94,
    createdAt: '2026-05-04T09:45:00Z'
  },
  {
    id: 'mem-tn-05',
    competitorId: 'comp-technova',
    competitorName: 'TechNova',
    eventDate: '2026-07-22',
    eventType: 'Pricing & Packaging',
    title: 'Deprecation of Free Tier & Introduction of Hard Credit Thresholds',
    naturalLanguageContent: 'On July 22, 2026, TechNova quietly deprecated their free developer tier, replacing it with a 14-day trial requiring credit card pre-authorization and enforcing strict compute quota gates.',
    source: 'Developer Community Forum & Terms of Service Update',
    impactLevel: 'Critical',
    productArea: 'Self-Serve Monitization',
    tags: ['tier-deprecation', 'paywall', 'margin-optimization', 'plg-exit'],
    historicalContext: 'Six months after the January 15% discount land-grab, TechNova shifted from volume user acquisition to squeezing margins and focusing resources strictly on paying enterprise prospects.',
    relatedMemoryIds: ['mem-tn-01', 'mem-tn-03', 'mem-tn-04'],
    detectedPatternId: 'pat-tn-upmarket',
    confidenceScore: 0.98,
    createdAt: '2026-07-22T13:20:00Z'
  },
  {
    id: 'mem-tn-06',
    competitorId: 'comp-technova',
    competitorName: 'TechNova',
    eventDate: '2026-09-14',
    eventType: 'Enterprise Expansion',
    title: 'Unveiled "NovaEnterprise Suite" with Global Multi-Region Residency',
    naturalLanguageContent: 'On September 14, 2026, TechNova formally unveiled NovaEnterprise Suite, complete with European Data Sovereignty guarantees, air-gapped GovCloud support, and mandatory minimum commits of $200k/year.',
    source: 'TechNova Keynote 2026',
    impactLevel: 'Critical',
    productArea: 'Enterprise Suite',
    tags: ['enterprise-suite', 'data-residency', 'govcloud', 'strategic-culmination'],
    historicalContext: 'Culmination of the 9-month sequence beginning with January price cuts, February SOC2 compliance, March sales hires, and May enterprise VPC architecture.',
    relatedMemoryIds: ['mem-tn-01', 'mem-tn-02', 'mem-tn-03', 'mem-tn-04', 'mem-tn-05'],
    detectedPatternId: 'pat-tn-upmarket',
    confidenceScore: 0.99,
    createdAt: '2026-09-14T17:00:00Z'
  },

  // CloudSphere Series (Jan -> Aug 2026)
  {
    id: 'mem-cs-01',
    competitorId: 'comp-cloudsphere',
    competitorName: 'CloudSphere',
    eventDate: '2026-01-24',
    eventType: 'Pricing & Packaging',
    title: 'Raised On-Premise Legacy Support Contracts by 22%',
    naturalLanguageContent: 'On January 24, 2026, CloudSphere sent price increase notifications imposing a 22% rate hike across legacy on-prem hypervisor support contracts, citing rising maintenance overhead.',
    source: 'Enterprise Customer Contract Leak & Reddit Sysadmin',
    impactLevel: 'High',
    productArea: 'Legacy Virtualization Support',
    tags: ['legacy-lock-in', 'price-hike', 'margin-extraction', 'churn-risk'],
    historicalContext: 'CloudSphere faces declining growth in on-prem and is harvesting existing customer contracts for cash flow.',
    relatedMemoryIds: ['mem-cs-02', 'mem-cs-03'],
    detectedPatternId: 'pat-cs-defensive',
    confidenceScore: 0.91,
    createdAt: '2026-01-24T10:00:00Z'
  },
  {
    id: 'mem-cs-02',
    competitorId: 'comp-cloudsphere',
    competitorName: 'CloudSphere',
    eventDate: '2026-04-15',
    eventType: 'Talent & Leadership',
    title: 'Engineering Hiring Freeze Across Core Hypervisor Units',
    naturalLanguageContent: 'On April 15, 2026, internal memos revealed CloudSphere instituted a total hiring freeze across their traditional virtualization and kernel engineering departments, reallocating budgets to corporate M&A.',
    source: 'Internal Leak / The Register',
    impactLevel: 'Medium',
    productArea: 'Core R&D',
    tags: ['hiring-freeze', 'cost-cutting', 'reallocation', 'rd-slowdown'],
    historicalContext: 'Reinforces the hypothesis that CloudSphere has ceased organic innovation on core infrastructure.',
    relatedMemoryIds: ['mem-cs-01', 'mem-cs-03'],
    detectedPatternId: 'pat-cs-defensive',
    confidenceScore: 0.88,
    createdAt: '2026-04-15T15:30:00Z'
  },
  {
    id: 'mem-cs-03',
    competitorId: 'comp-cloudsphere',
    competitorName: 'CloudSphere',
    eventDate: '2026-06-02',
    eventType: 'M&A & Partnership',
    title: 'Acquired Serverless Startup MicroKube for $45M in Cash',
    naturalLanguageContent: 'On June 02, 2026, CloudSphere announced the cash acquisition of MicroKube, a boutique lightweight container runtime startup, to bolt serverless features onto their dated enterprise product catalog.',
    source: 'Securities Filing (Form 8-K)',
    impactLevel: 'High',
    productArea: 'Serverless & Containers',
    tags: ['ma', 'inorganic-growth', 'serverless', 'containerization'],
    historicalContext: 'Following the April engineering freeze, CloudSphere opted to buy modern container tech rather than build it in-house.',
    relatedMemoryIds: ['mem-cs-01', 'mem-cs-02', 'mem-cs-04'],
    detectedPatternId: 'pat-cs-defensive',
    confidenceScore: 0.92,
    createdAt: '2026-06-02T12:00:00Z'
  },
  {
    id: 'mem-cs-04',
    competitorId: 'comp-cloudsphere',
    competitorName: 'CloudSphere',
    eventDate: '2026-08-19',
    eventType: 'Marketing & Rebranding',
    title: 'Brand Pivot to "Autonomous Hybrid Fabric" with Heavy Marketing Spend',
    naturalLanguageContent: 'On August 19, 2026, CloudSphere launched a multimillion-dollar marketing blitz rebranding their suite as "Autonomous Hybrid Fabric", wrapping the newly acquired MicroKube technology into their legacy stack.',
    source: 'Wall Street Journal Ad & Corporate Press Release',
    impactLevel: 'Medium',
    productArea: 'Corporate Positioning',
    tags: ['rebranding', 'marketing-pivot', 'hybrid-cloud', 'repackaging'],
    historicalContext: 'Attempting to stem enterprise customer defection after the January 22% price hike by presenting a modernized exterior.',
    relatedMemoryIds: ['mem-cs-01', 'mem-cs-03'],
    detectedPatternId: 'pat-cs-defensive',
    confidenceScore: 0.89,
    createdAt: '2026-08-19T08:30:00Z'
  },

  // DataForge Series (Feb -> Aug 2026)
  {
    id: 'mem-df-01',
    competitorId: 'comp-dataforge',
    competitorName: 'DataForge',
    eventDate: '2026-02-02',
    eventType: 'Open Source & Developer',
    title: 'Open-Sourced Core Vector Indexing Engine "ForgeCore" (Apache 2.0)',
    naturalLanguageContent: 'On February 02, 2026, DataForge open-sourced ForgeCore on GitHub under the permissive Apache 2.0 license, quickly amassing 12,000 GitHub stars and capturing grass-roots AI developer mindshare.',
    source: 'GitHub Trending & Hacker News #1',
    impactLevel: 'High',
    productArea: 'Open-Source AI Engine',
    tags: ['open-source', 'apache-2', 'developer-adoption', 'mindshare'],
    historicalContext: 'Established DataForge as the default standard for real-time embedding indexing among ML engineers.',
    relatedMemoryIds: ['mem-df-02', 'mem-df-03'],
    detectedPatternId: 'pat-df-lockin',
    confidenceScore: 0.94,
    createdAt: '2026-02-02T18:00:00Z'
  },
  {
    id: 'mem-df-02',
    competitorId: 'comp-dataforge',
    competitorName: 'DataForge',
    eventDate: '2026-04-20',
    eventType: 'Product & Feature',
    title: 'Launched Fully Managed "ForgeCloud" with Proprietary Auto-Partitioning',
    naturalLanguageContent: 'On April 20, 2026, DataForge launched ForgeCloud. While ForgeCore remained open source, critical enterprise capabilities like auto-partitioning, cross-region replication, and RBAC were kept proprietary in the managed cloud.',
    source: 'Product Hunt Launch & TechCrunch Feature',
    impactLevel: 'High',
    productArea: 'Managed Cloud SaaS',
    tags: ['open-core', 'proprietary-features', 'cloud-monetization', 'saas'],
    historicalContext: 'Capitalizing on the massive developer install base created by the February open-source release.',
    relatedMemoryIds: ['mem-df-01', 'mem-df-03', 'mem-df-04'],
    detectedPatternId: 'pat-df-lockin',
    confidenceScore: 0.95,
    createdAt: '2026-04-20T13:45:00Z'
  },
  {
    id: 'mem-df-03',
    competitorId: 'comp-dataforge',
    competitorName: 'DataForge',
    eventDate: '2026-06-11',
    eventType: 'M&A & Partnership',
    title: 'Signed Exclusive Strategic Co-Sell Agreement with AWS Marketplace',
    naturalLanguageContent: 'On June 11, 2026, DataForge finalized a tier-1 co-sell agreement with AWS, allowing enterprise customers to consume DataForge Cloud against their AWS EDP (Enterprise Discount Program) commitments with zero friction.',
    source: 'AWS Partner Network Press Wire',
    impactLevel: 'High',
    productArea: 'Hyperscaler Distribution',
    tags: ['hyperscaler-cosell', 'aws-edp', 'channel-acceleration', 'enterprise-procurement'],
    historicalContext: 'Removes procurement barriers for Fortune 1000 accounts who had already adopted ForgeCore informally.',
    relatedMemoryIds: ['mem-df-01', 'mem-df-02', 'mem-df-04'],
    detectedPatternId: 'pat-df-lockin',
    confidenceScore: 0.93,
    createdAt: '2026-06-11T10:15:00Z'
  },
  {
    id: 'mem-df-04',
    competitorId: 'comp-dataforge',
    competitorName: 'DataForge',
    eventDate: '2026-08-30',
    eventType: 'Product & Feature',
    title: 'Filed 4 Patents for Hardware-Accelerated Vector Cache Ingestion',
    naturalLanguageContent: 'On August 30, 2026, DataForge submitted four utility patents covering hardware-accelerated vector cache ingestion and streaming ANN indexing, fortifying a deep intellectual property moat around their managed tier.',
    source: 'USPTO Gazette Ingestion',
    impactLevel: 'Medium',
    productArea: 'Patents & Deep Tech IP',
    tags: ['patents', 'ip-moat', 'hardware-acceleration', 'defensibility'],
    historicalContext: 'Protects ForgeCloud from cloud providers or copycat open-source distributions offering managed ForgeCore.',
    relatedMemoryIds: ['mem-df-02', 'mem-df-03'],
    detectedPatternId: 'pat-df-lockin',
    confidenceScore: 0.91,
    createdAt: '2026-08-30T14:10:00Z'
  }
];

const SEED_EVENTS: IntelligenceEvent[] = SEED_MEMORIES.map((m) => ({
  id: `evt-${m.id.replace('mem-', '')}`,
  competitorId: m.competitorId,
  competitorName: m.competitorName,
  date: m.eventDate,
  title: m.title,
  description: m.naturalLanguageContent,
  category: m.eventType,
  impact: m.impactLevel,
  source: m.source,
  sourceUrl: '#',
  hindsightMemoryId: m.id,
  detectedPatternId: m.detectedPatternId,
  tags: m.tags,
}));

const SEED_PATTERNS: StrategicPattern[] = [
  {
    id: 'pat-tn-upmarket',
    competitorId: 'comp-technova',
    competitorName: 'TechNova',
    patternName: 'Mid-Market Land Grab & Enterprise Upmarket Pivot',
    confidence: 96,
    category: 'GTM & Upmarket Transformation',
    firstObservedDate: '2026-01-10',
    lastUpdatedDate: '2026-09-14',
    summary: 'A classic 9-month coordinated playbook: initially undercutting mid-market pricing by 15% to build user volume, rapidly qualifying for enterprise compliance (SOC 2), assembling an aggressive 20-person enterprise sales team, and then eliminating free tiers while launching an expensive dedicated enterprise suite.',
    strategicThesis: 'TechNova is systematically abandoning low-margin developer tiers to challenge incumbent enterprise cloud providers for $200k+ ACV contracts.',
    supportingMemoryIds: ['mem-tn-01', 'mem-tn-02', 'mem-tn-03', 'mem-tn-04', 'mem-tn-05', 'mem-tn-06'],
    threatLevel: 'Severe',
    recommendedCounterMoves: [
      'Offer targeted migration credits for disillusioned mid-market and indie developers churned by TechNova free tier deprecation.',
      'Highlight our unified SLA guarantees against TechNova recent unbundled pricing add-ons.',
      'Equip enterprise sales reps with competitive bake-off sheets demonstrating our superior single-tenant architecture maturity.'
    ]
  },
  {
    id: 'pat-cs-defensive',
    competitorId: 'comp-cloudsphere',
    competitorName: 'CloudSphere',
    patternName: 'Defensive Margin Extraction & Inorganic Cloud Modernization',
    confidence: 89,
    category: 'Legacy Milking & M&A Consolidation',
    firstObservedDate: '2026-01-24',
    lastUpdatedDate: '2026-08-19',
    summary: 'CloudSphere has frozen organic engineering across legacy hypervisor units and raised maintenance fees by 22% on locked-in customers. It is using extracted cash flow to acquire modular startups (MicroKube for $45M) and executing high-budget rebranding campaigns to disguise legacy technical debt.',
    strategicThesis: 'CloudSphere is vulnerable to customer defection among legacy on-prem accounts who resent double-digit maintenance price hikes.',
    supportingMemoryIds: ['mem-cs-01', 'mem-cs-02', 'mem-cs-03', 'mem-cs-04'],
    threatLevel: 'Elevated',
    recommendedCounterMoves: [
      'Launch an aggressive "Legacy CloudSphere Freedom" buyout campaign offering 6 months free for customers facing the 22% maintenance hike.',
      'Expose architectural fragility in MicroKube bolt-on integration versus our natively built cloud architecture.'
    ]
  },
  {
    id: 'pat-df-lockin',
    competitorId: 'comp-dataforge',
    competitorName: 'DataForge',
    patternName: 'Open-Core Commoditization to Hyperscaler Lock-In',
    confidence: 93,
    category: 'Ecosystem Capture & Hyperscaler Alignment',
    firstObservedDate: '2026-02-02',
    lastUpdatedDate: '2026-08-30',
    summary: 'DataForge used a widely celebrated Apache 2.0 open-source release to capture developer mindshare, quickly gated critical enterprise scaling features into a proprietary managed cloud, and secured preferred co-sell alignment on AWS EDP budgets.',
    strategicThesis: 'DataForge is successfully bypassing standard procurement by having developers embed ForgeCore into production apps before forcing an upgrade to ForgeCloud via hyperscaler committed spend.',
    supportingMemoryIds: ['mem-df-01', 'mem-df-02', 'mem-df-03', 'mem-df-04'],
    threatLevel: 'Elevated',
    recommendedCounterMoves: [
      'Provide 100% API-compatible connectors for ForgeCore that route directly to our superior managed infrastructure without vendor lock-in.',
      'Strengthen our own Azure and Google Cloud marketplace listings to counter their AWS-only EDP dominance.'
    ]
  }
];

const SEED_INSIGHTS: StrategicInsight[] = [
  {
    id: 'ins-tn-01',
    timestamp: '2026-09-15T09:30:00Z',
    targetEventId: 'evt-tn-06',
    competitorId: 'comp-technova',
    competitorName: 'TechNova',
    title: 'TechNova Completes Full Upmarket Transition with NovaEnterprise Suite',
    thesis: 'TechNova has officially executed its strategic pivot from a developer-first tool to a high-touch enterprise software platform. Their recent product launch is not an isolated event; Hindsight historical memories reveal a calculated 4-phase transformation over the last 9 months.',
    patternName: 'Mid-Market Land Grab & Enterprise Upmarket Pivot',
    historicalConnectionSummary: 'Hindsight connected this launch to the Jan 2026 price discount (land-grab), March hiring of 20 Snowflake sales executives (GTM capacity), and July elimination of free tiers (margin pruning).',
    retrievedMemoryIds: ['mem-tn-01', 'mem-tn-03', 'mem-tn-04', 'mem-tn-05', 'mem-tn-06'],
    confidence: 97,
    timeframe: 'Jan 2026 - Sep 2026 (9 Months of Persistent Evidence)',
    implications: {
      marketShareRisk: 'High risk of TechNova encroaching on our $100k-$500k ARR enterprise opportunities in Q4.',
      productImpact: 'Validation that enterprise buyers are demanding strict data residency and single-tenant VPCs.',
      pricingPressure: 'Less price pressure on mid-market as TechNova abandons the sub-$500/mo market segment.'
    },
    recommendedActions: {
      immediate: [
        'Deploy competitive displacement battlecards targeting TechNova mid-market accounts feeling abandoned by recent tier changes.',
        'Run targeted LinkedIn ads aimed at engineering leaders evaluating NovaEnterprise with comparison matrices.'
      ],
      quarterly: [
        'Accelerate our FedRAMP High certification schedule to maintain moat in federal/defense accounts.',
        'Package our multi-cloud failover feature into our standard enterprise tier to counter their single-cloud VPC stance.'
      ]
    }
  }
];

const SEED_REPORTS: ExecutiveReport[] = [
  {
    id: 'rep-q3-2026',
    title: 'Q3 2026 Strategic Intelligence Briefing: The Upmarket Migration Wave',
    date: '2026-09-20',
    author: 'StrategicPulse Agent & CI Director',
    competitorsCovered: ['TechNova', 'CloudSphere', 'DataForge'],
    summary: 'Persistent memory analysis of 14 key competitor moves reveals a widespread macro trend: former mid-market and developer-first competitors are aggressively seeking enterprise shelter to protect gross margins, while legacy providers milk on-prem contracts.',
    keyFindings: [
      'TechNova has fully executed an enterprise pivot, leaving a 20,000-developer mid-market vacuum ripe for acquisition.',
      'CloudSphere 22% legacy price increase has spiked customer churn intent by 3.8x based on sentiment crawls.',
      'DataForge AWS co-sell partnership represents a potent channel threat that requires multi-hyperscaler retaliation.'
    ],
    patternSynthesis: 'Across all three tracked competitors, Hindsight has correlated 14 distinct events over 9 months into 3 primary strategic pattern clusters with an average confidence rating of 92.6%.',
    recommendedPlaybooks: [
      'Playbook Alpha: Mid-Market Developer Reclamation Campaign',
      'Playbook Beta: Legacy Migration Guarantee for Disgruntled CloudSphere Accounts',
      'Playbook Gamma: Co-Sell Channel Acceleration on GCP and Azure'
    ],
    memoriesReferencedCount: 14
  }
];

class HindsightMemoryEngine {
  private store: DatabaseStore;

  constructor() {
    this.store = this.loadStore();
  }

  private loadStore(): DatabaseStore {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return parsed;
      }
    } catch (e) {
      console.warn('Error reading hindsight store file, initializing with seeds:', e);
    }

    const initialStore: DatabaseStore = {
      competitors: SEED_COMPETITORS,
      events: SEED_EVENTS,
      memories: SEED_MEMORIES,
      patterns: SEED_PATTERNS,
      insights: SEED_INSIGHTS,
      reports: SEED_REPORTS,
      settings: DEFAULT_SETTINGS,
      stats: {
        totalQueriesExecuted: 42,
        lastReindexTimestamp: new Date().toISOString(),
        memoryGraphEdgesCount: 28,
      },
    };

    this.persist(initialStore);
    return initialStore;
  }

  private persist(data?: DatabaseStore): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const dataToSave = data || this.store;
      fs.writeFileSync(DATA_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to persist hindsight store:', e);
    }
  }

  public getStore(): DatabaseStore {
    return this.store;
  }

  public resetSeedData(): DatabaseStore {
    this.store = {
      competitors: SEED_COMPETITORS,
      events: SEED_EVENTS,
      memories: SEED_MEMORIES,
      patterns: SEED_PATTERNS,
      insights: SEED_INSIGHTS,
      reports: SEED_REPORTS,
      settings: DEFAULT_SETTINGS,
      stats: {
        totalQueriesExecuted: 42,
        lastReindexTimestamp: new Date().toISOString(),
        memoryGraphEdgesCount: 28,
      },
    };
    this.persist();
    return this.store;
  }

  // Competitor operations
  public getCompetitors(): Competitor[] {
    return this.store.competitors;
  }

  public addCompetitor(comp: Omit<Competitor, 'id'>): Competitor {
    const id = `comp-${comp.name.toLowerCase().replace(/[^a-z0-9]/g, '')}-${Date.now().toString().slice(-4)}`;
    const newComp: Competitor = { ...comp, id };
    this.store.competitors.push(newComp);
    this.persist();
    return newComp;
  }

  public updateCompetitor(id: string, updates: Partial<Competitor>): Competitor | null {
    const index = this.store.competitors.findIndex((c) => c.id === id);
    if (index === -1) return null;
    this.store.competitors[index] = { ...this.store.competitors[index], ...updates };
    this.persist();
    return this.store.competitors[index];
  }

  public deleteCompetitor(id: string): boolean {
    const initialLen = this.store.competitors.length;
    this.store.competitors = this.store.competitors.filter((c) => c.id !== id);
    if (this.store.competitors.length !== initialLen) {
      // Clean up associated events and memories
      this.store.events = this.store.events.filter((e) => e.competitorId !== id);
      this.store.memories = this.store.memories.filter((m) => m.competitorId !== id);
      this.store.patterns = this.store.patterns.filter((p) => p.competitorId !== id);
      this.persist();
      return true;
    }
    return false;
  }

  // Event & Memory Operations
  public getEvents(): IntelligenceEvent[] {
    return this.store.events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public getMemories(): HindsightMemory[] {
    return this.store.memories.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
  }

  public getPatterns(): StrategicPattern[] {
    return this.store.patterns;
  }

  public getInsights(): StrategicInsight[] {
    return this.store.insights.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public getReports(): ExecutiveReport[] {
    return this.store.reports;
  }

  public updateSettings(settings: Partial<HindsightSettings>): HindsightSettings {
    this.store.settings = { ...this.store.settings, ...settings };
    this.persist();
    return this.store.settings;
  }

  /**
   * Core Hindsight Memory Retrieval Algorithm:
   * Computes multi-dimensional relevance across:
   * 1. Competitor affinity (same competitor = high prior)
   * 2. Semantic token & tag overlap across title, naturalLanguageContent, and productArea
   * 3. Category relationship (e.g. Pricing + Talent + Governance indicate Upmarket GTM)
   * 4. Temporal correlation (events in temporal proximity or strategic progression)
   * 5. Explicit memory graph edges (relatedMemoryIds)
   */
  public retrieveMemories(
    queryOrEvent: {
      text?: string;
      competitorId?: string;
      category?: EventCategory;
      tags?: string[];
      currentDate?: string;
    },
    topK = 4
  ): MemoryRetrievalResult[] {
    this.store.stats.totalQueriesExecuted += 1;
    const queryText = (queryOrEvent.text || '').toLowerCase();
    const queryTokens = queryText
      .split(/\W+/)
      .filter((t) => t.length > 2);
    const targetCompId = queryOrEvent.competitorId;
    const targetCategory = queryOrEvent.category;
    const targetTags = (queryOrEvent.tags || []).map((t) => t.toLowerCase());
    const referenceDate = queryOrEvent.currentDate ? new Date(queryOrEvent.currentDate).getTime() : Date.now();

    const scoredResults: MemoryRetrievalResult[] = this.store.memories.map((mem) => {
      let score = 0;
      const reasons: string[] = [];
      const sharedDims: string[] = [];

      // 1. Competitor Match
      if (targetCompId && mem.competitorId === targetCompId) {
        score += 35;
        reasons.push(`Direct historical action by ${mem.competitorName}`);
        sharedDims.push('Competitor Entity');
      }

      // 2. Category Affinity
      if (targetCategory && mem.eventType === targetCategory) {
        score += 20;
        reasons.push(`Identical strategic lever (${mem.eventType})`);
        sharedDims.push('Event Category');
      } else if (
        (targetCategory === 'Pricing & Packaging' && mem.eventType === 'Enterprise Expansion') ||
        (targetCategory === 'Enterprise Expansion' && mem.eventType === 'Security & Compliance') ||
        (targetCategory === 'Talent & Leadership' && mem.eventType === 'Enterprise Expansion') ||
        (targetCategory === 'Open Source & Developer' && mem.eventType === 'Product & Feature')
      ) {
        score += 15;
        reasons.push(`Correlated upmarket progression indicator (${mem.eventType} ↔ ${targetCategory})`);
        sharedDims.push('Strategic Correlation');
      }

      // 3. Tag overlap
      const memTags = mem.tags.map((t) => t.toLowerCase());
      const commonTags = targetTags.filter((t) => memTags.includes(t));
      if (commonTags.length > 0) {
        const tagBonus = Math.min(25, commonTags.length * 10);
        score += tagBonus;
        reasons.push(`Shares contextual tags: [${commonTags.join(', ')}]`);
        sharedDims.push('Strategic Tags');
      }

      // 4. Token semantic matching
      const contentTokens = `${mem.title} ${mem.naturalLanguageContent} ${mem.productArea}`.toLowerCase();
      let matchedTokens = 0;
      for (const token of queryTokens) {
        if (contentTokens.includes(token)) {
          matchedTokens++;
        }
      }
      if (queryTokens.length > 0 && matchedTokens > 0) {
        const tokenRatio = matchedTokens / Math.min(queryTokens.length, 6);
        const textBonus = Math.round(tokenRatio * 25);
        score += textBonus;
        if (textBonus > 8) {
          reasons.push(`Semantic content similarity across historical narrative`);
          sharedDims.push('Semantic Similarity');
        }
      }

      // 5. Impact bonus
      if (mem.impactLevel === 'Critical') score += 10;
      else if (mem.impactLevel === 'High') score += 5;

      // 6. Temporal Delta
      const memDate = new Date(mem.eventDate).getTime();
      const deltaDays = Math.max(1, Math.round(Math.abs(referenceDate - memDate) / (1000 * 60 * 60 * 24)));

      // Temporal decay modifier from settings
      const decay = Math.pow(this.store.settings.temporalDecayFactor, deltaDays / 180);
      const normalizedScore = Math.min(99, Math.max(15, Math.round(score * (0.8 + 0.2 * decay))));

      const primaryReason = reasons.length > 0
        ? reasons.join(' • ')
        : `Historical baseline from ${mem.eventDate} in ${mem.productArea}`;

      return {
        memory: mem,
        relevanceScore: normalizedScore,
        retrievalReason: primaryReason,
        temporalDeltaDays: deltaDays,
        sharedDimensions: sharedDims.length > 0 ? sharedDims : ['Historical Precedent'],
      };
    });

    // Sort by relevance score descending
    scoredResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Filter by threshold
    const filtered = scoredResults.filter(
      (r) => r.relevanceScore >= (this.store.settings.similarityThreshold - 15)
    );

    return filtered.slice(0, topK || this.store.settings.maxRetrievedMemories);
  }

  /**
   * Ingest a new event into the system, automatically generating its Hindsight memory,
   * triggering retrieval of historical memories, detecting patterns, and synthesizing insights.
   */
  public async ingestEvent(eventInput: {
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
    const startTime = Date.now();
    const competitor = this.store.competitors.find((c) => c.id === eventInput.competitorId);
    const competitorName = competitor ? competitor.name : 'Unknown Competitor';

    const memoryId = `mem-${Date.now().toString().slice(-6)}`;
    const eventId = `evt-${Date.now().toString().slice(-6)}`;

    // Build natural language memory content
    const tags = eventInput.tags && eventInput.tags.length > 0 ? eventInput.tags : ['competitor-move', 'market-shift'];
    const productArea = eventInput.productArea || 'Core Platform';
    const nlContent = `On ${eventInput.date}, ${competitorName} executed a ${eventInput.category} move: "${eventInput.title}". Detail: ${eventInput.description}`;

    // 1. Retrieve historical memories related to this new event BEFORE storing
    const retrievedMemories = this.retrieveMemories(
      {
        text: `${eventInput.title} ${eventInput.description} ${productArea}`,
        competitorId: eventInput.competitorId,
        category: eventInput.category,
        tags,
        currentDate: eventInput.date,
      },
      4
    );

    // 2. Synthesize historical connection
    const earliestDate = retrievedMemories.length > 0
      ? retrievedMemories.reduce((min, r) => (new Date(r.memory.eventDate) < new Date(min) ? r.memory.eventDate : min), eventInput.date)
      : eventInput.date;
    const spanMonths = Math.max(1, Math.round((new Date(eventInput.date).getTime() - new Date(earliestDate).getTime()) / (1000 * 60 * 60 * 24 * 30)));

    // 3. Detect or match strategic pattern
    let detectedPatternName = 'Emerging Strategic Shift';
    let detectedPatternId: string | undefined;
    let patternConfidence = 85;

    // Check if competitor already has an ongoing pattern
    const existingPattern = this.store.patterns.find((p) => p.competitorId === eventInput.competitorId);
    if (existingPattern) {
      detectedPatternName = existingPattern.patternName;
      detectedPatternId = existingPattern.id;
      patternConfidence = Math.min(99, existingPattern.confidence + 2);
    } else {
      // Derive pattern name from category
      if (eventInput.category === 'Pricing & Packaging') detectedPatternName = 'Aggressive Price War & Margin Undercutting';
      else if (eventInput.category === 'Enterprise Expansion') detectedPatternName = 'Dedicated Enterprise Upmarket Escalation';
      else if (eventInput.category === 'M&A & Partnership') detectedPatternName = 'Inorganic Capability Acquisition & Ecosystem Moat';
      else detectedPatternName = `${competitorName} Strategic Realignment`;
    }

    // 4. Create the new Hindsight memory
    const newMemory: HindsightMemory = {
      id: memoryId,
      competitorId: eventInput.competitorId,
      competitorName,
      eventDate: eventInput.date,
      eventType: eventInput.category,
      title: eventInput.title,
      naturalLanguageContent: nlContent,
      source: eventInput.source,
      impactLevel: eventInput.impact,
      productArea,
      tags,
      historicalContext: retrievedMemories.length > 0
        ? `Builds upon ${retrievedMemories.length} historical Hindsight memories dating back to ${earliestDate}.`
        : 'Initial baseline event recorded in Hindsight.',
      relatedMemoryIds: retrievedMemories.map((r) => r.memory.id),
      detectedPatternId,
      confidenceScore: 0.92,
      createdAt: new Date().toISOString(),
    };

    // 5. Create the Intelligence Event
    const newEvent: IntelligenceEvent = {
      id: eventId,
      competitorId: eventInput.competitorId,
      competitorName,
      date: eventInput.date,
      title: eventInput.title,
      description: eventInput.description,
      category: eventInput.category,
      impact: eventInput.impact,
      source: eventInput.source,
      hindsightMemoryId: memoryId,
      detectedPatternId,
      tags,
    };

    // Store them in memory
    this.store.memories.unshift(newMemory);
    this.store.events.unshift(newEvent);

    // Update competitor lastActivityDate
    if (competitor) {
      competitor.lastActivityDate = eventInput.date;
    }

    // 6. Generate Strategic Insight via Gemini or Expert CI Engine
    const strategicInsight = await this.synthesizeStrategicInsight(
      newEvent,
      retrievedMemories,
      detectedPatternName,
      spanMonths
    );

    // Save insight to store
    this.store.insights.unshift(strategicInsight);

    // Auto-update or commit pattern if enabled
    if (this.store.settings.autoCommitPatterns) {
      if (existingPattern) {
        if (!existingPattern.supportingMemoryIds.includes(memoryId)) {
          existingPattern.supportingMemoryIds.push(memoryId);
        }
        existingPattern.lastUpdatedDate = eventInput.date;
        existingPattern.confidence = patternConfidence;
      } else {
        const newPattern: StrategicPattern = {
          id: `pat-${Date.now().toString().slice(-6)}`,
          competitorId: eventInput.competitorId,
          competitorName,
          patternName: detectedPatternName,
          confidence: patternConfidence,
          category: 'Market Transformation',
          firstObservedDate: earliestDate,
          lastUpdatedDate: eventInput.date,
          summary: `Continuous tracking across ${retrievedMemories.length + 1} historical memories confirms ${detectedPatternName}.`,
          strategicThesis: strategicInsight.thesis,
          supportingMemoryIds: [memoryId, ...retrievedMemories.map((r) => r.memory.id)],
          threatLevel: eventInput.impact === 'Critical' ? 'Severe' : 'Elevated',
          recommendedCounterMoves: strategicInsight.recommendedActions.immediate,
        };
        this.store.patterns.push(newPattern);
      }
    }

    this.persist();

    const duration = Date.now() - startTime;

    return {
      currentEvent: {
        title: eventInput.title,
        competitorName,
        date: eventInput.date,
        category: eventInput.category,
        description: eventInput.description,
        impact: eventInput.impact,
      },
      retrievedMemories,
      historicalConnection: {
        narrative: `Hindsight retrieved ${retrievedMemories.length} historical memories spanning ${spanMonths} months (${earliestDate} to ${eventInput.date}), demonstrating that this event is part of an ongoing strategic cadence rather than an isolated action.`,
        spanMonths,
        timelineBreadth: `${earliestDate} → ${eventInput.date}`,
      },
      patternDetection: {
        patternName: detectedPatternName,
        patternId: detectedPatternId,
        confidence: patternConfidence,
        patternSummary: `Identified high-correlation multi-event vector with ${patternConfidence}% certainty. Historical evidence points to ${detectedPatternName}.`,
      },
      strategicInsight,
      executionDurationMs: duration,
      aiModelUsed: process.env.GEMINI_API_KEY ? 'gemini-3.8-flash' : 'Deterministic CI Synthesis Engine',
    };
  }

  /**
   * Synthesize strategic insight using Gemini API or Deterministic Engine fallback
   */
  private async synthesizeStrategicInsight(
    event: IntelligenceEvent,
    retrieved: MemoryRetrievalResult[],
    patternName: string,
    spanMonths: number
  ): Promise<StrategicInsight> {
    const id = `ins-${Date.now().toString().slice(-6)}`;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && this.store.settings.enableLiveGemini) {
      try {
        const ai = new GoogleGenAI();
        const memoryContextPrompt = retrieved
          .map(
            (r, i) =>
              `Historical Memory #${i + 1} (Date: ${r.memory.eventDate}, Type: ${r.memory.eventType}, Relevance: ${r.relevanceScore}%): "${r.memory.naturalLanguageContent}" [Source: ${r.memory.source}]`
          )
          .join('\n');

        const prompt = `You are a Principal Director of Competitive Intelligence for an enterprise B2B SaaS platform.
Analyze the following newly ingested competitor event in the context of persistent historical memories retrieved from Hindsight.

CURRENT EVENT:
Competitor: ${event.competitorName}
Date: ${event.date}
Category: ${event.category}
Title: ${event.title}
Description: ${event.description}
Impact Level: ${event.impact}

HINDSIGHT PERSISTENT MEMORIES RETRIEVED (${retrieved.length} events spanning ${spanMonths} months):
${memoryContextPrompt || 'No prior historical memories stored.'}

DETECTED PATTERN: ${patternName}

Generate an evidence-backed strategic synthesis in valid JSON format matching this schema:
{
  "title": "Short executive headline",
  "thesis": "2-3 sentence strategic thesis connecting the current event with the historical memories",
  "historicalConnectionSummary": "Explanation of how Hindsight memory retrieval connected past months of actions to this event",
  "marketShareRisk": "Assessment of market share risk",
  "productImpact": "Technical or product vector impact",
  "pricingPressure": "Assessment of pricing/margin implications",
  "immediateActions": ["Action 1", "Action 2"],
  "quarterlyActions": ["Strategic counter-measure 1", "Strategic counter-measure 2"]
}
Only output the raw JSON object. Do not include markdown codeblocks.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        const rawText = response.text || '';
        const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        return {
          id,
          timestamp: new Date().toISOString(),
          targetEventId: event.id,
          competitorId: event.competitorId,
          competitorName: event.competitorName,
          title: parsed.title || `${event.competitorName}: ${patternName} Deepens`,
          thesis: parsed.thesis || `${event.competitorName} continues to advance along the ${patternName} vector with this latest action.`,
          patternName,
          historicalConnectionSummary: parsed.historicalConnectionSummary || `Connected with ${retrieved.length} historical memories spanning ${spanMonths} months.`,
          retrievedMemoryIds: retrieved.map((r) => r.memory.id),
          confidence: Math.min(98, 88 + retrieved.length * 2),
          timeframe: `${spanMonths} Month Historical Window`,
          implications: {
            marketShareRisk: parsed.marketShareRisk || 'Heightened risk of displacement in target segments.',
            productImpact: parsed.productImpact || 'Direct pressure on roadmap delivery schedules.',
            pricingPressure: parsed.pricingPressure || 'Shifting margin dynamics across standard contracts.',
          },
          recommendedActions: {
            immediate: parsed.immediateActions || [
              'Issue field battlecards highlighting architectural distinctions.',
              'Conduct account review across shared mid-market and enterprise prospects.'
            ],
            quarterly: parsed.quarterlyActions || [
              'Align Q4 product roadmap to neutralize newly launched capabilities.',
              'Formulate enterprise migration program with pricing protections.'
            ],
          },
        };
      } catch (e) {
        console.warn('Gemini API call failed or timed out, using deterministic CI reasoning engine:', e);
      }
    }

    // Deterministic High-Fidelity Strategic Intelligence Engine
    const memoryCount = retrieved.length;
    const thesis = memoryCount > 0
      ? `By retrieving ${memoryCount} historical memories from Hindsight spanning ${spanMonths} months, StrategicPulse confirms that ${event.competitorName}'s move ("${event.title}") is the direct operational continuation of their ${patternName} strategy.`
      : `Initial baseline action recorded for ${event.competitorName}. While standalone today, Hindsight has committed this memory to persistent storage for cross-temporal pattern detection.`;

    const connSummary = memoryCount > 0
      ? `Hindsight cross-referenced this action against historical precedents, specifically linking to ${retrieved[0]?.memory.title} (${retrieved[0]?.memory.eventDate}) and identifying shared strategic intent.`
      : 'First recorded node in Hindsight memory graph for this vector.';

    return {
      id,
      timestamp: new Date().toISOString(),
      targetEventId: event.id,
      competitorId: event.competitorId,
      competitorName: event.competitorName,
      title: `${event.competitorName}: ${patternName} Confirmed by Persistent Evidence`,
      thesis,
      patternName,
      historicalConnectionSummary: connSummary,
      retrievedMemoryIds: retrieved.map((r) => r.memory.id),
      confidence: Math.min(97, 86 + memoryCount * 3),
      timeframe: memoryCount > 0 ? `${spanMonths} Months of Correlated Evidence` : 'Current Event Ingestion',
      implications: {
        marketShareRisk: `High displacement velocity if ${event.competitorName} successfully converts current trial volume into enterprise accounts.`,
        productImpact: `Validates urgent requirement for native compliance certification and dedicated enterprise deployment models.`,
        pricingPressure: `Expect competitive pricing compression as sales reps leverage recent bundling options during renewals.`,
      },
      recommendedActions: {
        immediate: [
          `Deploy updated competitive comparison matrix for sales reps handling ${event.competitorName} bake-offs.`,
          `Engage top 10 accounts up for renewal in Q4 with dedicated loyalty SLA guarantees.`
        ],
        quarterly: [
          `Accelerate enterprise governance features in next sprint cycle to neutralize competitor's latest announcements.`,
          `Establish dedicated co-sell relationships with regional systems integrators to protect pipeline.`
        ],
      },
    };
  }

  // Run full cross-competitor analysis
  public async runFullAnalysis(): Promise<{
    patternsDetected: number;
    insightsGenerated: number;
    latestInsight: StrategicInsight;
    highRiskCompetitors: string[];
    summary: string;
  }> {
    const competitors = this.store.competitors;
    const insights = this.store.insights;

    const highRisk = competitors.filter((c) => c.threatScore >= 80).map((c) => c.name);

    return {
      patternsDetected: this.store.patterns.length,
      insightsGenerated: insights.length,
      latestInsight: insights[0] || ({} as StrategicInsight),
      highRiskCompetitors: highRisk,
      summary: `Hindsight Memory Engine verified ${this.store.memories.length} historical memories across ${competitors.length} competitors. Detected ${this.store.patterns.length} persistent strategic vectors.`,
    };
  }
}

export const hindsightEngine = new HindsightMemoryEngine();
