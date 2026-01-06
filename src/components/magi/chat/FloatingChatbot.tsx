"use client";

import { useState } from "react";
import Chatbot from "./chatbot";
import AgentSwitcher from "./AgentSwitcher";
import { type AgentId, AGENT_CONFIGS } from "@/types";

interface FloatingChatbotProps {
  proposalContext?: string | null;
}

export default function FloatingChatbot({ proposalContext }: FloatingChatbotProps) {
  const [activeAgent, setActiveAgent] = useState<AgentId>("melchior");
  const config = AGENT_CONFIGS[activeAgent];

  return (
    <>
      {/* Floating Chatbot */}
      <div className="fixed top-20 right-4 bottom-4 w-96 transform translate-x-full transition-transform duration-300 ease-in-out hover:translate-x-0 group z-50">
        {/* Hover trigger area */}
        <div className="absolute left-0 top-0 w-4 h-full bg-transparent"></div>

        {/* Chatbot container */}
        <div
          className="h-full bg-black rounded-2xl border-2 shadow-none flex flex-col overflow-hidden transition-colors duration-300"
          style={{ borderColor: config.color }}
        >
          {/* Agent Switcher */}
          <AgentSwitcher
            activeAgent={activeAgent}
            onAgentChange={setActiveAgent}
          />

          {/* Chatbot */}
          <div className="flex-1 overflow-hidden">
            <Chatbot
              proposalContext={proposalContext}
              agentId={activeAgent}
            />
          </div>
        </div>
      </div>

      {/* Hover indicator */}
      <div
        className="fixed top-1/2 right-0 transform -translate-y-1/2 w-1 h-20 rounded-l-md transition-all duration-300 hover:opacity-100 opacity-30"
        style={{ backgroundColor: config.color }}
      />
    </>
  );
}
