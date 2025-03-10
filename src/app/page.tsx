"use client";

import ChatBot from "@/app/components/ChatBot";
import MagiInterface from "@/app/components/magi-ui";
import { useState } from "react";

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

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-4/5 h-full">
        <MagiInterface
          proposalID={proposal?.id || ""}
          title={proposal?.title || ""}
          content={proposal?.body || ""}
          choices={proposal?.choices || []}
        />
      </div>
      <div className="w-1/5 h-full">
        <ChatBot onProposalLoaded={setProposal} />
      </div>
    </div>
  );
}
