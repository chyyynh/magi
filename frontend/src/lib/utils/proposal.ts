import { fetchProposal } from "@/app/api/snapshot";

export interface Proposal {
  id: string;
  title: string;
  body: string;
  choices: string[];
  start: number;
  end: number;
  state: string;
  author: string;
  space: {
    id: string;
    name: string;
  };
  scores_total: number;
  scores: number[];
  votes: {
    voter: string;
    choice: number;
    vp: number;
  }[];
}

export interface ProposalResult {
  success: boolean;
  message: string;
  data: Proposal | null;
}

export async function getProposal(proposalId: string): Promise<ProposalResult> {
  try {
    // Extract proposal ID from URL if needed
    const proposalIdRegex =
      /https:\/\/snapshot\.box\/#\/[^/]+\/proposal\/([0-9a-fA-Fx]+)/;
    const match = proposalId.match(proposalIdRegex);
    const proposalIdToFetch = match ? match[1] : proposalId;

    console.log("Fetching proposal ID:", proposalIdToFetch);
    const proposalData = await fetchProposal(proposalIdToFetch);
    console.log("Proposal Data:", proposalData);

    if (!proposalData) {
      throw new Error("No proposal data returned");
    }

    return {
      success: true,
      message: `Successfully loaded proposal: ${proposalData.title}`,
      data: proposalData as Proposal,
    };
  } catch (error) {
    console.error("Error fetching proposal:", error);
    return {
      success: false,
      message: "Error loading proposal. Please check the ID and try again.",
      data: null,
    };
  }
}
