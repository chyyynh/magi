# DAO Data Collection System - 實作計劃

## 系統架構概述

```
┌─────────────────────────────────────────────────────────────┐
│                     Cloudflare Workers                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Scheduled Workers (Cron Jobs)              │  │
│  │  • Governance Data Collector (every 1 hour)          │  │
│  │  • Treasury Data Collector (every 6 hours)           │  │
│  │  • Protocol Data Collector (every 1 hour)            │  │
│  │  • Alert Generator (every 1 hour)                    │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              RESTful API Endpoints                    │  │
│  │  • GET /api/daos                                      │  │
│  │  • GET /api/daos/:id                                  │  │
│  │  • GET /api/daos/:id/metrics                          │  │
│  │  • GET /api/proposals/:id                             │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ↕                                  │
│  ┌─────────────┐    ┌──────────────┐                       │
│  │ Cloudflare  │    │ Cloudflare   │                       │
│  │ D1 Database │    │ KV (Cache)   │                       │
│  └─────────────┘    └──────────────┘                       │
└─────────────────────────────────────────────────────────────┘
         ↕                                    ↕
┌─────────────────────┐         ┌──────────────────────────┐
│  External APIs      │         │   Frontend (Next.js)     │
│  • Snapshot         │         │   DAO Dashboard          │
│  • Tally            │         └──────────────────────────┘
│  • Etherscan        │
│  • DeFi Llama       │
│  • Safe API         │
└─────────────────────┘
```

---

## 1. 資料庫設計 (Cloudflare D1)

### 1.1 Core Tables

#### `daos` 表
```sql
CREATE TABLE daos (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  chain TEXT NOT NULL,  -- ethereum, arbitrum, optimism
  stage INTEGER DEFAULT 0,  -- 0: centralized, 1: functional, 2: full
  governance_address TEXT,
  treasury_address TEXT,
  snapshot_space TEXT,
  tally_org_id TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX idx_daos_slug ON daos(slug);
CREATE INDEX idx_daos_chain ON daos(chain);
```

#### `proposals` 表
```sql
CREATE TABLE proposals (
  id TEXT PRIMARY KEY,
  dao_id TEXT NOT NULL,
  external_id TEXT NOT NULL,  -- snapshot/tally proposal id
  title TEXT NOT NULL,
  description TEXT,
  proposer TEXT NOT NULL,
  status TEXT NOT NULL,  -- pending, active, succeeded, failed, executed
  choices TEXT,  -- JSON array
  start_time INTEGER,
  end_time INTEGER,
  execution_time INTEGER,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (dao_id) REFERENCES daos(id)
);

CREATE INDEX idx_proposals_dao_id ON proposals(dao_id);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_created_at ON proposals(created_at);
```

#### `votes` 表
```sql
CREATE TABLE votes (
  id TEXT PRIMARY KEY,
  proposal_id TEXT NOT NULL,
  voter_address TEXT NOT NULL,
  voting_power REAL NOT NULL,
  choice INTEGER NOT NULL,
  reason TEXT,
  timestamp INTEGER NOT NULL,
  FOREIGN KEY (proposal_id) REFERENCES proposals(id)
);

CREATE INDEX idx_votes_proposal_id ON votes(proposal_id);
CREATE INDEX idx_votes_voter ON votes(voter_address);
CREATE INDEX idx_votes_timestamp ON votes(timestamp);
```

### 1.2 Metrics Tables

#### `governance_metrics` 表
```sql
CREATE TABLE governance_metrics (
  id TEXT PRIMARY KEY,
  dao_id TEXT NOT NULL,
  voting_rate REAL NOT NULL,
  nakamoto_coefficient INTEGER NOT NULL,
  gini_coefficient REAL NOT NULL,
  whale_concentration REAL NOT NULL,
  total_voters INTEGER NOT NULL,
  total_voting_power REAL NOT NULL,
  timestamp INTEGER NOT NULL,
  FOREIGN KEY (dao_id) REFERENCES daos(id)
);

CREATE INDEX idx_gov_metrics_dao_timestamp ON governance_metrics(dao_id, timestamp);
```

