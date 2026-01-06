"use client";

import { useEffect, useState, useCallback } from "react";
import useIsMobile from "@/hooks/useIsMobile";
import {
  type AgentId,
  type AgentState,
  AGENT_CONFIGS,
  AGENT_IDS,
  createInitialAgentStates,
} from "@/types";
import { DesktopLayout, MobileLayout } from "./layout/layout";

import { Noto_Serif_TC } from "next/font/google";

const notoSansTC = Noto_Serif_TC({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

// --- Main MagiInterface Component ---
export default function MagiInterface() {
  const isMobile = useIsMobile();

  // Multi-agent state management
  const [agentStates, setAgentStates] = useState<Record<AgentId, AgentState>>(
    createInitialAgentStates()
  );
  const [currentTask, setCurrentTask] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Update individual agent state
  const updateAgentState = useCallback(
    (agentId: AgentId, update: Partial<AgentState>) => {
      setAgentStates((prev) => ({
        ...prev,
        [agentId]: { ...prev[agentId], ...update },
      }));
    },
    []
  );

  // Execute task on all agents
  const executeTask = useCallback(
    async (task: string) => {
      setCurrentTask(task);
      setIsExecuting(true);

      // Set all agents to processing
      AGENT_IDS.forEach((id) => {
        updateAgentState(id, {
          status: "processing",
          response: null,
          error: null,
          startTime: Date.now(),
          endTime: null,
        });
      });

      // Simulate agent responses (will be replaced with actual API calls)
      // For now, just show the processing state
      setTimeout(() => {
        AGENT_IDS.forEach((id, index) => {
          setTimeout(() => {
            updateAgentState(id, {
              status: "complete",
              response: `[${AGENT_CONFIGS[id].name}] Response to: "${task}"\n\nThis is a placeholder response. Connect your ${AGENT_CONFIGS[id].name} agent SDK to enable real responses.`,
              endTime: Date.now(),
            });
          }, (index + 1) * 500); // Stagger completions
        });
        setTimeout(() => setIsExecuting(false), 2000);
      }, 500);
    },
    [updateAgentState]
  );

  // Reset all agents
  const resetAgents = useCallback(() => {
    setAgentStates(createInitialAgentStates());
    setCurrentTask(null);
    setIsExecuting(false);
  }, []);

  // Get background color for each agent based on state
  const getAgentColor = (agentId: AgentId): string => {
    const state = agentStates[agentId];
    const config = AGENT_CONFIGS[agentId];

    if (state.status === "processing") {
      return config.color;
    }
    if (state.status === "complete") {
      return config.color;
    }
    if (state.status === "error") {
      return "#FF4444";
    }
    return config.color;
  };

  // Blinking effect for processing agents
  const [blinkStates, setBlinkStates] = useState<Record<AgentId, boolean>>({
    melchior: false,
    balthasar: false,
    casper: false,
  });

  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];

    AGENT_IDS.forEach((id, index) => {
      if (agentStates[id].status === "processing") {
        const interval = setInterval(() => {
          setBlinkStates((prev) => ({ ...prev, [id]: !prev[id] }));
        }, 150 + index * 100);
        intervals.push(interval);
      } else {
        setBlinkStates((prev) => ({ ...prev, [id]: false }));
      }
    });

    return () => intervals.forEach(clearInterval);
  }, [agentStates]);

  // Get display color (with blink effect)
  const getDisplayColor = (agentId: AgentId): string => {
    if (agentStates[agentId].status === "processing") {
      return blinkStates[agentId] ? "#000000" : AGENT_CONFIGS[agentId].color;
    }
    return getAgentColor(agentId);
  };

  const decisionText = {
    For: "支持",
    Against: "反對",
  };

  // Layout props
  const layoutProps = {
    agentStates,
    currentTask,
    isExecuting,
    executeTask,
    resetAgents,
    bgColorBalthasar: getDisplayColor("balthasar"),
    bgColorCasper: getDisplayColor("casper"),
    bgColorMelchior: getDisplayColor("melchior"),
    decisionText,
    notoSansTCClassName: notoSansTC.className,
  };

  if (isMobile) {
    return <MobileLayout {...layoutProps} />;
  } else {
    return <DesktopLayout {...layoutProps} />;
  }
}
