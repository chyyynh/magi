"use client";

import dynamic from 'next/dynamic';
import { useState } from 'react';

// Lazy load chatbot only when needed
const Chatbot = dynamic(() => import('./chatbot'), {
  loading: () => <div className="flex items-center justify-center h-full text-gray-400">載入聊天機器人...</div>,
  ssr: false,
});

interface FloatingChatbotProps {
  proposalContext?: string | null;
}

export default function FloatingChatbot({ proposalContext }: FloatingChatbotProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Floating Chatbot */}
      <div
        className="fixed top-20 right-4 bottom-4 w-96 transform translate-x-full transition-transform duration-300 ease-in-out hover:translate-x-0 group z-50"
        onMouseEnter={() => setIsHovered(true)}
      >
        {/* Hover trigger area */}
        <div className="absolute left-0 top-0 w-4 h-full bg-transparent"></div>

        {/* Chatbot container - only load when hovered */}
        <div className="h-full bg-black rounded-2xl border border-orange-400 shadow-none">
          {isHovered && <Chatbot proposalContext={proposalContext} />}
        </div>
      </div>

      {/* Hover indicator */}
      <div className="fixed top-1/2 right-0 transform -translate-y-1/2 w-1 h-20 bg-primary/50 rounded-l-md transition-opacity duration-300 hover:opacity-100 opacity-30"></div>
    </>
  );
}
