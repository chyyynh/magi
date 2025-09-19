// Pure proposal display component
// "UI components should render data, not fetch it" - Linus principle

"use client";

import ReactMarkdown from "react-markdown";
import { Proposal } from '@/lib/types';
import { getChoiceStyle } from '@/lib/proposal';

interface ProposalViewerProps {
  proposal: Proposal;
  recommendedChoice?: string;
  onVote?: (choice: string) => void;
  onBack?: () => void;
}

export default function ProposalViewer({
  proposal,
  recommendedChoice,
  onVote,
  onBack
}: ProposalViewerProps) {
  return (
    <div className="flex flex-col h-full border-r border-[#FF6600]/50 bg-black text-white font-[family-name:var(--font-fraunces)] p-4 overflow-y-auto hide-scrollbar">
      <div className="mt-2 text-sm flex-1 flex flex-col min-h-0">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-[#FF6600] font-semibold tracking-wide">PROPOSAL DETAILS</div>
          {onBack && (
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-white text-xs px-2 py-1 border border-gray-600 rounded hover:border-[#FF6600]/50 transition-colors"
            >
              ← Back
            </button>
          )}
        </div>

        {/* Proposal Content */}
        <div className="bg-gray-900/30 border border-gray-700/50 rounded-lg backdrop-blur-sm flex-1 flex flex-col min-h-0">
          <div className="relative flex-1 min-h-0">
            <div className="overflow-y-auto h-full p-4">
              <div className="prose prose-invert prose-sm max-w-none text-gray-200 leading-relaxed">
                {/* Proposal Header */}
                <div className="mb-4">
                  <h1 className="text-lg font-bold text-white mb-2">{proposal.title}</h1>
                  <div className="text-xs text-gray-400 mb-2">
                    by {proposal.author} • {proposal.space.name} • {proposal.state}
                  </div>
                </div>

                {/* Proposal Body */}
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
                  {proposal.body}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>

        {/* Voting Options */}
        <div className="text-sm mt-4 border-t border-[#FF6600]/30 pt-4">
          <div className="text-[#FF6600] font-semibold mb-3 tracking-wide">VOTING OPTIONS</div>
          {proposal.choices && proposal.choices.length > 0 ? (
            <div className="space-y-2">
              {proposal.choices.map((choice, index) => {
                const isRecommended = recommendedChoice === choice;
                const choiceStyle = getChoiceStyle(choice, isRecommended);

                return (
                  <button
                    key={index}
                    onClick={() => onVote?.(choice)}
                    className={`${choiceStyle} border px-3 py-2 rounded-lg text-xs transition-all duration-200 cursor-pointer transform hover:scale-[1.01] hover:shadow-sm backdrop-blur-sm w-full text-left ${
                      isRecommended ? 'ring-1 ring-[#FF6600]/50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-medium">{choice}</span>
                        {isRecommended && (
                          <span className="text-[8px] mt-0.5 font-bold bg-[#FF6600] text-black px-1 py-0.5 rounded-sm inline-block w-fit">
                            MAGI RECOMMENDED
                          </span>
                        )}
                      </div>
                      <div className={`w-1.5 h-1.5 rounded-full bg-current ${
                        isRecommended ? 'opacity-100 animate-pulse' : 'opacity-60'
                      }`}></div>
                    </div>
                  </button>
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
    </div>
  );
}