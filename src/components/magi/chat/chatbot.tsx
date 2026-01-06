"use client";

import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Response } from "@/components/ai-elements/response";
import { GlobeIcon } from "lucide-react";
import { type AgentId, AGENT_CONFIGS } from "@/types";

interface ChatbotProps {
  proposalContext?: string | null;
  agentId?: AgentId;
}

export default function Chatbot({ proposalContext, agentId = "melchior" }: ChatbotProps) {
  const config = AGENT_CONFIGS[agentId];
  const [input, setInput] = useState("");
  const [webSearch, setWebSearch] = useState(false);
  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  // Clear messages when agent changes
  useEffect(() => {
    setMessages([]);
  }, [agentId, setMessages]);

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    sendMessage(
      {
        text: message.text || "Sent with attachments",
        files: message.files,
      },
      {
        body: {
          agentId: agentId,
          webSearch: webSearch,
          proposalContext: proposalContext,
        },
      }
    );
    setInput("");
  };

  return (
    <div className="h-full">
      <div className="flex flex-col h-full p-4">
        {/* Agent Header */}
        <div className="mb-4 flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: config.color }}
          />
          <h3 className="text-sm font-mono font-semibold" style={{ color: config.color }}>
            {config.displayName} - {config.name}
          </h3>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 hide-scrollbar">
          {messages.length === 0 ? (
            <div className="text-sm text-gray-500 font-mono">
              Chat with {config.name} agent...
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 ${
                    message.role === "user"
                      ? "bg-white/10 text-white"
                      : "border"
                  }`}
                  style={{
                    borderColor: message.role === "assistant" ? `${config.color}50` : undefined,
                    backgroundColor: message.role === "assistant" ? `${config.color}10` : undefined,
                  }}
                >
                  {message.role === "user" ? (
                    <p className="text-sm">
                      {message.parts
                        ?.map((part) =>
                          part.type === "text" ? part.text : null
                        )
                        .join("") || "No content"}
                    </p>
                  ) : (
                    <Response className="prose prose-sm max-w-none prose-invert">
                      {message.parts
                        ?.map((part) =>
                          part.type === "text" ? part.text : null
                        )
                        .join("") || "No content"}
                    </Response>
                  )}
                </div>
              </div>
            ))
          )}
          {status === "streaming" && (
            <div className="flex justify-start">
              <div
                className="rounded-lg px-3 py-2 border"
                style={{ borderColor: `${config.color}50`, backgroundColor: `${config.color}10` }}
              >
                <div className="flex items-center space-x-1" style={{ color: config.color }}>
                  <div className="animate-pulse text-sm">●</div>
                  <div className="animate-pulse text-sm" style={{ animationDelay: "0.1s" }}>●</div>
                  <div className="animate-pulse text-sm" style={{ animationDelay: "0.2s" }}>●</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <PromptInput
          onSubmit={handleSubmit}
          className="mt-4"
          globalDrop
          multiple
        >
          <PromptInputBody>
            <PromptInputAttachments>
              {(attachment) => <PromptInputAttachment data={attachment} />}
            </PromptInputAttachments>
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
              placeholder={`Message ${config.name}...`}
            />
          </PromptInputBody>
          <PromptInputToolbar>
            <PromptInputTools>
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
              <PromptInputButton
                variant={webSearch ? "default" : "ghost"}
                onClick={() => setWebSearch(!webSearch)}
              >
                <GlobeIcon size={16} />
                <span>Search</span>
              </PromptInputButton>
            </PromptInputTools>
            <PromptInputSubmit disabled={!input && !status} status={status} />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
}
