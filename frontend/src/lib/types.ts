// Core application types - the foundation of everything
// Following Linus principle: "Good data structures make everything else easy"

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

export interface Decision {
  choice: string;
  confidence: number;
  reasoning: string;
}

export interface NodeState {
  id: 'balthasar' | 'casper' | 'melchior';
  color: string;
  active: boolean;
}

export interface MAGIState {
  decision: Decision | null;
  processing: boolean;
  nodes: {
    balthasar: NodeState;
    casper: NodeState;
    melchior: NodeState;
  };
}

export interface ProposalState {
  current: Proposal | null;
  loading: boolean;
  error: string | null;
  context: string | null; // For chatbot
}

export interface UIState {
  view: 'selection' | 'analysis';
  layout: 'mobile' | 'desktop';
  chatbot: {
    open: boolean;
    context: string | null;
  };
}

export interface AppState {
  proposal: ProposalState;
  magi: MAGIState;
  ui: UIState;
}

// Actions for state management
export type AppAction =
  | { type: 'PROPOSAL_LOAD_START' }
  | { type: 'PROPOSAL_LOAD_SUCCESS'; proposal: Proposal }
  | { type: 'PROPOSAL_LOAD_ERROR'; error: string }
  | { type: 'MAGI_DECISION_START' }
  | { type: 'MAGI_DECISION_SUCCESS'; decision: Decision }
  | { type: 'MAGI_DECISION_ERROR'; error: string }
  | { type: 'UI_SET_VIEW'; view: UIState['view'] }
  | { type: 'UI_SET_LAYOUT'; layout: UIState['layout'] }
  | { type: 'CHATBOT_SET_CONTEXT'; context: string | null };

// Initial state
export const initialAppState: AppState = {
  proposal: {
    current: null,
    loading: false,
    error: null,
    context: null,
  },
  magi: {
    decision: null,
    processing: false,
    nodes: {
      balthasar: { id: 'balthasar', color: '#FF6600', active: false },
      casper: { id: 'casper', color: '#FF6600', active: false },
      melchior: { id: 'melchior', color: '#FF6600', active: false },
    },
  },
  ui: {
    view: 'selection',
    layout: 'desktop',
    chatbot: {
      open: false,
      context: null,
    },
  },
};