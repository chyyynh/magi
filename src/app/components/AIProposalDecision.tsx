"use client";

import { useEffect, useState } from "react";
import { getBalthasar2Decision } from "@/app/utils/aiService";
import { getProposal } from "@/app/utils/proposalUtils";
import { useAIStore } from "@/app/store/aiStore";

interface AIProposalDecisionProps {
  proposalID: string;
}

export default function AIProposalDecision({
  proposalID,
}: AIProposalDecisionProps) {
  const [decision, setDecision] = useState<string>("Pending...");
  const [color, setColor] = useState<string>("text-white");
  const setAIVotingResult = useAIStore((state) => state.setAIVotingResult);

  useEffect(() => {
    async function getDecision() {
      const proposalResult = await getProposal(proposalID);
      if (proposalResult.success && proposalResult.data) {
        const balthasar2Decision = await getBalthasar2Decision(
          proposalResult.data
        );
        try {
          const parsedDecision = JSON.parse(
            balthasar2Decision.replace("BALTHASAR·2: ", "")
          );
          if (parsedDecision.recommendation.toLowerCase().includes("for")) {
            setColor("text-green-500");
          } else {
            setColor("text-red-500");
          }
          const decisionString = JSON.stringify(parsedDecision, null, 2);
          setDecision(decisionString);
          setAIVotingResult(decisionString);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          setDecision("Error parsing decision");
          setColor("text-white");
          setAIVotingResult("Error parsing decision");
        }
      } else {
        setDecision("Error fetching proposal");
        setColor("text-white");
        setAIVotingResult("Error fetching proposal");
      }
    }

    getDecision();
  }, [proposalID, setAIVotingResult]);

  return <div className={color}>{decision}</div>;
}