#### `treasury_metrics` 表
```sql
CREATE TABLE treasury_metrics (
  id TEXT PRIMARY KEY,
  dao_id TEXT NOT NULL,
  total_value_usd REAL NOT NULL,
  burn_rate_monthly REAL NOT NULL,
  runway_months INTEGER NOT NULL,
  diversification_score REAL NOT NULL,
  asset_breakdown TEXT,  -- JSON: [{token, amount, value_usd}]
  timestamp INTEGER NOT NULL,
  FOREIGN KEY (dao_id) REFERENCES daos(id)
);

CREATE INDEX idx_treasury_metrics_dao_timestamp ON treasury_metrics(dao_id, timestamp);
```

#### `decentralization_metrics` 表
```sql
CREATE TABLE decentralization_metrics (
  id TEXT PRIMARY KEY,
  dao_id TEXT NOT NULL,
  proposer_concentration REAL NOT NULL,
  automation_level REAL NOT NULL,
  multisig_config TEXT,  -- e.g., "6-of-9"
  multisig_signers TEXT,  -- JSON array
  timestamp INTEGER NOT NULL,
  FOREIGN KEY (dao_id) REFERENCES daos(id)
);

CREATE INDEX idx_decentral_metrics_dao_timestamp ON decentralization_metrics(dao_id, timestamp);
```

#### `community_metrics` 表
```sql
CREATE TABLE community_metrics (
  id TEXT PRIMARY KEY,
  dao_id TEXT NOT NULL,
  daily_active_users INTEGER NOT NULL,
  weekly_active_users INTEGER NOT NULL,
  retention_rate REAL NOT NULL,
  engagement_score REAL NOT NULL,
  timestamp INTEGER NOT NULL,
  FOREIGN KEY (dao_id) REFERENCES daos(id)
);

CREATE INDEX idx_community_metrics_dao_timestamp ON community_metrics(dao_id, timestamp);
```

#### `efficiency_metrics` 表
```sql
CREATE TABLE efficiency_metrics (
  id TEXT PRIMARY KEY,
  dao_id TEXT NOT NULL,
  avg_execution_time_days REAL NOT NULL,
  proposal_throughput_monthly INTEGER NOT NULL,
  success_rate REAL NOT NULL,
  timestamp INTEGER NOT NULL,
  FOREIGN KEY (dao_id) REFERENCES daos(id)
);

CREATE INDEX idx_efficiency_metrics_dao_timestamp ON efficiency_metrics(dao_id, timestamp);
```

#### `protocol_metrics` 表
```sql
CREATE TABLE protocol_metrics (
  id TEXT PRIMARY KEY,
  dao_id TEXT NOT NULL,
  tvl_usd REAL NOT NULL,
  revenue_usd REAL NOT NULL,
  users_count INTEGER NOT NULL,
  security_score REAL NOT NULL,
  timestamp INTEGER NOT NULL,
  FOREIGN KEY (dao_id) REFERENCES daos(id)
);

CREATE INDEX idx_protocol_metrics_dao_timestamp ON protocol_metrics(dao_id, timestamp);
```

#### `alerts` 表
```sql
CREATE TABLE alerts (
  id TEXT PRIMARY KEY,
  dao_id TEXT NOT NULL,
  type TEXT NOT NULL,  -- warning, info, critical
  message TEXT NOT NULL,
  dimension TEXT NOT NULL,  -- governance, treasury, etc.
  metric_value REAL,
  threshold_value REAL,
  is_active INTEGER DEFAULT 1,
  created_at INTEGER NOT NULL,
  resolved_at INTEGER,
  FOREIGN KEY (dao_id) REFERENCES daos(id)
);

CREATE INDEX idx_alerts_dao_active ON alerts(dao_id, is_active);
CREATE INDEX idx_alerts_created_at ON alerts(created_at);
```

---

## 2. Cloudflare Workers 實作

### 2.1 專案結構

