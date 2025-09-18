"use client";

import Chatbot from "./chatbot";

export default function FloatingChatbot() {
  return (
    <>
      {/* Floating Chatbot */}
      <div className="fixed top-20 right-4 bottom-4 w-96 transform translate-x-full transition-transform duration-300 ease-in-out hover:translate-x-0 group z-50">
        {/* Hover trigger area */}
        <div className="absolute left-0 top-0 w-4 h-full bg-transparent"></div>

        {/* Chatbot container */}
        <div className="h-full bg-black rounded-2xl border border-orange-400 shadow-none">
          <Chatbot />
        </div>
      </div>

      {/* Hover indicator */}
      <div className="fixed top-1/2 right-0 transform -translate-y-1/2 w-1 h-20 bg-primary/50 rounded-l-md transition-opacity duration-300 hover:opacity-100 opacity-30"></div>
    </>
  );
}
