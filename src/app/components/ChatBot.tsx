import { useChatBot } from "@/app/hooks/useChatBot";
// Replace Input with Textarea
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { type Proposal } from "@/app/utils/proposalUtils";

interface ChatBotProps {
  onProposalLoaded: (
    proposal: Proposal | null,
    geminiLoading: boolean,
    geminiDecision: string | null
  ) => void;
}

export default function ChatBot({ onProposalLoaded }: ChatBotProps) {
  const {
    input,
    setInput,
    messages,
    isLoading,
    messagesEndRef,
    handleSendMessage,
    handleVote,
  } = useChatBot((proposal, geminiLoading, geminiDecision) => {
    onProposalLoaded(proposal, geminiLoading, geminiDecision);
  });

  // Update handleKeyDown for Textarea (send on Enter, allow Shift+Enter for new lines)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault(); // Prevent default Enter behavior (new line)
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-full border-l border-[#FF6600]/50 bg-black text-white font-mono">
      {/* Message display area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 hide-scrollbar">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col ${
              message.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[80%] px-3 py-2 rounded-md ${
                message.sender === "user"
                  ? "bg-[#00AAFF]/30 border border-[#00AAFF]/50"
                  : "bg-[#FF6600]/20 border border-[#FF6600]/50"
              }`}
            >
              {/* Apply text wrapping styles to message text */}
              <div className="flex items-center gap-2">
                {message.isLoading && (
                  <Loader2 className="animate-spin h-4 w-4" />
                )}
                {/* Smaller text on mobile, ensure wrapping */}
                <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">
                  {message.text}
                </p>
              </div>
              {(message.buttons ?? []).length > 0 && (
                <div className="mt-2 flex gap-2">
                  {(message.buttons ?? []).map((button) => (
                    <button
                      key={button.text}
                      onClick={() => {
                        if (button.action === "snapshot vote") {
                          handleVote();
                        }
                      }}
                      // Smaller text on mobile
                      className="text-[10px] sm:text-xs bg-[#FF6600] hover:bg-[#FF6600]/80 text-white px-2 py-1 rounded"
                    >
                      {button.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Smaller text on mobile */}
            <span className="text-[10px] sm:text-xs text-gray-500 mt-1">
              {formatTime(message.timestamp)}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="flex-none p-4 border-t border-[#FF6600]/50 bg-black">
        <div className="flex items-center space-x-2">
          {/* Use Textarea instead of Input */}
          <Textarea
            value={input}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setInput(e.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Enter Snapshot link or ID..."
            disabled={isLoading}
            rows={1} // Start with 1 row, allow expansion if needed via CSS
            // Apply styling for wrapping, appearance, and prevent manual resize
            className="bg-gray-900 border-gray-700 text-white text-xs sm:text-sm flex-1 resize-none overflow-hidden whitespace-pre-wrap break-words"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="bg-[#FF6600] hover:bg-[#FF6600]/80 self-end" // Align button to bottom if textarea grows
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
