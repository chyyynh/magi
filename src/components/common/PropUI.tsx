"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { fetchProposal } from "@/app/api/snapshot";
import { getGeminiDecision } from "@/lib/api/aiService";
import type { Proposal } from "@/lib/api/proposalUtils";

interface ProposalButton {
  id: string;
  title: string;
  url: string;
}

interface PropUIProps {
  content?: string;
  choices?: string[];
  onProposalLoaded?: (
    proposal: Proposal | null,
    geminiDecisionLoading: boolean,
    geminiDecision: string | null
  ) => void;
  onProposalContextUpdate?: (proposalContext: string | null) => void;
}

const PROPOSALS: ProposalButton[] = [
  {
    id: "0x1b0ea13a62517fb9a7ee9cb770867d3d0d50529ed84b65c7e6f5fdd3ab728359",
    title: "Morpho Proposal #1",
    url: "https://snapshot.box/#/s:morpho.eth/proposal/0x1b0ea13a62517fb9a7ee9cb770867d3d0d50529ed84b65c7e6f5fdd3ab728359"
  },
  {
    id: "0x5f6edc0f0a256995c17d7794d1e35505cd70f9c2312285aadc52c37195bf9106",
    title: "Morpho Proposal #2",
    url: "https://snapshot.box/#/s:morpho.eth/proposal/0x5f6edc0f0a256995c17d7794d1e35505cd70f9c2312285aadc52c37195bf9106"
  },
  {
    id: "0x25b9a39372db49d7872e19ea2e354a30d2670748fcfff85caeaf84b0df99b5ab",
    title: "Morpho Proposal #3",
    url: "https://snapshot.box/#/s:morpho.eth/proposal/0x25b9a39372db49d7872e19ea2e354a30d2670748fcfff85caeaf84b0df99b5ab"
  },
  {
    id: "0xc9b2df92ca61304a267dbf8470ceb0310cf8eb2e68cffbd99fecf964c1dbe369",
    title: "AAVE DAO Proposal",
    url: "https://snapshot.box/#/s:aavedao.eth/proposal/0xc9b2df92ca61304a267dbf8470ceb0310cf8eb2e68cffbd99fecf964c1dbe369"
  }
];

