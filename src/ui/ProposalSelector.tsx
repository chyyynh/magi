// Pure UI component - no business logic, just presentation
// "UI components should be dumb and happy" - Linus principle

"use client";

import Link from 'next/link';
import { AVAILABLE_PROPOSALS, ProposalButton } from '@/lib/proposal';

interface ProposalSelectorProps {
  loading?: boolean;
}

export default function ProposalSelector({ loading = false }: ProposalSelectorProps) {
  return (
    <div className="flex flex-col h-full border-r border-[#FF6600]/50 bg-black text-white font-[family-name:var(--font-fraunces)] p-4 overflow-y-auto hide-scrollbar">
      <div className="mt-2 text-sm flex-1 flex flex-col min-h-0">
        <div className="text-[#FF6600] font-semibold mb-3 tracking-wide">
          SELECT PROPOSAL
        </div>

        <div className="space-y-3">
          {AVAILABLE_PROPOSALS.map((proposal) => (
            <Link
              key={proposal.id}
              href={proposal.url}
              className="block w-full bg-gray-900/30 border border-gray-700/50 rounded-lg p-4 text-left hover:bg-gray-800/50 hover:border-[#FF6600]/30 transition-all duration-200 backdrop-blur-sm"
            >
              <div className="text-white font-medium mb-2">{proposal.title}</div>
              <div className="text-gray-400 text-xs truncate">{proposal.url}</div>
            </Link>
          ))}
        </div>

        {loading && (
          <div className="mt-4 text-center text-[#FF6600] animate-pulse">
            Loading proposal...
          </div>
        )}
      </div>
    </div>
  );
}