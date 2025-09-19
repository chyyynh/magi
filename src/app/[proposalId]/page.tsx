"use client";

// Dynamic route for individual proposals
// URL format: /0x1b0ea13a62517fb9a7ee9cb770867d3d0d50529ed84b65c7e6f5fdd3ab728359

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import NewApp from '@/components/NewApp';
import { useLoadProposal } from '@/lib/store';
import { isValidProposalId } from '@/lib/proposal';

export default function ProposalPage() {
  const params = useParams();
  const proposalId = params?.proposalId as string;
  const loadProposal = useLoadProposal();

  useEffect(() => {
    if (proposalId && isValidProposalId(proposalId)) {
      // Automatically load the proposal when the page loads
      loadProposal(proposalId);
    }
  }, [proposalId, loadProposal]);

  // Show error for invalid proposal IDs
  if (proposalId && !isValidProposalId(proposalId)) {
    return (
      <div className="flex flex-col h-dvh overflow-hidden bg-black">
        <div className="flex p-4 border-b border-[#FF6600]/50 justify-between items-center">
          <h2 className="text-lg sm:text-3xl font-bold text-[#FF6600]">
            MAGI TERMINAL
          </h2>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold text-[#FF6600] mb-4">Invalid Proposal ID</h1>
            <p className="text-gray-400 mb-4">
              The proposal ID must be a valid 64-character hex string starting with "0x"
            </p>
            <a
              href="/"
              className="text-[#FF6600] hover:text-orange-400 underline"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Render the main app - it will automatically load the proposal
  return <NewApp />;
}