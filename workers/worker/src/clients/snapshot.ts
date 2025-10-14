export interface SnapshotProposal {
  id: string;
  title: string;
  body: string;
  choices: string[];
  start: number;
  end: number;
  snapshot: string;
  state: string;
  author: string;
  space: {
    id: string;
    name: string;
  };
  created: number;
}

export interface SnapshotVote {
  id: string;
  voter: string;
  vp: number; // voting power
  choice: number;
  created: number;
  reason?: string;
}

interface GraphQLResponse<T> {
  data: T;
}

export class SnapshotClient {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  /**
   * Fetch proposals from a Snapshot space
   */
  async getProposals(
    space: string,
    options: {
      first?: number;
      state?: string;
      created_gte?: number;
    } = {}
  ): Promise<SnapshotProposal[]> {
    // Build where clause dynamically
    const whereClause: any = {
      space_in: [space],
    };

    if (options.state && options.state !== 'all') {
      whereClause.state = options.state;
    }

    if (options.created_gte) {
      whereClause.created_gte = options.created_gte;
    }

    const query = `
      query Proposals($where: ProposalWhere!, $first: Int!) {
        proposals(
          first: $first
          where: $where
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
          created
          space {
            id
            name
          }
        }
      }
    `;

    const variables = {
      where: whereClause,
      first: options.first || 100,
    };

    const response = await this.query<{ proposals: SnapshotProposal[] }>(
      query,
      variables
    );

    return response.proposals;
  }

  /**
   * Fetch votes for a specific proposal
   */
  async getVotes(proposalId: string, first = 1000): Promise<SnapshotVote[]> {
    const query = `
      query {
        votes(
          first: ${first}
          where: { proposal_in: ["${proposalId}"] }
          orderBy: "vp"
          orderDirection: desc
        ) {
          id
          voter
          vp
          choice
          created
          reason
        }
      }
    `;

    try {
      const response = await this.query<{ votes: SnapshotVote[] | null }>(
        query,
        {} // No variables needed now
      );

      console.log(`    [DEBUG] Votes response for ${proposalId}:`, JSON.stringify(response).substring(0, 200));

      // Handle null or undefined votes
      if (!response.votes || !Array.isArray(response.votes)) {
        console.log(`    [DEBUG] Votes is null or not array:`, response.votes);
        return [];
      }

      return response.votes;
    } catch (error) {
      console.error(`    [ERROR] Exception fetching votes for ${proposalId}:`, error);
      return [];
    }
  }

  /**
   * Fetch space information
   */
  async getSpace(spaceId: string) {
    const query = `
      query Space($id: String!) {
        space(id: $id) {
          id
          name
          about
          network
          symbol
          members
          strategies {
            name
            params
          }
        }
      }
    `;

    const response = await this.query<{ space: any }>(query, { id: spaceId });
    return response.space;
  }

  /**
   * Generic GraphQL query method
   */
  private async query<T>(
    query: string,
    variables: Record<string, any> = {}
  ): Promise<T> {
    console.log(`    [DEBUG] Sending query to ${this.apiUrl}`);
    console.log(`    [DEBUG] Query:`, query.substring(0, 150));

    // Only include variables in the body if they exist
    const body: any = { query };
    if (Object.keys(variables).length > 0) {
      body.variables = variables;
    }

    console.log(`    [DEBUG] Request body:`, JSON.stringify(body).substring(0, 300));

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log(`    [DEBUG] Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`    [DEBUG] Error response:`, errorText);
      throw new Error(`Snapshot API error: ${response.statusText}`);
    }

    const rawData = await response.json();
    console.log(`    [DEBUG] Raw response:`, JSON.stringify(rawData).substring(0, 300));

    const data: GraphQLResponse<T> = rawData;
    return data.data;
  }
}
