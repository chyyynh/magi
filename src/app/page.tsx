"use client";

// Removed unused imports: ChatBot, PropUI, useState, useCallback, Proposal
import MagiInterface from "@/app/components/magi-ui";
import { ConnectButton } from "@rainbow-me/rainbowkit";
// Removed Proposal type import as state is managed internally now

export default function Page() {
  // State related to proposal is now managed within MagiInterface
  // const [proposal, setProposal] = useState<Proposal | null>(null);
  // const [proposalID, setProposalID] = useState<string | null>(null); // Not needed
  // const [geminiDecisionLoading, setGeminiDecisionLoading] = useState(false);
  // const [geminiDecision, setGeminiDecision] = useState<string | null>(null);

  // Callback is now handled internally by MagiInterface
  // const handleProposalLoaded = useCallback(...)

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-black">
      {/* Header remains the same */}
      <div className="flex p-4 border-b border-[#FF6600]/50 justify-between items-center">
        <h2 className="text-lg sm:text-3xl font-bold text-[#FF6600]">
          MAGI TERMINAL
        </h2>
        <ConnectButton />
      </div>
      {/* Main content area now only renders MagiInterface */}
      {/* MagiInterface handles its internal layout (Desktop vs Mobile) */}
      <div className="flex-grow overflow-hidden">
        <MagiInterface />
      </div>
    </div>
  );
}
