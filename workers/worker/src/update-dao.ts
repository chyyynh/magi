/**
 * Update script to replace Gitcoin with Morpho
 * Run with: DATABASE_URL="..." pnpm tsx src/update-dao.ts
 */

import { createDb } from './db';
import { daos, governanceMetrics, proposals, votes } from './db/schema';
import { eq } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL!;

async function updateDao() {
  console.log('🔄 Updating DAO: Replacing Gitcoin with Morpho (including ID)...\n');

  if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set');
    process.exit(1);
  }

  const db = createDb(DATABASE_URL);

  try {
    // Step 1: Create new Morpho DAO
    console.log('1️⃣  Creating new Morpho DAO...');
    await db.insert(daos).values({
      id: 'morpho',
      name: 'Morpho',
      slug: 'morpho',
      chain: 'ethereum',
      stage: 2,
      governanceAddress: null,
      treasuryAddress: null,
      snapshotSpace: 'morpho.eth',
      tallyOrgId: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }).onConflictDoNothing();
    console.log('   ✓ Morpho DAO created\n');

    // Step 2: Update governance_metrics
    console.log('2️⃣  Updating governance_metrics...');
    await db
      .update(governanceMetrics)
      .set({ daoId: 'morpho' })
      .where(eq(governanceMetrics.daoId, 'gitcoin'));
    console.log('   ✓ governance_metrics updated\n');

    // Step 3: Update proposals
    console.log('3️⃣  Updating proposals...');
    await db
      .update(proposals)
      .set({ daoId: 'morpho' })
      .where(eq(proposals.daoId, 'gitcoin'));
    console.log('   ✓ proposals updated\n');

    // Step 4: Delete old Gitcoin DAO
    console.log('4️⃣  Deleting old Gitcoin DAO...');
    await db.delete(daos).where(eq(daos.id, 'gitcoin'));
    console.log('   ✓ Gitcoin DAO deleted\n');

    // Verify
    const allDaos = await db.select().from(daos);
    console.log('✅ Update completed! Current DAOs:');
    for (const dao of allDaos) {
      console.log(`   • ${dao.name} (${dao.snapshotSpace})`);
    }

  } catch (error) {
    console.error('❌ Error updating DAO:', error);
    process.exit(1);
  }
}

updateDao();
