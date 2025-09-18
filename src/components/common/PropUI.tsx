"use client";

import ReactMarkdown from "react-markdown";

interface PropUIProps {
  content?: string;
  choices?: string[];
}

export default function PropUI({ content, choices }: PropUIProps) {
  return (
    <div className="flex flex-col h-full border-r border-[#FF6600]/50 bg-black text-white font-[family-name:var(--font-fraunces)] p-4 overflow-y-auto hide-scrollbar">
      <div className="mt-2 text-sm flex-1 flex flex-col min-h-0">
        <div className="text-[#FF6600] font-semibold mb-3 tracking-wide">PROPOSAL DETAILS</div>
        {content ? (
          <div className="bg-gray-900/30 border border-gray-700/50 rounded-lg backdrop-blur-sm flex-1 flex flex-col min-h-0">
            <div className="relative flex-1 min-h-0">
              <div
                className="overflow-y-auto h-full p-4"
              >
                  <div className="prose prose-invert prose-sm max-w-none text-gray-200 leading-relaxed">
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
                    {content}
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
          {Array.isArray(choices) && choices.length > 0 ? (
            <div className="space-y-2">
              {choices.map((choice, index) => {
                // Define colors for common voting choices
                const getChoiceStyle = (choice: string) => {
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
                };

                return (
                  <div
                    key={index}
                    className={`${getChoiceStyle(choice)} border px-3 py-2 rounded-lg text-xs transition-all duration-200 cursor-pointer transform hover:scale-[1.01] hover:shadow-sm backdrop-blur-sm`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{choice}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></div>
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