```
workers/
├── src/
│   ├── index.ts              # Main API router
│   ├── scheduled.ts          # Cron job handler
│   ├── collectors/
│   │   ├── governance.ts     # Governance data collector
│   │   ├── treasury.ts       # Treasury data collector
│   │   ├── proposals.ts      # Proposals data collector
│   │   ├── community.ts      # Community data collector
│   │   ├── protocol.ts       # Protocol data collector
│   │   └── alerts.ts         # Alert generator
│   ├── calculators/
│   │   ├── nakamoto.ts       # Nakamoto coefficient calculator
│   │   ├── gini.ts           # Gini coefficient calculator
│   │   └── metrics.ts        # General metrics calculations
│   ├── clients/
│   │   ├── snapshot.ts       # Snapshot API client
│   │   ├── tally.ts          # Tally API client
│   │   ├── etherscan.ts      # Etherscan API client
│   │   ├── defillama.ts      # DeFi Llama API client
│   │   └── safe.ts           # Safe API client
│   ├── db/
│   │   └── queries.ts        # Database queries
│   ├── api/
│   │   ├── daos.ts           # DAO endpoints
│   │   ├── proposals.ts      # Proposal endpoints
│   │   └── metrics.ts        # Metrics endpoints
│   └── utils/
│       ├── cache.ts          # KV cache utilities
│       ├── logger.ts         # Logging utilities
│       └── errors.ts         # Error handling
├── wrangler.toml             # Cloudflare Workers config
├── schema.sql                # Database schema
└── package.json
```

### 2.2 wrangler.toml 設定

```toml
name = "dao-data-collector"
main = "src/index.ts"
compatibility_date = "2024-10-01"

[[d1_databases]]
binding = "DB"
database_name = "dao_database"
database_id = "your-database-id"

[[kv_namespaces]]
binding = "CACHE"
id = "your-kv-namespace-id"

[env.production]
vars = { ENVIRONMENT = "production" }

# Cron triggers for scheduled data collection
[triggers]
crons = [
  "0 * * * *",    # Every hour - Governance data
  "0 */6 * * *",  # Every 6 hours - Treasury data
  "30 * * * *",   # Every hour at :30 - Protocol data
]

[vars]
SNAPSHOT_API_URL = "https://hub.snapshot.org/graphql"
TALLY_API_URL = "https://api.tally.xyz/query"
DEFILLAMA_API_URL = "https://api.llama.fi"
```

---

## 3. 資料抓取實作細節

### 3.1 Governance Data Collector

**檔案**: `src/collectors/governance.ts`

```typescript
import { SnapshotClient } from '../clients/snapshot';
import { calculateNakamotoCoefficient } from '../calculators/nakamoto';
import { calculateGiniCoefficient } from '../calculators/gini';

interface GovernanceData {
  votingRate: number;
  nakamotoCoefficient: number;
  giniCoefficient: number;
  whaleConcentration: number;
  totalVoters: number;
  totalVotingPower: number;
}

export class GovernanceCollector {
  constructor(
    private snapshot: SnapshotClient,
    private db: D1Database
  ) {}

  async collect(daoId: string, snapshotSpace: string): Promise<GovernanceData> {
    // 1. Fetch recent proposals (last 30 days)
    const proposals = await this.snapshot.getProposals(snapshotSpace, {
      first: 100,
      state: 'closed',
      created_gte: Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60
    });

    // 2. Fetch all votes for these proposals
    const allVotes: Vote[] = [];
    for (const proposal of proposals) {
      const votes = await this.snapshot.getVotes(proposal.id);
      allVotes.push(...votes);
    }

    // 3. Calculate voting rate
    const uniqueVoters = new Set(allVotes.map(v => v.voter)).size;
    const totalHolders = await this.getTotalTokenHolders(daoId);
    const votingRate = (uniqueVoters / totalHolders) * 100;

    // 4. Calculate voting power distribution
    const voterPowers = this.aggregateVotingPower(allVotes);
    const sortedPowers = Array.from(voterPowers.values()).sort((a, b) => b - a);

    // 5. Calculate Nakamoto coefficient
    const nakamotoCoefficient = calculateNakamotoCoefficient(sortedPowers);

    // 6. Calculate Gini coefficient
    const giniCoefficient = calculateGiniCoefficient(sortedPowers);

    // 7. Calculate whale concentration (top 10 holders)
    const totalPower = sortedPowers.reduce((a, b) => a + b, 0);
    const top10Power = sortedPowers.slice(0, 10).reduce((a, b) => a + b, 0);
    const whaleConcentration = (top10Power / totalPower) * 100;

    return {
      votingRate,
      nakamotoCoefficient,
      giniCoefficient,
      whaleConcentration,
      totalVoters: uniqueVoters,
      totalVotingPower: totalPower
    };
  }

  private aggregateVotingPower(votes: Vote[]): Map<string, number> {
    const powers = new Map<string, number>();
    for (const vote of votes) {
      const current = powers.get(vote.voter) || 0;
      powers.set(vote.voter, current + vote.vp);
    }
    return powers;
  }
}
```

