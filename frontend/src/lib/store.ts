// Zustand store - clean and simple state management
// "Good state management is invisible" - Linus principle

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Proposal, Decision, MAGIState, ProposalState, UIState } from './types';
import { loadProposal, formatProposalContext } from './proposal';
import { getMAGIDecision, calculateNodeColors } from './magi';

interface AppStore {
  // State
  proposal: ProposalState;
  magi: MAGIState;
  ui: UIState;

  // Actions
  loadProposal: (proposalId: string) => Promise<void>;
  vote: (choice: string) => Promise<void>;
  setView: (view: 'selection' | 'analysis') => void;
  setLayout: (layout: 'mobile' | 'desktop') => void;
  setChatbotContext: (context: string | null) => void;
  reset: () => void;
}

const initialState = {
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
      balthasar: { id: 'balthasar' as const, color: '#FF6600', active: false },
      casper: { id: 'casper' as const, color: '#FF6600', active: false },
      melchior: { id: 'melchior' as const, color: '#FF6600', active: false },
    },
  },
  ui: {
    view: 'selection' as const,
    layout: 'desktop' as const,
    chatbot: {
      open: false,
      context: null,
    },
  },
};

export const useAppStore = create<AppStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Load proposal and automatically start MAGI analysis
      loadProposal: async (proposalId: string) => {
        try {
          // Start loading
          set((state) => ({
            proposal: {
              ...state.proposal,
              loading: true,
              error: null,
            },
            ui: {
              ...state.ui,
              view: 'analysis',
            },
          }));

          // Load proposal data
          const proposal = await loadProposal(proposalId);
          const context = formatProposalContext(proposal);

          set((state) => ({
            proposal: {
              current: proposal,
              loading: false,
              error: null,
              context,
            },
            ui: {
              ...state.ui,
              chatbot: {
                ...state.ui.chatbot,
                context,
              },
            },
          }));

          // Start MAGI processing
          set((state) => ({
            magi: {
              ...state.magi,
              processing: true,
              nodes: {
                balthasar: { ...state.magi.nodes.balthasar, active: true },
                casper: { ...state.magi.nodes.casper, active: true },
                melchior: { ...state.magi.nodes.melchior, active: true },
              },
            },
          }));

          try {
            // Get MAGI decision
            const decision = await getMAGIDecision(proposal);
            const colors = calculateNodeColors(decision);

            set((state) => ({
              magi: {
                decision,
                processing: false,
                nodes: {
                  balthasar: { ...state.magi.nodes.balthasar, color: colors.balthasar, active: false },
                  casper: { ...state.magi.nodes.casper, color: colors.casper, active: false },
                  melchior: { ...state.magi.nodes.melchior, color: colors.melchior, active: false },
                },
              },
            }));
          } catch (magiError) {
            console.error('MAGI decision failed:', magiError);
            set((state) => ({
              magi: {
                ...state.magi,
                processing: false,
                nodes: {
                  balthasar: { ...state.magi.nodes.balthasar, active: false },
                  casper: { ...state.magi.nodes.casper, active: false },
                  melchior: { ...state.magi.nodes.melchior, active: false },
                },
              },
            }));
          }

        } catch (error) {
          console.error('Proposal loading failed:', error);
          set((state) => ({
            proposal: {
              ...state.proposal,
              loading: false,
              error: error instanceof Error ? error.message : 'Failed to load proposal',
            },
          }));
        }
      },

      // Vote on current proposal
      vote: async (choice: string) => {
        const { proposal } = get();
        if (!proposal.current) {
          console.error('No proposal loaded for voting');
          return;
        }

        try {
          // TODO: Implement actual voting logic
          // For now, just log the vote
          console.log('Voting:', {
            proposalId: proposal.current.id,
            choice,
            proposalUrl: `https://snapshot.box/#/s:${proposal.current.space.id}/proposal/${proposal.current.id}`
          });

          // In a real implementation, this would call an API:
          // const response = await fetch('/api/vote', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({
          //     proposalId: proposal.current.id,
          //     choice,
          //     proposalUrl: `https://snapshot.box/#/s:${proposal.current.space.id}/proposal/${proposal.current.id}`
          //   })
          // });

          // For now, show success message
          alert(`Vote recorded: ${choice}`);
        } catch (error) {
          console.error('Voting failed:', error);
          alert('Voting failed. Please try again.');
        }
      },

      setView: (view) => {
        set((state) => ({
          ui: {
            ...state.ui,
            view,
          },
        }));
      },

      setLayout: (layout) => {
        set((state) => ({
          ui: {
            ...state.ui,
            layout,
          },
        }));
      },

      setChatbotContext: (context) => {
        set((state) => ({
          ui: {
            ...state.ui,
            chatbot: {
              ...state.ui.chatbot,
              context,
            },
          },
        }));
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'magi-store',
    }
  )
);

// Convenience selectors
export const useProposal = () => useAppStore((state) => state.proposal);
export const useMAGI = () => useAppStore((state) => state.magi);
export const useUI = () => useAppStore((state) => state.ui);

// Convenience action selectors - using individual hooks to avoid object creation
export const useLoadProposal = () => useAppStore((state) => state.loadProposal);
export const useVote = () => useAppStore((state) => state.vote);
export const useSetView = () => useAppStore((state) => state.setView);
export const useSetLayout = () => useAppStore((state) => state.setLayout);
export const useSetChatbotContext = () => useAppStore((state) => state.setChatbotContext);
export const useReset = () => useAppStore((state) => state.reset);