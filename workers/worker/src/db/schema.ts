import { pgTable, text, integer, real, bigint, index, uniqueIndex } from 'drizzle-orm/pg-core';

// ===== Core Tables =====

export const daos = pgTable('daos', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  chain: text('chain').notNull(), // ethereum, arbitrum, optimism
  stage: integer('stage').default(0).notNull(), // 0: centralized, 1: functional, 2: full
  governanceAddress: text('governance_address'),
  treasuryAddress: text('treasury_address'),
  snapshotSpace: text('snapshot_space'),
  tallyOrgId: text('tally_org_id'),
  createdAt: bigint('created_at', { mode: 'number' }).notNull(),
  updatedAt: bigint('updated_at', { mode: 'number' }).notNull(),
}, (table) => ({
  slugIdx: uniqueIndex('idx_daos_slug').on(table.slug),
  chainIdx: index('idx_daos_chain').on(table.chain),
}));

export const proposals = pgTable('proposals', {
  id: text('id').primaryKey(),
  daoId: text('dao_id').notNull().references(() => daos.id),
  externalId: text('external_id').notNull(), // snapshot/tally proposal id
  title: text('title').notNull(),
  description: text('description'),
  proposer: text('proposer').notNull(),
  status: text('status').notNull(), // pending, active, succeeded, failed, executed
  choices: text('choices'), // JSON array
  startTime: bigint('start_time', { mode: 'number' }),
  endTime: bigint('end_time', { mode: 'number' }),
  executionTime: bigint('execution_time', { mode: 'number' }),
  snapshotBlock: text('snapshot_block'), // Block number when proposal was created
  voteCount: integer('vote_count').default(0), // Total number of votes
  createdAt: bigint('created_at', { mode: 'number' }).notNull(),
}, (table) => ({
  daoIdIdx: index('idx_proposals_dao_id').on(table.daoId),
  statusIdx: index('idx_proposals_status').on(table.status),
  createdAtIdx: index('idx_proposals_created_at').on(table.createdAt),
}));

export const votes = pgTable('votes', {
  id: text('id').primaryKey(),
  proposalId: text('proposal_id').notNull().references(() => proposals.id),
  voterAddress: text('voter_address').notNull(),
  votingPower: real('voting_power').notNull(),
  choice: integer('choice').notNull(),
  reason: text('reason'),
  timestamp: bigint('timestamp', { mode: 'number' }).notNull(),
}, (table) => ({
  proposalIdIdx: index('idx_votes_proposal_id').on(table.proposalId),
  voterIdx: index('idx_votes_voter').on(table.voterAddress),
  timestampIdx: index('idx_votes_timestamp').on(table.timestamp),
}));

// ===== Metrics Tables =====

export const governanceMetrics = pgTable('governance_metrics', {
  id: text('id').primaryKey(),
  daoId: text('dao_id').notNull().references(() => daos.id),
  votingRate: real('voting_rate').notNull(),
  nakamotoCoefficient: integer('nakamoto_coefficient').notNull(),
  giniCoefficient: real('gini_coefficient').notNull(),
  whaleConcentration: real('whale_concentration').notNull(),
  totalVoters: integer('total_voters').notNull(),
  totalVotingPower: real('total_voting_power').notNull(),
  timestamp: bigint('timestamp', { mode: 'number' }).notNull(),
}, (table) => ({
  daoTimestampIdx: index('idx_gov_metrics_dao_timestamp').on(table.daoId, table.timestamp),
}));

export const treasuryMetrics = pgTable('treasury_metrics', {
  id: text('id').primaryKey(),
  daoId: text('dao_id').notNull().references(() => daos.id),
  totalValueUsd: real('total_value_usd').notNull(),
  burnRateMonthly: real('burn_rate_monthly').notNull(),
  runwayMonths: integer('runway_months').notNull(),
  diversificationScore: real('diversification_score').notNull(),
  assetBreakdown: text('asset_breakdown'), // JSON: [{token, amount, value_usd}]
  timestamp: bigint('timestamp', { mode: 'number' }).notNull(),
}, (table) => ({
  daoTimestampIdx: index('idx_treasury_metrics_dao_timestamp').on(table.daoId, table.timestamp),
}));