**Snapshot API GraphQL Query**:

```graphql
query Proposals($space: String!, $first: Int!, $state: String!) {
  proposals(
    first: $first
    where: { space: $space, state: $state }
    orderBy: "created"
    orderDirection: desc
  ) {
    id
    title
    body
    choices
    start
    end
    snapshot
    state
    author
    space {
      id
      name
    }
  }
}

query Votes($proposalId: String!) {
  votes(
    first: 10000
    where: { proposal: $proposalId }
    orderBy: "vp"
    orderDirection: desc
  ) {
    id
    voter
    vp
    choice
    created
  }
}
```

### 3.2 Treasury Data Collector

**檔案**: `src/collectors/treasury.ts`

```typescript
import { EtherscanClient } from '../clients/etherscan';

export class TreasuryCollector {
  constructor(
    private etherscan: EtherscanClient,
    private db: D1Database
  ) {}

  async collect(daoId: string, treasuryAddress: string): Promise<TreasuryData> {
    // 1. Fetch current token balances
    const balances = await this.etherscan.getTokenBalances(treasuryAddress);

    // 2. Convert to USD values
    const balancesUSD = await this.convertToUSD(balances);
    const totalValue = balancesUSD.reduce((sum, b) => sum + b.valueUSD, 0);

    // 3. Calculate diversification (Herfindahl index)
    const shares = balancesUSD.map(b => b.valueUSD / totalValue);
    const herfindahl = shares.reduce((sum, s) => sum + s * s, 0);
    const diversification = (1 - herfindahl) * 100;

    // 4. Calculate burn rate (last 90 days spending)
    const transactions = await this.etherscan.getTransactions(
      treasuryAddress,
      Math.floor(Date.now() / 1000) - 90 * 24 * 60 * 60
    );

    const outflows = transactions
      .filter(tx => tx.from.toLowerCase() === treasuryAddress.toLowerCase())
      .reduce((sum, tx) => sum + parseFloat(tx.value), 0);

    const burnRateMonthly = (outflows / 3) * 100 / totalValue; // % per month

    // 5. Calculate runway
    const runwayMonths = burnRateMonthly > 0 ? 100 / burnRateMonthly : 999;

    return {
      totalValueUSD: totalValue,
      burnRateMonthly,
      runwayMonths: Math.floor(runwayMonths),
      diversificationScore: diversification,
      assetBreakdown: balancesUSD
    };
  }

  private async convertToUSD(balances: TokenBalance[]): Promise<BalanceUSD[]> {
    // Use CoinGecko or similar API to get prices
    // Implementation details...
  }
}
```

### 3.3 Protocol Data Collector

**檔案**: `src/collectors/protocol.ts`

