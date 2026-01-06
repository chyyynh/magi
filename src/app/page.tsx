"use client";

import MagiInterface from "@/components/magi";

export default function Page() {
  return (
    <div className="flex flex-col h-dvh overflow-hidden bg-black">
      {/* Main content */}
      <div className="flex-grow overflow-hidden">
        <MagiInterface />
      </div>
    </div>
  );
}
