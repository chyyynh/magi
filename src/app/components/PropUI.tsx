"use client";

interface PropUIProps {
  content?: string;
  choices?: string[];
}

export default function PropUI({ content, choices }: PropUIProps) {
  return (
    <div className="flex flex-col h-full border-r border-[#FF6600]/50 bg-black text-white font-mono p-4 overflow-y-auto">
      <div className="text-xs">
        <span className="text-[#FF6600]">Content: </span>
        <span className="line-clamp-30">
          {content || "No content available"}
        </span>
      </div>
      <div className="mt-2 text-xs">
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
  );
}
