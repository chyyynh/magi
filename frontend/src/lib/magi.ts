// MAGI decision logic - separated from UI concerns
// "Business logic should not care about colors or animations"

import { Decision, NodeState } from './types';
import type { Proposal } from './types';

// Pure function - gets MAGI decision
export async function getMAGIDecision(proposal: Proposal): Promise<Decision> {
  // Import here to avoid circular dependencies
  const { getGeminiDecision } = await import('@/lib/services/ai');

  const result = await getGeminiDecision(proposal);

  return {
    choice: result.decision,
    confidence: 0.85, // TODO: extract from AI response
    reasoning: result.reason || "MAGI system analysis completed",
  };
}

// Pure function - calculates node colors based on decision
export function calculateNodeColors(decision: Decision | null): {
  balthasar: string;
  casper: string;
  melchior: string;
} {
  if (!decision) {
    return {
      balthasar: '#FF6600',
      casper: '#FF6600',
      melchior: '#FF6600',
    };
  }

  const color = getDecisionColor(decision.choice);

  return {
    balthasar: color,
    casper: color,
    melchior: color,
  };
}

// Pure function - determines decision color
export function getDecisionColor(choice: string): string {
  const lowerChoice = choice.toLowerCase();

  if (lowerChoice.includes('for') || lowerChoice.includes('yes') || lowerChoice.includes('支持')) {
    return '#00FF66';
  } else if (lowerChoice.includes('against') || lowerChoice.includes('no') || lowerChoice.includes('反對')) {
    return '#FF4444';
  } else {
    return '#FF6600';
  }
}

// Pure function - gets localized decision text
export function getDecisionText(choice: string): string {
  const decisionTexts: Record<string, string> = {
    'For': '支持',
    'Against': '反對',
    'Abstain': '棄權',
  };

  return decisionTexts[choice] || '未知';
}

// Pure function - determines if MAGI is processing
export function isMAGIProcessing(nodes: { [key: string]: NodeState }): boolean {
  return Object.values(nodes).some(node => node.active);
}

// Animation intervals for UI - these can be moved to UI layer later
export const MAGI_ANIMATION_INTERVALS = {
  balthasar: 150,
  casper: 250,
  melchior: 350,
} as const;