```typescript
import { DeFiLlamaClient } from '../clients/defillama';

export class ProtocolCollector {
  constructor(
    private defillama: DeFiLlamaClient,
    private db: D1Database
  ) {}

  async collect(daoId: string, protocolSlug: string): Promise<ProtocolData> {
    // 1. Fetch TVL from DeFi Llama
    const tvlData = await this.defillama.getProtocolTVL(protocolSlug);

    // 2. Fetch revenue/fees data
    const feesData = await this.defillama.getProtocolFees(protocolSlug);

    // 3. Fetch user count (from protocol subgraph if available)
    const usersCount = await this.getUserCount(protocolSlug);

    // 4. Calculate security score (based on audits, time since launch, etc.)
    const securityScore = await this.calculateSecurityScore(daoId);

    return {
      tvlUSD: tvlData.tvl,
      revenueUSD: feesData.totalFees24h * 365, // Annualized
      usersCount,
      securityScore
    };
  }

  private async calculateSecurityScore(daoId: string): Promise<number> {
    // Factors:
    // - Number of audits (from database or external API)
    // - Time since launch (older = more battle-tested)
    // - Bug bounty program existence
    // - Historical exploits (if any)
    // Score: 0-100

    let score = 80; // Base score

    // Add points for audits
    const audits = await this.db
      .prepare('SELECT COUNT(*) as count FROM audits WHERE dao_id = ?')
      .bind(daoId)
      .first();
    score += Math.min(audits.count * 5, 15);

    // Deduct for recent exploits
    const exploits = await this.db
      .prepare('SELECT COUNT(*) as count FROM exploits WHERE dao_id = ? AND timestamp > ?')
      .bind(daoId, Date.now() - 365 * 24 * 60 * 60 * 1000)
      .first();
    score -= exploits.count * 20;

    return Math.max(0, Math.min(100, score));
  }
}
```

### 3.4 Proposals Data Collector

**檔案**: `src/collectors/proposals.ts`

