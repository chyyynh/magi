import type { AgentId, AgentState } from './agents';

export interface LayoutProps {
  agentStates: Record<AgentId, AgentState>;
  currentTask: string | null;
  isExecuting: boolean;
  executeTask: (task: string) => void;
  resetAgents: () => void;
  bgColorBalthasar: string;
  bgColorCasper: string;
  bgColorMelchior: string;
  decisionText: Record<string, string>;
  notoSansTCClassName: string;
}

export interface Proposal {
  id: string;
  title: string;
  body: string;
  choices: string[];
  start: number;
  end: number;
  state: string;
  author: string;
  space: {
    id: string;
    name: string;
  };
  scores_total: number;
  scores: number[];
  votes: {
    voter: string;
    choice: number;
    vp: number;
  }[];
}
