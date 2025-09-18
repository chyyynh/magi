export interface LayoutProps {
  proposal: Proposal | null; // Add proposal state
  geminiDecisionLoading: boolean;
  geminiDecision: string | null;
  bgColorBalthasar: string;
  bgColorCasper: string;
  bgColorMelchior: string;
  decisionText: Record<string, string>;
  notoSansTCClassName: string;
  onProposalLoaded: (
    proposal: Proposal | null,
    geminiLoading: boolean,
    geminiDecision: string | null
  ) => void;
  onProposalContextUpdate?: (context: string | null) => void;
  proposalContext?: string | null;
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
