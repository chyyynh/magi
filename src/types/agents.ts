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

// Agent configurations - Cyberpunk Monochrome
export const AGENT_CONFIGS: Record<AgentId, AgentConfig> = {
  melchior: {
    id: 'melchior',
    name: 'OpenAI',
    displayName: 'MELCHIOR-01',
    provider: 'openai',
    color: '#FFFFFF',
  },
  balthasar: {
    id: 'balthasar',
    name: 'Claude',
    displayName: 'BALTHASAR-02',
    provider: 'anthropic',
    color: '#CCCCCC',
  },
  casper: {
    id: 'casper',
    name: 'Gemini',
    displayName: 'CASPER-03',
    provider: 'google',
    color: '#999999',
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
