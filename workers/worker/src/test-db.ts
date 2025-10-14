/**
 * Test script to check database connection and data
 * Run with: pnpm tsx src/test-db.ts
 */

import { createDb } from './db';
import { daos } from './db/schema';

const DATABASE_URL = process.env.DATABASE_URL!;

async function testDb() {
  console.log('🔍 Testing database connection...\n');

  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set');
    process.exit(1);
  }

  const db = createDb(DATABASE_URL);

  try {
    console.log('📊 Fetching all DAOs from database...\n');

    const allDaos = await db.select().from(daos);

    console.log(`✅ Found ${allDaos.length} DAOs:\n`);

    for (const dao of allDaos) {
      console.log(`  • ${dao.name}`);
      console.log(`    - ID: ${dao.id}`);
      console.log(`    - Slug: ${dao.slug}`);
      console.log(`    - Chain: ${dao.chain}`);
      console.log(`    - Snapshot Space: ${dao.snapshotSpace}`);
      console.log(`    - Stage: ${dao.stage}`);
      console.log('');
    }

    if (allDaos.length === 0) {
      console.log('⚠️  No DAOs found. Run `pnpm db:seed` to add sample data.');
    }

  } catch (error) {
    console.error('❌ Error querying database:', error);
    process.exit(1);
  }
}

testDb();
