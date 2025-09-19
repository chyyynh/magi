// Pure MAGI display component - separated from business logic
// "Graphics code should not know about business rules"

"use client";

import { useState, useEffect } from 'react';
import { MAGIState } from '@/lib/types';
import { getDecisionText } from '@/lib/magi';
import ClippedRecBal from '@/components/magi/core/ClippedRecBal';
import ClippedRecCas from '@/components/magi/core/ClippedRecCas';
import ClippedRecMel from '@/components/magi/core/ClippedRecMel';
import { Noto_Serif_TC } from "next/font/google";

const notoSansTC = Noto_Serif_TC({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

interface MAGIDisplayProps {
  magi: MAGIState;
  proposalId?: string;
  proposalTitle?: string;
  layout?: 'desktop' | 'mobile';
  animated?: boolean;
}

export default function MAGIDisplay({
  magi,
  proposalId,
  proposalTitle,
  layout = 'desktop',
  animated = false
}: MAGIDisplayProps) {
  const isDesktop = layout === 'desktop';

  // Blinking animation state
  const [bgColorBalthasar, setBgColorBalthasar] = useState("#FF6600");
  const [bgColorCasper, setBgColorCasper] = useState("#FF6600");
  const [bgColorMelchior, setBgColorMelchior] = useState("#FF6600");

  // Handle blinking animation
  useEffect(() => {
    if (animated || magi.processing) {
      const intervalBalthasar = setInterval(
        () =>
          setBgColorBalthasar((prev) =>
            prev === "#FF6600" ? "#000000" : "#FF6600"
          ),
        150
      );
      const intervalCasper = setInterval(
        () =>
          setBgColorCasper((prev) =>
            prev === "#FF6600" ? "#000000" : "#FF6600"
          ),
        250
      );
      const intervalMelchior = setInterval(
        () =>
          setBgColorMelchior((prev) =>
            prev === "#FF6600" ? "#000000" : "#FF6600"
          ),
        350
      );

      return () => {
        clearInterval(intervalBalthasar);
        clearInterval(intervalCasper);
        clearInterval(intervalMelchior);
      };
    } else {
      // Reset to default colors when not animating
      setBgColorBalthasar("#FF6600");
      setBgColorCasper("#FF6600");
      setBgColorMelchior("#FF6600");
    }
  }, [animated, magi.processing]);

  if (isDesktop) {
    return (
      <div className="flex flex-col h-full bg-black font-mono text-sm overflow-hidden relative">
        {/* Header */}
        <div className="px-10 py-4 z-10 relative">
          <div className="flex items-center justify-between gap-4 text-[#FF6600]">
            <div className={`${notoSansTC.className} text-8xl font-bold inline-block`}>
              提 訴
            </div>
            <div className={`${notoSansTC.className} text-8xl font-bold inline-block`}>
              決 議
            </div>
          </div>
          <div className="px-2 mt-4 flex items-center justify-between text-[#FF6600]">
            <div className="text-4xl font-bold inline-block">Code: 666</div>
          </div>
          <div className="px-2 mt-4 flex items-center justify-between text-[#FF6600]">
            <div className="flex flex-col text-xs">
              <span>Proposal ID: {proposalId || "N/A"}</span>
              <span>Title: {proposalTitle || "No proposal loaded"}</span>
            </div>
          </div>
        </div>

        {/* MAGI Nodes */}
        <div className="absolute inset-0 p-4 flex justify-center z-20">
          <div className="relative w-full max-w-3xl h-[400px]">
            {/* BALTHASAR */}
            <div className="absolute top-0 left-[50%] transform -translate-x-1/2 h-32">
              <ClippedRecBal color={bgColorBalthasar}>
                <div className="text-black text-xl font-black">BALTHASAR·2</div>
              </ClippedRecBal>
            </div>

            {/* Decision Display */}
            <div className="absolute bottom-35 right-0 flex items-center justify-center z-20">
              {!magi.processing && magi.decision && (
                <div className="p-0.5 border-1 border-[#FF6600]">
                  <div
                    className={`${notoSansTC.className} p-2 border-1 items-center text-4xl border-[#FF6600]`}
                    style={{ color: magi.nodes.balthasar.color }}
                  >
                    {getDecisionText(magi.decision.choice)}
                  </div>
                </div>
              )}
            </div>

            {/* CASPER */}
            <div className="absolute bottom-0 left-0 h-32">
              <ClippedRecCas color={bgColorCasper}>
                <div className="text-black text-xl font-black">CASPER·3</div>
              </ClippedRecCas>
            </div>

            {/* MELCHIOR */}
            <div className="absolute bottom-0 right-0 h-32">
              <ClippedRecMel color={bgColorMelchior}>
                <div className="text-black text-xl font-black">MELCHIOR·1</div>
              </ClippedRecMel>
            </div>

            {/* MAGI center label */}
            <div className={`${notoSansTC.className} absolute top-[80%] left-[50%] transform -translate-x-1/2 text-[#FF6600] font-bold text-2xl`}>
              MAGI
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-[#00FF66] text-xs z-30">
          <div className="flex justify-between items-center h-[42px]">
            <span>MAGI SYSTEM v0.1</span>
            <span className={magi.processing ? "opacity-100" : "opacity-0"}>
              PROCESSING DATA
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Mobile layout - 暫時註解掉
  /*
  return (
    <div className="h-[40%] overflow-hidden p-4 pt-6 flex flex-col items-center justify-center relative border-b border-[#FF6600]/50">
      // Mobile Header
      <div className="text-[#FF6600] text-center mb-2">
        <div className={`${notoSansTC.className} text-2xl font-bold`}>
          提訴 / 決議
        </div>
        <div className="text-xs mt-1">Code: 666</div>
      </div>

      // Mobile MAGI Components
      <div className="absolute bottom-0 middle h-72">
        <ClippedRecBal color={bgColorBalthasar}>
          <div className="text-black text-sm font-black p-1">BALTHASAR·2</div>
        </ClippedRecBal>
      </div>

      <div className="absolute bottom-0 left-0 h-32">
        <ClippedRecCas color={bgColorCasper}>
          <div className="text-black text-sm font-black p-1">CASPER·3</div>
        </ClippedRecCas>
      </div>

      <div className="absolute bottom-0 right-0 h-32">
        <ClippedRecMel color={bgColorMelchior}>
          <div className="text-black text-sm font-black p-1">MELCHIOR·1</div>
        </ClippedRecMel>
      </div>

      // Mobile Decision Display
      <div className="flex items-center justify-center mt-2">
        {!magi.processing && magi.decision && (
          <div className="p-0.5 border border-[#FF6600]">
            <div
              className={`${notoSansTC.className} p-1 border border-[#FF6600] items-center text-lg`}
              style={{ color: bgColorBalthasar }}
            >
              {getDecisionText(magi.decision.choice)}
            </div>
          </div>
        )}
      </div>

      // Mobile MAGI label
      <div className={`${notoSansTC.className} text-center text-[#FF6600] font-bold text-md mt-1`}>
        MAGI
      </div>

      // Mobile Processing indicator
      <div
        className={`absolute bottom-1 right-2 text-[#00FF66] text-[10px] ${
          magi.processing ? "opacity-100" : "opacity-0"
        }`}
      >
        PROCESSING DATA
      </div>
    </div>
  );
  */

  // 暫時返回桌面版佈局
  return (
    <div className="flex flex-col h-full bg-black font-mono text-sm overflow-hidden relative">
      {/* Header */}
      <div className="px-10 py-4 z-10 relative">
        <div className="flex items-center justify-between gap-4 text-[#FF6600]">
          <div className={`${notoSansTC.className} text-8xl font-bold inline-block`}>
            提 訴
          </div>
          <div className={`${notoSansTC.className} text-8xl font-bold inline-block`}>
            決 議
          </div>
        </div>
        <div className="px-2 mt-4 flex items-center justify-between text-[#FF6600]">
          <div className="text-4xl font-bold inline-block">Code: 666</div>
        </div>
        <div className="px-2 mt-4 flex items-center justify-between text-[#FF6600]">
          <div className="flex flex-col text-xs">
            <span>Proposal ID: {proposalId || "N/A"}</span>
            <span>Title: {proposalTitle || "No proposal loaded"}</span>
          </div>
        </div>
      </div>

      {/* MAGI Nodes */}
      <div className="absolute inset-0 p-4 flex justify-center z-20">
        <div className="relative w-full max-w-3xl h-[400px]">
          {/* BALTHASAR */}
          <div className="absolute top-0 left-[50%] transform -translate-x-1/2 h-32">
            <ClippedRecBal color={bgColorBalthasar}>
              <div className="text-black text-xl font-black">BALTHASAR·2</div>
            </ClippedRecBal>
          </div>

          {/* Decision Display */}
          <div className="absolute bottom-35 right-0 flex items-center justify-center z-20">
            {!magi.processing && magi.decision && (
              <div className="p-0.5 border-1 border-[#FF6600]">
                <div
                  className={`${notoSansTC.className} p-2 border-1 items-center text-4xl border-[#FF6600]`}
                  style={{ color: bgColorBalthasar }}
                >
                  {getDecisionText(magi.decision.choice)}
                </div>
              </div>
            )}
          </div>

          {/* CASPER */}
          <div className="absolute bottom-0 left-0 h-32">
            <ClippedRecCas color={bgColorCasper}>
              <div className="text-black text-xl font-black">CASPER·3</div>
            </ClippedRecCas>
          </div>

          {/* MELCHIOR */}
          <div className="absolute bottom-0 right-0 h-32">
            <ClippedRecMel color={bgColorMelchior}>
              <div className="text-black text-xl font-black">MELCHIOR·1</div>
            </ClippedRecMel>
          </div>

          {/* MAGI center label */}
          <div className={`${notoSansTC.className} absolute top-[80%] left-[50%] transform -translate-x-1/2 text-[#FF6600] font-bold text-2xl`}>
            MAGI
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-[#00FF66] text-xs z-30">
        <div className="flex justify-between items-center h-[42px]">
          <span>MAGI SYSTEM v0.1</span>
          <span className={magi.processing || animated ? "opacity-100" : "opacity-0"}>
            PROCESSING DATA
          </span>
        </div>
      </div>
    </div>
  );
}