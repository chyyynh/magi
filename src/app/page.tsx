"use client";

import ChatBot from "@/app/components/ChatBot";
import MagiInterface from "@/app/components/magi-ui";
import PropUI from "@/app/components/PropUI";
import { useState, useCallback } from "react";

interface Proposal {
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

export default function Page() {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [proposalID, setProposalID] = useState<string | null>(null);

  const handleProposalLoaded = useCallback(
    (proposal: Proposal | null, proposalID: string | null) => {
      setProposal(proposal);
      setProposalID(proposalID);
    },
    [setProposal, setProposalID]
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex-col p-4 border-b border-[#FF6600]/50 bg-black">
        <h2 className="text-3xl font-bold text-[#FF6600]">MAGI TERMINAL</h2>
      </div>
      <div className="flex flex-row overflow-hidden flex-grow">
        <div className="w-1/5">
          <PropUI
            content={proposal?.body || ""}
            choices={proposal?.choices || []}
          />
        </div>
        <div className="w-3/5">
          <MagiInterface
            proposalID={proposalID!}
            title={proposal?.title || ""}
          />
        </div>
        <div className="w-1/5">
          <ChatBot
            onProposalLoaded={(proposal) =>
              handleProposalLoaded(proposal, proposalID)
            }
          />
        </div>
      </div>
    </div>
  );
}
