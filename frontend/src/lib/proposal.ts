// Pure proposal business logic
// "One function, one job" - Linus principle

import { Proposal } from './types';

export interface ProposalButton {
  id: string;
  title: string;
  url: string;
}

// Hardcoded proposals - now using direct URL paths
export const AVAILABLE_PROPOSALS: ProposalButton[] = [
  {
    id: "0x1b0ea13a62517fb9a7ee9cb770867d3d0d50529ed84b65c7e6f5fdd3ab728359",
    title: "Morpho Proposal #1",
    url: "/0x1b0ea13a62517fb9a7ee9cb770867d3d0d50529ed84b65c7e6f5fdd3ab728359"
  },
  {
    id: "0x5f6edc0f0a256995c17d7794d1e35505cd70f9c2312285aadc52c37195bf9106",
    title: "Morpho Proposal #2",
    url: "/0x5f6edc0f0a256995c17d7794d1e35505cd70f9c2312285aadc52c37195bf9106"
  },
  {
    id: "0x25b9a39372db49d7872e19ea2e354a30d2670748fcfff85caeaf84b0df99b5ab",
    title: "Morpho Proposal #3",
    url: "/0x25b9a39372db49d7872e19ea2e354a30d2670748fcfff85caeaf84b0df99b5ab"
  },
  {
    id: "0xc9b2df92ca61304a267dbf8470ceb0310cf8eb2e68cffbd99fecf964c1dbe369",
    title: "AAVE DAO Proposal",
    url: "/0xc9b2df92ca61304a267dbf8470ceb0310cf8eb2e68cffbd99fecf964c1dbe369"
  }
];

// Pure function - loads proposal data
export async function loadProposal(proposalId: string): Promise<Proposal> {
  // Import here to avoid circular dependencies
  const { fetchProposal } = await import('@/app/api/snapshot');
  return fetchProposal(proposalId);
}

// Pure function - formats proposal for chatbot context
export function formatProposalContext(proposal: Proposal): string {
  return `
CURRENT PROPOSAL CONTEXT:
Title: ${proposal.title}
Author: ${proposal.author}
Space: ${proposal.space.name}
State: ${proposal.state}
Choices: ${proposal.choices.join(', ')}

Proposal Body:
${proposal.body}

Instructions: You are now analyzing the above governance proposal. Please answer any questions about this proposal based on the provided information. Be helpful and provide detailed analysis when asked.
  `.trim();
}

// Pure function - gets choice style for voting UI
export function getChoiceStyle(choice: string, isRecommended: boolean = false): string {
  if (isRecommended) {
    return "bg-[#FF6600]/20 border-[#FF6600] text-[#FF6600] shadow-lg shadow-[#FF6600]/25";
  }

  const lowerChoice = choice.toLowerCase();

  if (lowerChoice.includes('for') || lowerChoice.includes('yes') || lowerChoice.includes('支持')) {
    return "bg-emerald-500/10 border-emerald-400/30 text-emerald-300";
  } else if (lowerChoice.includes('against') || lowerChoice.includes('no') || lowerChoice.includes('反對')) {
    return "bg-red-500/10 border-red-400/30 text-red-300";
  } else if (lowerChoice.includes('abstain') || lowerChoice.includes('棄權')) {
    return "bg-amber-500/10 border-amber-400/30 text-amber-300";
  } else {
    return "bg-[#FF6600]/10 border-[#FF6600]/30 text-[#FF6600]";
  }
}

// Pure function - validates proposal ID format
export function isValidProposalId(id: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(id);
}

// Pure function - extracts proposal ID from snapshot URL
export function extractProposalIdFromUrl(url: string): string | null {
  const match = url.match(/proposal\/(0x[a-fA-F0-9]{64})/);
  return match ? match[1] : null;
}