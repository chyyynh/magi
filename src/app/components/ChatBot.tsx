"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { getProposal, type Proposal } from "../utils/proposalUtils";
import { getGeminiDecision } from "@/app/utils/aiService";

interface Message {
  id: string;
  text: string;
  sender: "user" | "system";
  isAIResult?: boolean;
  timestamp: Date;
  isLoading?: boolean;
}

interface ChatBotProps {
  onProposalLoaded: (
    proposal: Proposal | null,
    geminiDecisionLoading: boolean,
    geminiDecision: string | null
  ) => void;
}

export default function ChatBot({ onProposalLoaded }: ChatBotProps) {
  const [input, setInput] = useState("");
  // const [geminiDecisionLoading, setGeminiDecisionLoading] = useState(false);
  const [geminiDecision, setGeminiDecision] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  console.log(geminiDecision);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Welcome to MAGI System. Please enter a Snapshot proposal link or ID.",
      sender: "system",
      timestamp: new Date(),
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Check if input looks like a Snapshot link or ID
    if (input.includes("snapshot") || input.startsWith("0x")) {
      // Add loading message
      const loadingMsgId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        {
          id: loadingMsgId,
          text: "Fetching proposal data...",
          sender: "system",
          timestamp: new Date(),
          isLoading: true,
        },
      ]);

      setIsLoading(true);
      onProposalLoaded(null, true, null);

      try {
        const result = await getProposal(input);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === loadingMsgId
              ? {
                  ...msg,
                  text: result.message,
                  isLoading: false,
                }
              : msg
          )
        );

        // If successful, add details message
        if (result.success && result.data) {
          onProposalLoaded(result.data, true, null);
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                text: `Proposal "${
                  result.data?.title
                }" loaded into MAGI system. ${
                  result.data?.choices?.length || 0
                } choices available.`,
                sender: "system",
                timestamp: new Date(),
              },
            ]);
          }, 500);
          try {
            const geminiDecisionResult = await getGeminiDecision(result.data);
            setGeminiDecision(geminiDecisionResult.decision);
            onProposalLoaded(result.data, false, geminiDecisionResult.decision);
            console.log(
              `Updating messages for Gemini Decision: ${geminiDecisionResult}`
            );
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now().toString(),
                text: `Gemini Decision: ${geminiDecisionResult.decision}: ${geminiDecisionResult.reason}`,
                sender: "system",
                timestamp: new Date(),
              },
            ]);
          } catch (error) {
            console.error("Error in getGeminiDecision:", error);
          }
        }
      } catch (error) {
        // Handle error
        console.error("Error fetching proposal:", error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === loadingMsgId
              ? {
                  ...msg,
                  text: "Error fetching proposal. Please check the ID and try again.",
                  isLoading: false,
                }
              : msg
          )
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      // Generic response for non-proposal inputs
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            text: "Please enter a valid Snapshot proposal link or ID (starting with 0x).",
            sender: "system",
            timestamp: new Date(),
          },
        ]);
      }, 300);
    }
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-full border-l border-[#FF6600]/50 bg-black text-white font-mono">
      {/* Scrollable messages container */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
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
              <div className="flex items-center gap-2">
                {message.isLoading && (
                  <Loader2 className="animate-spin h-4 w-4" />
                )}
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
            <span className="text-xs text-gray-500 mt-1">
              {formatTime(message.timestamp)}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed input area */}
      <div className="flex-none p-4 border-t border-[#FF6600]/50 bg-black">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter Snapshot link or ID..."
            disabled={isLoading}
            className="bg-gray-900 border-gray-700 text-white"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="bg-[#FF6600] hover:bg-[#FF6600]/80"
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
