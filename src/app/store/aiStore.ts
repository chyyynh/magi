import { create } from "zustand";

interface AIStore {
  aiVotingResult: string;
  setAIVotingResult: (result: string) => void;
}

export const useAIStore = create<AIStore>((set) => ({
  aiVotingResult: "Pending...",
  setAIVotingResult: (result) => set({ aiVotingResult: result }),
}));
