// Agent Framework Types

export type AgentId = 'melchior' | 'balthasar' | 'casper';

export interface AgentConfig {
  id: AgentId;
  name: string;           // 'OpenAI' | 'Claude' | 'Gemini'
  displayName: string;    // 'MELCHIOR·1' | 'BALTHASAR·2' | 'CASPER·3'
  provider: 'openai' | 'anthropic' | 'google';
  color: string;
  model?: string;
}

export interface AgentState {
  status: 'idle' | 'processing' | 'complete' | 'error';
  response: string | null;
  error: string | null;
  startTime: number | null;
  endTime: number | null;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agentId: AgentId;
  timestamp: number;
}

// Agent configurations
export const AGENT_CONFIGS: Record<AgentId, AgentConfig> = {
  melchior: {
    id: 'melchior',
    name: 'OpenAI',
    displayName: 'MELCHIOR·1',
    provider: 'openai',
    color: '#FF6600',
  },
  balthasar: {
    id: 'balthasar',
    name: 'Claude',
    displayName: 'BALTHASAR·2',
    provider: 'anthropic',
    color: '#7C3AED',
  },
  casper: {
    id: 'casper',
    name: 'Gemini',
    displayName: 'CASPER·3',
    provider: 'google',
    color: '#10B981',
  },
};

// Helper to get all agent IDs
export const AGENT_IDS: AgentId[] = ['melchior', 'balthasar', 'casper'];

// Initial agent states
export const createInitialAgentStates = (): Record<AgentId, AgentState> => ({
  melchior: { status: 'idle', response: null, error: null, startTime: null, endTime: null },
  balthasar: { status: 'idle', response: null, error: null, startTime: null, endTime: null },
  casper: { status: 'idle', response: null, error: null, startTime: null, endTime: null },
});