```typescript
export class ProposalsCollector {
  async collect(daoId: string, snapshotSpace: string): Promise<void> {
    // 1. Fetch all proposals
    const proposals = await this.snapshot.getProposals(snapshotSpace, {
      first: 1000,
      orderBy: 'created',
      orderDirection: 'desc'
    });

    // 2. Store proposals to database
    for (const proposal of proposals) {
      await this.db
        .prepare(`
          INSERT INTO proposals (id, dao_id, external_id, title, description,
                                proposer, status, choices, start_time, end_time, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            status = excluded.status,
            end_time = excluded.end_time,
            updated_at = ?
        `)
        .bind(
          this.generateId(),
          daoId,
          proposal.id,
          proposal.title,
          proposal.body,
          proposal.author,
          proposal.state,
          JSON.stringify(proposal.choices),
          proposal.start,
          proposal.end,
          proposal.created,
          Date.now()
        )
        .run();

      // 3. Fetch and store votes for this proposal
      const votes = await this.snapshot.getVotes(proposal.id);
      await this.storeVotes(proposal.id, votes);
    }
  }
}
```

---

## 4. Metrics 計算演算法

### 4.1 Nakamoto Coefficient

**檔案**: `src/calculators/nakamoto.ts`

```typescript
/**
 * Calculate Nakamoto Coefficient
 * The minimum number of entities needed to control >50% of the network
 */
export function calculateNakamotoCoefficient(
  votingPowers: number[]
): number {
  const sorted = [...votingPowers].sort((a, b) => b - a);
  const total = sorted.reduce((sum, power) => sum + power, 0);
  const threshold = total / 2;

  let cumulative = 0;
  let count = 0;

  for (const power of sorted) {
    cumulative += power;
    count++;
    if (cumulative > threshold) {
      break;
    }
  }

  return count;
}
```

### 4.2 Gini Coefficient

**檔案**: `src/calculators/gini.ts`

```typescript
/**
 * Calculate Gini Coefficient
 * Measure of inequality (0 = perfect equality, 1 = perfect inequality)
 */
export function calculateGiniCoefficient(
  votingPowers: number[]
): number {
  const sorted = [...votingPowers].sort((a, b) => a - b);
  const n = sorted.length;

  if (n === 0) return 0;

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (i + 1) * sorted[i];
    denominator += sorted[i];
  }

  if (denominator === 0) return 0;

  return (2 * numerator) / (n * denominator) - (n + 1) / n;
}
```

---

## 5. API Endpoints 實作

### 5.1 Main Router

**檔案**: `src/index.ts`

```typescript
import { Router } from 'itty-router';
import { handleDAOsList, handleDAODetail } from './api/daos';
import { handleDAOMetrics } from './api/metrics';
import { handleProposalDetail } from './api/proposals';

const router = Router();

// CORS middleware
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

router.options('*', () => new Response(null, { headers: corsHeaders }));

// API routes
router.get('/api/daos', handleDAOsList);
router.get('/api/daos/:id', handleDAODetail);
router.get('/api/daos/:id/metrics', handleDAOMetrics);
router.get('/api/daos/:id/proposals', handleProposalsList);
router.get('/api/proposals/:id', handleProposalDetail);
router.get('/api/daos/:id/alerts', handleAlerts);

// 404
router.all('*', () => new Response('Not Found', { status: 404 }));

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const response = await router.handle(request, env);

    // Add CORS headers to response
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  },

  async scheduled(event: ScheduledEvent, env: Env): Promise<void> {
    // Handle cron jobs
    await handleScheduled(event, env);
  }
};
```

### 5.2 DAOs Endpoints

**檔案**: `src/api/daos.ts`

```typescript
export async function handleDAOsList(request: Request, env: Env) {
  // Check cache first
  const cacheKey = 'daos:list';
  const cached = await env.CACHE.get(cacheKey, 'json');

  if (cached) {
    return new Response(JSON.stringify(cached), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Fetch from database
  const daos = await env.DB
    .prepare('SELECT * FROM daos ORDER BY name')
    .all();

  // Cache for 5 minutes
  await env.CACHE.put(cacheKey, JSON.stringify(daos.results), {
    expirationTtl: 300
  });

  return new Response(JSON.stringify(daos.results), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function handleDAODetail(request: Request, env: Env) {
  const url = new URL(request.url);
  const daoId = url.pathname.split('/')[3];

  // Check cache
  const cacheKey = `dao:${daoId}`;
  const cached = await env.CACHE.get(cacheKey, 'json');

  if (cached) {
    return new Response(JSON.stringify(cached), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Fetch from database
  const dao = await env.DB
    .prepare('SELECT * FROM daos WHERE id = ? OR slug = ?')
    .bind(daoId, daoId)
    .first();

  if (!dao) {
    return new Response('DAO not found', { status: 404 });
  }

  // Fetch latest metrics
  const metrics = await fetchLatestMetrics(env.DB, dao.id);

  const result = {
    ...dao,
    metrics
  };

  // Cache for 5 minutes
  await env.CACHE.put(cacheKey, JSON.stringify(result), {
    expirationTtl: 300
  });

  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### 5.3 Metrics Endpoint

**檔案**: `src/api/metrics.ts`

```typescript
export async function handleDAOMetrics(request: Request, env: Env) {
  const url = new URL(request.url);
  const daoId = url.pathname.split('/')[3];
  const timeRange = url.searchParams.get('range') || '30d';

  // Convert time range to timestamp
  const since = getTimestampFromRange(timeRange);

  // Fetch all metrics
  const [governance, treasury, decentralization, community, efficiency, protocol] =
    await Promise.all([
      fetchGovernanceMetrics(env.DB, daoId, since),
      fetchTreasuryMetrics(env.DB, daoId, since),
      fetchDecentralizationMetrics(env.DB, daoId, since),
      fetchCommunityMetrics(env.DB, daoId, since),
      fetchEfficiencyMetrics(env.DB, daoId, since),
      fetchProtocolMetrics(env.DB, daoId, since)
    ]);

  return new Response(JSON.stringify({
    governance,
    treasury,
    decentralization,
    community,
    efficiency,
    protocol
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

---

## 6. Cron Jobs 設定

### 6.1 Scheduled Handler

**檔案**: `src/scheduled.ts`

```typescript
export async function handleScheduled(event: ScheduledEvent, env: Env) {
  const cron = event.cron;

  // Every hour - Governance & Protocol data
  if (cron === '0 * * * *') {
    await collectAllGovernanceData(env);
    await collectAllProtocolData(env);
    await generateAlerts(env);
  }

  // Every 6 hours - Treasury data (more expensive API calls)
  if (cron === '0 */6 * * *') {
    await collectAllTreasuryData(env);
  }
}

async function collectAllGovernanceData(env: Env) {
  const daos = await env.DB.prepare('SELECT * FROM daos').all();

  for (const dao of daos.results) {
    try {
      const collector = new GovernanceCollector(
        new SnapshotClient(env.SNAPSHOT_API_URL),
        env.DB
      );

      const data = await collector.collect(dao.id, dao.snapshot_space);

      // Store to database
      await env.DB
        .prepare(`
          INSERT INTO governance_metrics
          (id, dao_id, voting_rate, nakamoto_coefficient, gini_coefficient,
           whale_concentration, total_voters, total_voting_power, timestamp)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
          generateId(),
          dao.id,
          data.votingRate,
          data.nakamotoCoefficient,
          data.giniCoefficient,
          data.whaleConcentration,
          data.totalVoters,
          data.totalVotingPower,
          Date.now()
        )
        .run();

      console.log(`✅ Collected governance data for ${dao.name}`);
    } catch (error) {
      console.error(`❌ Error collecting data for ${dao.name}:`, error);
    }
  }
}
```

---

## 7. Alert 系統

### 7.1 Alert Generator

**檔案**: `src/collectors/alerts.ts`

```typescript
interface AlertThreshold {
  metric: string;
  dimension: string;
  warningThreshold: number;
  criticalThreshold: number;
  comparison: 'gt' | 'lt'; // greater than or less than
  message: (value: number) => string;
}

const ALERT_THRESHOLDS: AlertThreshold[] = [
  {
    metric: 'voting_rate',
    dimension: 'governance',
    warningThreshold: 30,
    criticalThreshold: 20,
    comparison: 'lt',
    message: (value) => `Low voting participation rate (${value.toFixed(1)}%)`
  },
  {
    metric: 'whale_concentration',
    dimension: 'governance',
    warningThreshold: 30,
    criticalThreshold: 50,
    comparison: 'gt',
    message: (value) => `High whale concentration (${value.toFixed(1)}%)`
  },
  {
    metric: 'runway_months',
    dimension: 'treasury',
    warningThreshold: 24,
    criticalThreshold: 12,
    comparison: 'lt',
    message: (value) => `Treasury runway below ${value} months`
  },
  {
    metric: 'proposer_concentration',
    dimension: 'decentralization',
    warningThreshold: 30,
    criticalThreshold: 50,
    comparison: 'gt',
    message: (value) => `High proposer concentration (${value.toFixed(1)}%)`
  }
];

export class AlertGenerator {
  constructor(private db: D1Database) {}

  async generate(daoId: string): Promise<void> {
    // Fetch latest metrics
    const metrics = await this.fetchLatestMetrics(daoId);

    for (const threshold of ALERT_THRESHOLDS) {
      const value = this.getMetricValue(metrics, threshold.dimension, threshold.metric);

      if (value === null) continue;

      let alertType: string | null = null;

      if (threshold.comparison === 'gt') {
        if (value > threshold.criticalThreshold) alertType = 'critical';
        else if (value > threshold.warningThreshold) alertType = 'warning';
      } else {
        if (value < threshold.criticalThreshold) alertType = 'critical';
        else if (value < threshold.warningThreshold) alertType = 'warning';
      }

      if (alertType) {
        await this.createAlert(daoId, {
          type: alertType,
          message: threshold.message(value),
          dimension: threshold.dimension,
          metricValue: value,
          thresholdValue: alertType === 'critical'
            ? threshold.criticalThreshold
            : threshold.warningThreshold
        });
      } else {
        // Resolve any existing alerts for this metric
        await this.resolveAlert(daoId, threshold.dimension, threshold.metric);
      }
    }
  }

  private async createAlert(daoId: string, alert: AlertData): Promise<void> {
    // Check if alert already exists
    const existing = await this.db
      .prepare(`
        SELECT id FROM alerts
        WHERE dao_id = ? AND dimension = ? AND is_active = 1
      `)
      .bind(daoId, alert.dimension)
      .first();

    if (!existing) {
      await this.db
        .prepare(`
          INSERT INTO alerts
          (id, dao_id, type, message, dimension, metric_value, threshold_value, is_active, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
        `)
        .bind(
          generateId(),
          daoId,
          alert.type,
          alert.message,
          alert.dimension,
          alert.metricValue,
          alert.thresholdValue,
          Date.now()
        )
        .run();
    }
  }
}
```

---

## 8. 測試策略

### 8.1 Unit Tests

```typescript
// tests/calculators/nakamoto.test.ts
import { describe, it, expect } from 'vitest';
import { calculateNakamotoCoefficient } from '../src/calculators/nakamoto';

describe('Nakamoto Coefficient', () => {
  it('should calculate correct coefficient for simple case', () => {
    const powers = [50, 30, 20];
    expect(calculateNakamotoCoefficient(powers)).toBe(2);
  });

  it('should handle equal distribution', () => {
    const powers = Array(100).fill(1);
    expect(calculateNakamotoCoefficient(powers)).toBe(51);
  });
});
```

### 8.2 Integration Tests

```typescript
// tests/integration/api.test.ts
import { describe, it, expect } from 'vitest';

describe('API Endpoints', () => {
  it('should fetch DAOs list', async () => {
    const response = await fetch('http://localhost:8787/api/daos');
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });
});
```

---

## 9. 部署流程

### 9.1 初始設定

```bash
# 1. Install Wrangler CLI
npm install -g wrangler

# 2. Login to Cloudflare
wrangler login

# 3. Create D1 database
wrangler d1 create dao-database

# 4. Create KV namespace
wrangler kv:namespace create CACHE

# 5. Initialize database schema
wrangler d1 execute dao-database --file=schema.sql

# 6. Add secrets
wrangler secret put ETHERSCAN_API_KEY
wrangler secret put DEFILLAMA_API_KEY
```

### 9.2 開發與測試

```bash
# Run locally
pnpm dev

# Run with local D1 database
wrangler dev --local

# Tail logs
wrangler tail
```

### 9.3 Production 部署

```bash
# Deploy to production
pnpm deploy

# Or with wrangler
wrangler deploy
```

---

## 10. 監控與維護

### 10.1 監控指標

- Worker 執行成功率
- API response time
- Database query performance
- External API rate limits usage
- Alert generation frequency

### 10.2 Log 分析

使用 Cloudflare Analytics Dashboard 監控：
- Request count per endpoint
- Error rate
- Cache hit ratio
- Worker CPU time

### 10.3 成本估算

**Cloudflare Workers Free Tier**:
- 100,000 requests/day
- 10ms CPU time per request

**D1 Database Free Tier**:
- 5GB storage
- 5 million reads/day
- 100,000 writes/day

**預估使用量** (5 DAOs, hourly updates):
- Writes: ~120/day (5 DAOs × 24 hours)
- Reads: ~10,000/day (估計)
- Storage: ~1GB

✅ 完全在 free tier 範圍內

---

## 11. 下一步實作順序

1. ✅ Setup Cloudflare Workers project
2. ✅ Create D1 database schema
3. ✅ Implement Snapshot API client
4. ✅ Implement governance data collector
5. ✅ Implement metrics calculators
6. ✅ Create API endpoints
7. ✅ Setup cron jobs
8. ✅ Integrate with frontend
9. ✅ Add other data sources (Treasury, Protocol)
10. ✅ Implement alert system
11. ✅ Testing & deployment
