/**
 * Seed script to add sample DAOs to the database
 * Run with: pnpm tsx src/seed.ts
 */

import { createDb } from './db';
import { daos } from './db/schema';

const DATABASE_URL = process.env.DATABASE_URL!;

const sampleDaos = [
  {
    id: 'uniswap',
    name: 'Uniswap',
    slug: 'uniswap',
    chain: 'ethereum',
    stage: 2, // full DAO
    governanceAddress: '0x408ED6354d4973f66138C91495F2f2FCbd8724C3',
    treasuryAddress: '0x1a9C8182C09F50C8318d769245beA52c32BE35BC',
    snapshotSpace: 'uniswapgovernance.eth',
    tallyOrgId: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    slug: 'arbitrum',
    chain: 'arbitrum',
    stage: 2,
    governanceAddress: '0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9',
    treasuryAddress: '0xF3FC178157fb3c87548bAA86F9d24BA38E649B58',
    snapshotSpace: 'arbitrumfoundation.eth',
    tallyOrgId: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'optimism',
    name: 'Optimism',
    slug: 'optimism',
    chain: 'optimism',
    stage: 2,
    governanceAddress: '0xcDF27F107725988f2261Ce2256bDfCdE8B382B10',
    treasuryAddress: '0x2501c477D0A35545a387Aa4A3EEe4292A9a8B3F0',
    snapshotSpace: 'opcollective.eth',
    tallyOrgId: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'ens',
    name: 'ENS',
    slug: 'ens',
    chain: 'ethereum',
    stage: 2,
    governanceAddress: '0x323A76393544d5ecca80cd6ef2A560C6a395b7E3',
    treasuryAddress: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
    snapshotSpace: 'ens.eth',
    tallyOrgId: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'gitcoin',
    name: 'Gitcoin',
    slug: 'gitcoin',
    chain: 'ethereum',
    stage: 1, // functional DAO
    governanceAddress: '0xDbD27635A534A3d3169Ef0498beB56Fb9c937489',
    treasuryAddress: '0x57a8865cfB1eCEf7253c27da6B4BC3dAEE5Be518',
    snapshotSpace: 'gitcoindao.eth',
    tallyOrgId: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

async function seed() {
  console.log('🌱 Seeding database with sample DAOs...\n');

  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set');
    process.exit(1);
  }

  const db = createDb(DATABASE_URL);

  try {
    for (const dao of sampleDaos) {
      console.log(`📝 Inserting ${dao.name}...`);
      await db
        .insert(daos)
        .values(dao)
        .onConflictDoNothing();
      console.log(`   ✓ ${dao.name} (${dao.snapshotSpace})\n`);
    }

    console.log('✅ Seeding completed successfully!');
    console.log(`\nInserted ${sampleDaos.length} DAOs into the database.`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
