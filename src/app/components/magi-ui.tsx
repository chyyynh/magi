"use client";

import { useEffect, useState } from "react";

interface MagiInterfaceProps {
  proposalID?: string;
  title?: string;
  content?: string;
  choices?: string[];
}

export default function MagiInterface({
  proposalID,
  title,
  content,
  choices,
}: MagiInterfaceProps) {
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlinking((prev) => !prev);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full bg-black font-mono text-sm overflow-hidden">
      {/* Grid lines overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(0deg, #333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Fixed Header section */}
      <div className="flex-none p-4 z-10">
        <div className="flex items-center gap-4 text-[#FF6600]">
          <div className="text-4xl font-bold">CODE : 666</div>
          <div className="flex flex-col text-xs">
            <span>Proposal ID: {proposalID || "N/A"}</span>
            <span>Title: {title || "No proposal loaded"}</span>
          </div>
        </div>
      </div>

      {/* Fixed content section */}
      <div className="flex-none p-4 max-h-[20%] overflow-y-auto">
        <div className="text-xs text-white">
          <span className="text-[#FF6600]">Content: </span>
          <span className="line-clamp-3">
            {content || "No content available"}
          </span>
        </div>
        <div className="mt-2 text-xs text-white">
          <span className="text-[#FF6600]">Choices: </span>
          {Array.isArray(choices) && choices.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-1">
              {choices.map((choice, index) => (
                <span
                  key={index}
                  className="bg-[#FF6600]/20 border border-[#FF6600]/50 px-2 py-1 rounded"
                >
                  {choice}
                </span>
              ))}
            </div>
          ) : (
            <span>No choices available</span>
          )}
        </div>
      </div>

      {/* Main MAGI system display - fixed */}
      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="relative w-full max-w-3xl h-[400px]">
          {/* BALTHASAR */}
          <div className="absolute top-0 left-[30%] w-[40%] h-32 border-2 border-[#FF6600] bg-[#00AAFF]/80">
            <div className="p-3 h-full flex flex-col">
              <div className="text-white text-xl">BALTHASAR·2</div>
              <div className="mt-auto text-right text-[#00FF66]">
                {blinking && <span>修復作業中</span>}
              </div>
            </div>
          </div>

          {/* CASPER */}
          <div className="absolute bottom-20 left-0 w-[40%] h-32 border-2 border-[#FF6600] bg-[#00AAFF]/80">
            <div className="p-3 h-full flex flex-col">
              <div className="text-white text-xl">CASPER·3</div>
            </div>
          </div>

          {/* MELCHIOR */}
          <div className="absolute bottom-20 right-0 w-[40%] h-32 border-2 border-[#FF6600] bg-[#FF4444]/80">
            <div className="p-3 h-full flex flex-col">
              <div className="text-white text-xl">MELCHIOR·1</div>
            </div>
          </div>

          {/* MAGI center node */}
          <div className="absolute top-[45%] left-[50%] transform -translate-x-1/2 text-[#FF6600] font-bold">
            MAGI
          </div>

          {/* Connection lines */}
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: -1 }}
          >
            {/* Line from BALTHASAR to center */}
            <line
              x1="50%"
              y1="32"
              x2="50%"
              y2="45%"
              stroke="#FF6600"
              strokeWidth="2"
            />

            {/* Line from CASPER to center */}
            <line
              x1="20%"
              y1="65%"
              x2="50%"
              y2="45%"
              stroke="#FF6600"
              strokeWidth="2"
            />

            {/* Line from MELCHIOR to center */}
            <line
              x1="80%"
              y1="65%"
              x2="50%"
              y2="45%"
              stroke="#FF6600"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* Fixed footer */}
      <div className="flex-none p-4 text-[#00FF66] text-xs">
        <div className="flex justify-between items-center h-[42px]">
          <span>MAGI SYSTEM v0.1</span>
          <span className={blinking ? "opacity-100" : "opacity-0"}>
            PROCESSING DATA
          </span>
        </div>
      </div>
    </div>
  );
}