export const decentralizationMetrics = pgTable('decentralization_metrics', {
  id: text('id').primaryKey(),
  daoId: text('dao_id').notNull().references(() => daos.id),
  proposerConcentration: real('proposer_concentration').notNull(),
  automationLevel: real('automation_level').notNull(),
  multisigConfig: text('multisig_config'), // e.g., "6-of-9"
  multisigSigners: text('multisig_signers'), // JSON array
  timestamp: bigint('timestamp', { mode: 'number' }).notNull(),
}, (table) => ({
  daoTimestampIdx: index('idx_decentral_metrics_dao_timestamp').on(table.daoId, table.timestamp),
}));

export const communityMetrics = pgTable('community_metrics', {
  id: text('id').primaryKey(),
  daoId: text('dao_id').notNull().references(() => daos.id),
  dailyActiveUsers: integer('daily_active_users').notNull(),
  weeklyActiveUsers: integer('weekly_active_users').notNull(),
  retentionRate: real('retention_rate').notNull(),
  engagementScore: real('engagement_score').notNull(),
  timestamp: bigint('timestamp', { mode: 'number' }).notNull(),
}, (table) => ({
  daoTimestampIdx: index('idx_community_metrics_dao_timestamp').on(table.daoId, table.timestamp),
}));

export const efficiencyMetrics = pgTable('efficiency_metrics', {
  id: text('id').primaryKey(),
  daoId: text('dao_id').notNull().references(() => daos.id),
  avgExecutionTimeDays: real('avg_execution_time_days').notNull(),
  proposalThroughputMonthly: integer('proposal_throughput_monthly').notNull(),
  successRate: real('success_rate').notNull(),
  timestamp: bigint('timestamp', { mode: 'number' }).notNull(),
}, (table) => ({
  daoTimestampIdx: index('idx_efficiency_metrics_dao_timestamp').on(table.daoId, table.timestamp),
}));

export const protocolMetrics = pgTable('protocol_metrics', {
  id: text('id').primaryKey(),
  daoId: text('dao_id').notNull().references(() => daos.id),
  tvlUsd: real('tvl_usd').notNull(),
  revenueUsd: real('revenue_usd').notNull(),
  usersCount: integer('users_count').notNull(),
  securityScore: real('security_score').notNull(),
  timestamp: bigint('timestamp', { mode: 'number' }).notNull(),
}, (table) => ({
  daoTimestampIdx: index('idx_protocol_metrics_dao_timestamp').on(table.daoId, table.timestamp),
}));

export const alerts = pgTable('alerts', {
  id: text('id').primaryKey(),
  daoId: text('dao_id').notNull().references(() => daos.id),
  type: text('type').notNull(), // warning, info, critical
  message: text('message').notNull(),
  dimension: text('dimension').notNull(), // governance, treasury, etc.
  metricValue: real('metric_value'),
  thresholdValue: real('threshold_value'),
  isActive: integer('is_active').default(1).notNull(),
  createdAt: bigint('created_at', { mode: 'number' }).notNull(),
  resolvedAt: bigint('resolved_at', { mode: 'number' }),
}, (table) => ({
  daoActiveIdx: index('idx_alerts_dao_active').on(table.daoId, table.isActive),
  createdAtIdx: index('idx_alerts_created_at').on(table.createdAt),
}));

// ===== Types =====

export type Dao = typeof daos.$inferSelect;
export type NewDao = typeof daos.$inferInsert;

export type Proposal = typeof proposals.$inferSelect;
export type NewProposal = typeof proposals.$inferInsert;

export type Vote = typeof votes.$inferSelect;
export type NewVote = typeof votes.$inferInsert;

export type GovernanceMetrics = typeof governanceMetrics.$inferSelect;
export type NewGovernanceMetrics = typeof governanceMetrics.$inferInsert;

export type TreasuryMetrics = typeof treasuryMetrics.$inferSelect;
export type NewTreasuryMetrics = typeof treasuryMetrics.$inferInsert;

export type DecentralizationMetrics = typeof decentralizationMetrics.$inferSelect;
export type NewDecentralizationMetrics = typeof decentralizationMetrics.$inferInsert;

export type CommunityMetrics = typeof communityMetrics.$inferSelect;
export type NewCommunityMetrics = typeof communityMetrics.$inferInsert;

export type EfficiencyMetrics = typeof efficiencyMetrics.$inferSelect;
export type NewEfficiencyMetrics = typeof efficiencyMetrics.$inferInsert;

export type ProtocolMetrics = typeof protocolMetrics.$inferSelect;
export type NewProtocolMetrics = typeof protocolMetrics.$inferInsert;

export type Alert = typeof alerts.$inferSelect;
export type NewAlert = typeof alerts.$inferInsert;
