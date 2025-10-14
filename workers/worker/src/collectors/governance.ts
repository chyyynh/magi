import { SnapshotClient, SnapshotVote, SnapshotProposal } from '../clients/snapshot';
import { calculateNakamotoCoefficient } from '../calculators/nakamoto';
import { calculateGiniCoefficient } from '../calculators/gini';
import { DbInstance } from '../db';
import { governanceMetrics, proposals, votes } from '../db/schema';
import { eq } from 'drizzle-orm';

export interface GovernanceData {
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
    private db: DbInstance
  ) {}

  /**
   * Collect governance metrics for a DAO
   */
  async collect(
    daoId: string,
    snapshotSpace: string
  ): Promise<GovernanceData> {
    console.log(`📊 Collecting governance data for ${daoId}...`);

    // 1. Fetch recent closed proposals (most recent 5)
    const allProposals = await this.snapshot.getProposals(snapshotSpace, {
      first: 5,
      state: 'closed',
    });

    console.log(`  ✓ Found ${allProposals.length} closed proposals`);

    if (allProposals.length === 0) {
      console.log('  ⚠️  No proposals found');
      return this.getDefaultMetrics();
    }

    // 2. Store proposals to database
    await this.storeProposals(daoId, allProposals);

    // 3. Fetch all votes for these proposals (skip if already fetched)
    const allVotes: SnapshotVote[] = [];
    for (const proposal of allProposals) {
      try {
        // Check if proposal already has votes in database
        const existingProposal = await this.db
          .select()
          .from(proposals)
          .where(eq(proposals.id, proposal.id))
          .limit(1);

        if (existingProposal.length > 0 && existingProposal[0].voteCount > 0) {
          console.log(`  ⏭️  Skipping proposal (already fetched): ${proposal.title.substring(0, 50)}...`);

          // Still need to load votes for metrics calculation
          const existingVotes = await this.db
            .select()
            .from(votes)
            .where(eq(votes.proposalId, proposal.id));

          allVotes.push(...existingVotes.map(v => ({
            id: v.id,
            voter: v.voterAddress,
            vp: v.votingPower,
            choice: v.choice,
            created: Math.floor(v.timestamp / 1000),
            reason: v.reason || undefined,
          })));
          continue;
        }

        const proposalVotes = await this.snapshot.getVotes(proposal.id);
        allVotes.push(...proposalVotes);

        // Store votes to database
        await this.storeVotes(proposal.id, proposalVotes);

        console.log(`  ✓ Fetched ${proposalVotes.length} votes for proposal: ${proposal.title.substring(0, 50)}...`);
      } catch (error) {
        console.error(`  ❌ Error fetching votes for ${proposal.id}:`, error);
      }
    }

    if (allVotes.length === 0) {
      console.log('  ⚠️  No votes found');
      return this.getDefaultMetrics();
    }

    // 3. Calculate voting rate
    const uniqueVoters = new Set(allVotes.map(v => v.voter)).size;
    const totalHolders = await this.getTotalTokenHolders(snapshotSpace);
    const votingRate = totalHolders > 0 ? (uniqueVoters / totalHolders) * 100 : 0;

    // 4. Aggregate voting power by voter
    const voterPowers = this.aggregateVotingPower(allVotes);
    const sortedPowers = Array.from(voterPowers.values()).sort((a, b) => b - a);
    const totalPower = sortedPowers.reduce((a, b) => a + b, 0);

    // 5. Calculate Nakamoto coefficient
    const nakamotoCoefficient = calculateNakamotoCoefficient(sortedPowers);

    // 6. Calculate Gini coefficient
    const giniCoefficient = calculateGiniCoefficient(sortedPowers);

    // 7. Calculate whale concentration (top 10 holders)
    const top10Power = sortedPowers.slice(0, 10).reduce((a, b) => a + b, 0);
    const whaleConcentration = totalPower > 0 ? (top10Power / totalPower) * 100 : 0;

    console.log(`  ✓ Metrics calculated:`);
    console.log(`    - Voting Rate: ${votingRate.toFixed(2)}%`);
    console.log(`    - Nakamoto Coefficient: ${nakamotoCoefficient}`);
    console.log(`    - Gini Coefficient: ${giniCoefficient.toFixed(3)}`);
    console.log(`    - Whale Concentration: ${whaleConcentration.toFixed(2)}%`);

    return {
      votingRate,
      nakamotoCoefficient,
      giniCoefficient,
      whaleConcentration,
      totalVoters: uniqueVoters,
      totalVotingPower: totalPower,
    };
  }

  /**
   * Save governance metrics to database
   */
  async save(daoId: string, data: GovernanceData): Promise<void> {
    await this.db.insert(governanceMetrics).values({
      id: this.generateId(),
      daoId,
      votingRate: data.votingRate,
      nakamotoCoefficient: data.nakamotoCoefficient,
      giniCoefficient: data.giniCoefficient,
      whaleConcentration: data.whaleConcentration,
      totalVoters: data.totalVoters,
      totalVotingPower: data.totalVotingPower,
      timestamp: Date.now(),
    });

    console.log(`  ✓ Saved metrics to database`);
  }

  /**
   * Aggregate voting power by voter address
   */
  private aggregateVotingPower(votes: SnapshotVote[]): Map<string, number> {
    const powers = new Map<string, number>();
    for (const vote of votes) {
      const current = powers.get(vote.voter) || 0;
      powers.set(vote.voter, current + vote.vp);
    }
    return powers;
  }

  /**
   * Get total token holders (estimated from space members or use default)
   * In production, you'd fetch this from on-chain data or the space metadata
   */
  private async getTotalTokenHolders(space: string): Promise<number> {
    try {
      const spaceData = await this.snapshot.getSpace(space);
      return spaceData.members?.length || 10000; // Fallback to 10k
    } catch (error) {
      console.warn('  ⚠️  Could not fetch total holders, using default 10000');
      return 10000;
    }
  }

  /**
   * Get default metrics when no data is available
   */
  private getDefaultMetrics(): GovernanceData {
    return {
      votingRate: 0,
      nakamotoCoefficient: 0,
      giniCoefficient: 0,
      whaleConcentration: 0,
      totalVoters: 0,
      totalVotingPower: 0,
    };
  }

  /**
   * Store proposals to database
   */
  private async storeProposals(daoId: string, snapshotProposals: SnapshotProposal[]): Promise<void> {
    for (const proposal of snapshotProposals) {
      try {
        await this.db
          .insert(proposals)
          .values({
            id: proposal.id,
            daoId: daoId,
            externalId: proposal.id,
            title: proposal.title,
            description: proposal.body || null,
            proposer: proposal.author,
            status: proposal.state,
            choices: JSON.stringify(proposal.choices),
            startTime: proposal.start * 1000, // Convert to milliseconds
            endTime: proposal.end * 1000,
            executionTime: null,
            snapshotBlock: proposal.snapshot,
            voteCount: 0, // Will be updated after votes are stored
            createdAt: proposal.created * 1000,
          })
          .onConflictDoNothing();
      } catch (error) {
        console.error(`  ❌ Error storing proposal ${proposal.id}:`, error);
      }
    }
    console.log(`  ✓ Stored ${snapshotProposals.length} proposals to database`);
  }

  /**
   * Store votes to database and update proposal vote count
   */
  private async storeVotes(proposalId: string, snapshotVotes: SnapshotVote[]): Promise<void> {
    for (const vote of snapshotVotes) {
      try {
        await this.db
          .insert(votes)
          .values({
            id: `${proposalId}-${vote.voter}`,
            proposalId: proposalId,
            voterAddress: vote.voter,
            votingPower: vote.vp,
            choice: vote.choice,
            reason: vote.reason || null,
            timestamp: vote.created * 1000, // Convert to milliseconds
          })
          .onConflictDoNothing();
      } catch (error) {
        // Ignore duplicate key errors silently
      }
    }

    // Update proposal vote count
    if (snapshotVotes.length > 0) {
      try {
        await this.db
          .update(proposals)
          .set({ voteCount: snapshotVotes.length })
          .where(eq(proposals.id, proposalId));
      } catch (error) {
        console.error(`  ❌ Error updating vote count for ${proposalId}:`, error);
      }
    }
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
