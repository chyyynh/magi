/**
 * Test Snapshot API directly
 * Run with: pnpm tsx src/test-snapshot.ts
 */

const SNAPSHOT_API = 'https://hub.snapshot.org/graphql';

async function testSnapshot() {
  console.log('🧪 Testing Snapshot API...\n');

  // Test 1: Get proposals
  console.log('1️⃣  Testing proposals query...');
  const proposalsQuery = `
    query {
      proposals(
        first: 2
        where: {
          space_in: ["uniswapgovernance.eth"]
          state: "closed"
        }
        orderBy: "created"
        orderDirection: desc
      ) {
        id
        title
        state
        votes
      }
    }
  `;

  const proposalsResponse = await fetch(SNAPSHOT_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: proposalsQuery }),
  });

  const proposalsData = await proposalsResponse.json();
  console.log('Proposals:', JSON.stringify(proposalsData, null, 2));

  if (proposalsData.data?.proposals?.[0]) {
    const firstProposal = proposalsData.data.proposals[0];
    console.log(`\nFirst proposal: ${firstProposal.title}`);
    console.log(`Proposal ID: ${firstProposal.id}`);
    console.log(`Total votes: ${firstProposal.votes}\n`);

    // Test 2: Get votes for first proposal
    console.log('2️⃣  Testing votes query...');
    const votesQuery = `
      query {
        votes(
          first: 5
          where: { proposal_in: ["${firstProposal.id}"] }
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
    `;

    const votesResponse = await fetch(SNAPSHOT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: votesQuery }),
    });

    const votesData = await votesResponse.json();
    console.log('Votes:', JSON.stringify(votesData, null, 2));
  }
}

testSnapshot();
