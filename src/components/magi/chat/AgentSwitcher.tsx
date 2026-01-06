"use client";

import React from "react";
import { type AgentId, AGENT_CONFIGS, AGENT_IDS } from "@/types";

interface AgentSwitcherProps {
  activeAgent: AgentId;
  onAgentChange: (agentId: AgentId) => void;
  className?: string;
}

export const AgentSwitcher: React.FC<AgentSwitcherProps> = ({
  activeAgent,
  onAgentChange,
  className = "",
}) => {
  return (
    <div className={`flex border-b border-[#FF6600]/30 ${className}`}>
      {AGENT_IDS.map((agentId) => {
        const config = AGENT_CONFIGS[agentId];
        const isActive = activeAgent === agentId;

        return (
          <button
            key={agentId}
            onClick={() => onAgentChange(agentId)}
            className={`
              flex-1 px-3 py-2 font-mono text-xs transition-all
              border-b-2 hover:bg-white/5
              ${isActive ? "border-current" : "border-transparent"}
            `}
            style={{
              color: isActive ? config.color : "#666",
              borderColor: isActive ? config.color : "transparent",
            }}
          >
            <div className="flex items-center justify-center gap-1.5">
              <div
                className={`w-1.5 h-1.5 rounded-full ${isActive ? "magi-pulse" : ""}`}
                style={{ backgroundColor: config.color }}
              />
              <span className="hidden sm:inline">{config.displayName}</span>
              <span className="sm:hidden">{config.name}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default AgentSwitcher;
