import { createDb } from './db';
import { SnapshotClient } from './clients/snapshot';
import { GovernanceCollector } from './collectors/governance';
import { daos } from './db/schema';

export async function handleScheduled(
  event: ScheduledEvent,
  env: Env
): Promise<void> {
  const cron = event.cron;
  console.log(`🕐 Cron triggered: ${cron}`);

  const db = createDb(env.DATABASE_URL);

  try {
    // Every hour - Governance data collection
    if (cron === '0 * * * *') {
      await collectAllGovernanceData(env, db);
    }

    // Every 6 hours - Treasury data collection
    if (cron === '0 */6 * * *') {
      console.log('💰 Treasury data collection (to be implemented)');
      // await collectAllTreasuryData(env, db);
    }

    // Every hour at :30 - Protocol data collection
    if (cron === '30 * * * *') {
      console.log('📈 Protocol data collection (to be implemented)');
      // await collectAllProtocolData(env, db);
    }

    console.log('✅ Cron job completed successfully');
  } catch (error) {
    console.error('❌ Cron job failed:', error);
    throw error;
  }
}

/**
 * Collect governance data for all DAOs
 */
async function collectAllGovernanceData(env: Env, db: ReturnType<typeof createDb>): Promise<void> {
  console.log('📊 Starting governance data collection for all DAOs...');

  // Fetch all DAOs from database
  const allDaos = await db.select().from(daos);
  console.log(`Found ${allDaos.length} DAOs to process`);

  if (allDaos.length === 0) {
    console.log('⚠️  No DAOs found in database. Add DAOs first.');
    return;
  }

  const snapshotClient = new SnapshotClient(env.SNAPSHOT_API_URL);

  for (const dao of allDaos) {
    if (!dao.snapshotSpace) {
      console.log(`⏭️  Skipping ${dao.name} - no Snapshot space configured`);
      continue;
    }

    try {
      console.log(`\n🎯 Processing: ${dao.name}`);
      console.log(`   Space: ${dao.snapshotSpace}`);

      const collector = new GovernanceCollector(snapshotClient, db);
      const data = await collector.collect(dao.id, dao.snapshotSpace);
      await collector.save(dao.id, data);

      console.log(`✅ Completed: ${dao.name}\n`);

      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Error processing ${dao.name}:`, error);
      // Continue with next DAO
    }
  }

  console.log('✅ Governance data collection completed for all DAOs');
}