export default function PropUI({ content, choices, onProposalLoaded, onProposalContextUpdate }: PropUIProps) {
  const [selectedProposal, setSelectedProposal] = useState<ProposalButton | null>(null);
  const [proposalData, setProposalData] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(false);
  const [geminiDecision, setGeminiDecision] = useState<string | null>(null);
  const [geminiDecisionLoading, setGeminiDecisionLoading] = useState(false);

  const handleProposalSelect = async (proposal: ProposalButton) => {
    setSelectedProposal(proposal);
    setLoading(true);
    setGeminiDecisionLoading(true);

    // Notify parent that loading started
    onProposalLoaded?.(null, true, null);

    try {
      const data = await fetchProposal(proposal.id);
      setProposalData(data);

      if (data) {
        // Notify parent with proposal data
        onProposalLoaded?.(data, true, null);

        // Create context for chatbot
        const proposalContext = `
CURRENT PROPOSAL CONTEXT:
Title: ${data.title}
Author: ${data.author}
Space: ${data.space.name}
State: ${data.state}
Choices: ${data.choices.join(', ')}

Proposal Body:
${data.body}

Instructions: You are now analyzing the above governance proposal. Please answer any questions about this proposal based on the provided information. Be helpful and provide detailed analysis when asked.
        `.trim();

        // Update chatbot context
        console.log('PropUI updating context:', {
          hasCallback: !!onProposalContextUpdate,
          contextLength: proposalContext.length,
          contextPreview: proposalContext.substring(0, 100) + '...'
        });
        onProposalContextUpdate?.(proposalContext);

        // Get Gemini decision
        const geminiResult = await getGeminiDecision(data);
        setGeminiDecision(geminiResult.decision);

        // Notify parent with final result
        onProposalLoaded?.(data, false, geminiResult.decision);
      }
    } catch (error) {
      console.error('Failed to fetch proposal:', error);
      setProposalData(null);
      onProposalLoaded?.(null, false, null);
      onProposalContextUpdate?.(null); // Clear context on error
    } finally {
      setLoading(false);
      setGeminiDecisionLoading(false);
    }
  };
  if (!selectedProposal) {
    // Show proposal selection
    return (
      <div className="flex flex-col h-full border-r border-[#FF6600]/50 bg-black text-white font-[family-name:var(--font-fraunces)] p-4 overflow-y-auto hide-scrollbar">
        <div className="mt-2 text-sm flex-1 flex flex-col min-h-0">
          <div className="text-[#FF6600] font-semibold mb-3 tracking-wide">SELECT PROPOSAL</div>
          <div className="space-y-3">
            {PROPOSALS.map((proposal) => (
              <button
                key={proposal.id}
                onClick={() => handleProposalSelect(proposal)}
                className="w-full bg-gray-900/30 border border-gray-700/50 rounded-lg p-4 text-left hover:bg-gray-800/50 hover:border-[#FF6600]/30 transition-all duration-200 backdrop-blur-sm"
              >
                <div className="text-white font-medium mb-2">{proposal.title}</div>
                <div className="text-gray-400 text-xs truncate">{proposal.url}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show proposal details
  return (
    <div className="flex flex-col h-full border-r border-[#FF6600]/50 bg-black text-white font-[family-name:var(--font-fraunces)] p-4 overflow-y-auto hide-scrollbar">
      <div className="mt-2 text-sm flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[#FF6600] font-semibold tracking-wide">PROPOSAL DETAILS</div>
          <button
            onClick={() => {
              setSelectedProposal(null);
              setProposalData(null);
            }}
            className="text-gray-400 hover:text-white text-xs px-2 py-1 border border-gray-600 rounded hover:border-[#FF6600]/50 transition-colors"
          >
            ← Back
          </button>
        </div>
        {loading ? (
          <div className="bg-gray-900/30 border border-gray-700/50 rounded-lg backdrop-blur-sm flex-1 flex flex-col min-h-0 items-center justify-center">
            <div className="text-[#FF6600] animate-pulse">Loading proposal...</div>
          </div>
        ) : proposalData || content ? (
          <div className="bg-gray-900/30 border border-gray-700/50 rounded-lg backdrop-blur-sm flex-1 flex flex-col min-h-0">
            <div className="relative flex-1 min-h-0">
              <div
                className="overflow-y-auto h-full p-4"
              >
                  <div className="prose prose-invert prose-sm max-w-none text-gray-200 leading-relaxed">
                  {proposalData && (
                    <div className="mb-4">
                      <h1 className="text-lg font-bold text-white mb-2">{proposalData.title}</h1>
                      <div className="text-xs text-gray-400 mb-2">
                        by {proposalData.author} • {proposalData.space.name} • {proposalData.state}
                      </div>
                    </div>
                  )}
                  <ReactMarkdown
                    components={{
                      h1: ({children}) => <h1 className="text-lg font-bold text-white mb-3 border-b border-gray-600 pb-2">{children}</h1>,
                      h2: ({children}) => <h2 className="text-base font-semibold text-white mb-2 mt-4">{children}</h2>,
                      h3: ({children}) => <h3 className="text-sm font-medium text-gray-100 mb-2 mt-3">{children}</h3>,
                      p: ({children}) => <p className="mb-3 text-gray-200 leading-relaxed">{children}</p>,
                      ul: ({children}) => <ul className="mb-3 space-y-1 pl-4">{children}</ul>,
                      ol: ({children}) => <ol className="mb-3 space-y-1 pl-4">{children}</ol>,
                      li: ({children}) => <li className="text-gray-200 marker:text-[#FF6600]">{children}</li>,
                      blockquote: ({children}) => <blockquote className="border-l-4 border-[#FF6600] pl-4 my-3 bg-[#FF6600]/5 py-2 rounded-r">{children}</blockquote>,
                      code: ({children}) => <code className="bg-black/50 px-2 py-1 rounded text-[#FF6600] text-xs font-mono">{children}</code>,
                      pre: ({children}) => <pre className="bg-black/70 border border-gray-600 p-3 rounded-lg overflow-x-auto text-xs">{children}</pre>,
                      strong: ({children}) => <strong className="text-white font-semibold">{children}</strong>,
                      em: ({children}) => <em className="text-gray-100 italic">{children}</em>,
                      a: ({children, href}) => <a href={href} className="text-[#FF6600] hover:text-orange-400 underline transition-colors">{children}</a>
                    }}
                  >
                    {proposalData ? proposalData.body : content}
                  </ReactMarkdown>
                  </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="bg-gray-500/10 border border-gray-500/30 px-4 py-3 rounded-lg text-gray-400">
            No proposal content available
          </div>
        )}
      </div>

      {/* Voting Options */}
        <div className="text-sm mt-4 border-t border-[#FF6600]/30 pt-4">
          <div className="text-[#FF6600] font-semibold mb-3 tracking-wide">VOTING OPTIONS</div>
          {((proposalData && Array.isArray(proposalData.choices) && proposalData.choices.length > 0) ||
            (Array.isArray(choices) && choices.length > 0)) ? (
            <div className="space-y-2">
              {(proposalData?.choices || choices || []).map((choice, index) => {
                const isRecommended = geminiDecision && choice === geminiDecision;

                // Define colors for common voting choices
                const getChoiceStyle = (choice: string) => {
                  const lowerChoice = choice.toLowerCase();

                  if (isRecommended) {
                    // MAGI recommended choice - special highlight
                    return "bg-[#FF6600]/20 border-[#FF6600] text-[#FF6600] shadow-lg shadow-[#FF6600]/25";
                  } else if (lowerChoice.includes('for') || lowerChoice.includes('yes') || lowerChoice.includes('支持')) {
                    return "bg-emerald-500/10 border-emerald-400/30 text-emerald-300";
                  } else if (lowerChoice.includes('against') || lowerChoice.includes('no') || lowerChoice.includes('反對')) {
                    return "bg-red-500/10 border-red-400/30 text-red-300";
                  } else if (lowerChoice.includes('abstain') || lowerChoice.includes('棄權')) {
                    return "bg-amber-500/10 border-amber-400/30 text-amber-300";
                  } else {
                    return "bg-[#FF6600]/10 border-[#FF6600]/30 text-[#FF6600]";
                  }
                };

                const handleVote = async (choice: string) => {
                  try {
                    // Call API to vote for the selected proposal
                    const response = await fetch('/api/vote', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        proposalId: selectedProposal.id,
                        choice: choice,
                        proposalUrl: selectedProposal.url
                      }),
                    });

                    if (response.ok) {
                      // Handle successful vote
                      console.log('Vote submitted successfully');
                    } else {
                      console.error('Failed to submit vote');
                    }
                  } catch (error) {
                    console.error('Error submitting vote:', error);
                  }
                };

                return (
                  <div
                    key={index}
                    onClick={() => handleVote(choice)}
                    className={`${getChoiceStyle(choice)} border px-3 py-2 rounded-lg text-xs transition-all duration-200 cursor-pointer transform hover:scale-[1.01] hover:shadow-sm backdrop-blur-sm ${
                      isRecommended ? 'ring-1 ring-[#FF6600]/50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-medium">{choice}</span>
                        {isRecommended && (
                          <span className="text-[8px] mt-0.5 font-bold bg-[#FF6600] text-black px-1 py-0.5 rounded-sm">
                            MAGI RECOMMENDED
                          </span>
                        )}
                      </div>
                      <div className={`w-1.5 h-1.5 rounded-full bg-current ${
                        isRecommended ? 'opacity-100 animate-pulse' : 'opacity-60'
                      }`}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-gray-500/10 border border-gray-500/30 px-3 py-2 rounded-lg text-gray-400 text-xs">
              No voting options available
            </div>
          )}
        </div>
    </div>
  );
}
