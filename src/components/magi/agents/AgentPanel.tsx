"use client";

import React from "react";
import { type AgentId, type AgentState, AGENT_CONFIGS } from "@/types";
import { Loader2 } from "lucide-react";
import { Response } from "@/components/ai-elements/response";

interface AgentPanelProps {
  agentId: AgentId;
  state: AgentState;
  className?: string;
}

export const AgentPanel: React.FC<AgentPanelProps> = ({
  agentId,
  state,
  className = "",
}) => {
  const config = AGENT_CONFIGS[agentId];
  const { status, response, error, startTime, endTime } = state;

  // Calculate processing time
  const processingTime =
    startTime && endTime ? ((endTime - startTime) / 1000).toFixed(2) : null;

  // Status indicator styles
  const getStatusStyles = () => {
    switch (status) {
      case "processing":
        return "magi-processing";
      case "complete":
        return "";
      case "error":
        return "opacity-50";
      default:
        return "";
    }
  };

  // Status text
  const getStatusText = () => {
    switch (status) {
      case "idle":
        return "STANDBY";
      case "processing":
        return "PROCESSING";
      case "complete":
        return "COMPLETE";
      case "error":
        return "ERROR";
    }
  };

  return (
    <div
      className={`flex flex-col h-full bg-black border-2 ${className}`}
      style={{ borderColor: config.color }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{ borderColor: config.color, backgroundColor: `${config.color}10` }}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${getStatusStyles()}`}
            style={{ backgroundColor: config.color }}
          />
          <span className="font-mono font-bold" style={{ color: config.color }}>
            {config.displayName}
          </span>
        </div>
        <span className="text-xs font-mono text-gray-400">{config.name}</span>
      </div>

      {/* Status Bar */}
      <div
        className="px-4 py-1 text-xs font-mono border-b flex justify-between"
        style={{ borderColor: `${config.color}50` }}
      >
        <span style={{ color: config.color }}>{getStatusText()}</span>
        {processingTime && (
          <span className="text-gray-500">{processingTime}s</span>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 hide-scrollbar">
        {status === "idle" && (
          <div className="h-full flex items-center justify-center">
            <span className="text-gray-600 font-mono text-sm">
              Awaiting task...
            </span>
          </div>
        )}

        {status === "processing" && (
          <div className="h-full flex flex-col items-center justify-center gap-3">
            <Loader2
              className="w-8 h-8 animate-spin"
              style={{ color: config.color }}
            />
            <span className="text-gray-400 font-mono text-sm">
              Agent processing...
            </span>
          </div>
        )}

        {status === "complete" && response && (
          <Response className="prose prose-sm prose-invert max-w-none">
            {response}
          </Response>
        )}

        {status === "error" && (
          <div className="h-full flex flex-col items-center justify-center gap-2">
            <span className="text-red-500 font-mono text-sm">Error</span>
            {error && (
              <span className="text-gray-500 font-mono text-xs">{error}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentPanel;
