"use client";

import { useEffect, useState } from "react";
import ClippedRecCas from "./ClippedRecCas";
import ClippedRecMel from "./ClippedRecMel";
import ClippedRecBal from "./ClippedRecBal";

import { Noto_Serif_TC } from "next/font/google";

const notoSansTC = Noto_Serif_TC({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface MagiInterfaceProps {
  proposalID: string;
  title?: string;
  geminiDecisionLoading?: boolean;
  geminiDecision?: string | null;
}

export default function MagiInterface({
  proposalID,
  title,
  geminiDecisionLoading,
  geminiDecision,
}: MagiInterfaceProps) {
  const [blinking, setBlinking] = useState(false);
  const [bgColorBalthasar, setBgColorBalthasar] = useState("#FF6600");
  const [bgColorCasper, setBgColorCasper] = useState("#FF6600");
  const [bgColorMelchior, setBgColorMelchior] = useState("#FF6600");

  useEffect(() => {
    const finalColor =
      geminiDecision === "For"
        ? "#00FF66"
        : geminiDecision === "Against"
        ? "#FF4444"
        : "#FF6600";

    setBgColorBalthasar(finalColor);
    setBgColorCasper(finalColor);
    setBgColorMelchior(finalColor);
  }, [geminiDecision]);

  // Different blinking speeds for each MAGI
  useEffect(() => {
    if (geminiDecisionLoading) {
      setBlinking(true);

      // BALTHASAR - fastest (150ms)
      const intervalBalthasar = setInterval(() => {
        setBgColorBalthasar((prev) =>
          prev === "#FF6600" ? "#000000" : "#FF6600"
        );
      }, 150);

      // CASPER - medium (250ms)
      const intervalCasper = setInterval(() => {
        setBgColorCasper((prev) =>
          prev === "#FF6600" ? "#000000" : "#FF6600"
        );
      }, 250);

      // MELCHIOR - slowest (350ms)
      const intervalMelchior = setInterval(() => {
        setBgColorMelchior((prev) =>
          prev === "#FF6600" ? "#000000" : "#FF6600"
        );
      }, 350);

      return () => {
        clearInterval(intervalBalthasar);
        clearInterval(intervalCasper);
        clearInterval(intervalMelchior);
      };
    } else {
      setBlinking(false);
    }
  }, [geminiDecisionLoading]);

  const decisionText = {
    For: "支持",
    Against: "反對",
  };

  return (
    <div className="flex flex-col h-full bg-black font-mono text-sm overflow-hidden relative">
      {/* Fixed Header section */}
      <div className="px-10 py-4 z-10 relative">
        <div className="flex items-center justify-between gap-4 text-[#FF6600]">
          <div
            className={`${notoSansTC.className} text-8xl font-bold inline-block`}
          >
            提 訴
          </div>
          <div
            className={`${notoSansTC.className} text-8xl font-bold inline-block`}
          >
            決 議
          </div>
        </div>
        <div className="px-2 mt-4 flex items-center justify-between text-[#FF6600]">
          <div className={`text-4xl font-bold inline-block`}>Code: 666</div>
        </div>
        <div className="px-2 mt-4 flex items-center justify-between text-[#FF6600]">
          <div className="flex flex-col text-xs">
            <span>Proposal ID: {proposalID || "N/A"}</span>
            <span>Title: {title || "No proposal loaded"}</span>
          </div>
        </div>
      </div>

      {/* Main MAGI system display - now absolute positioned to overlap */}
      <div className="absolute inset-0 p-4 flex justify-center z-20">
        <div className="relative w-full max-w-3xl h-[400px]">
          {/* BALTHASAR */}
          <HoverCard>
            <HoverCardTrigger>
              <div className="absolute top-0 left-[50%] transform -translate-x-1/2 h-32">
                <ClippedRecBal
                  width={250}
                  height={250}
                  color={bgColorBalthasar}
                >
                  <div className="text-black text-xl font-black">
                    BALTHASAR·2
                  </div>
                </ClippedRecBal>
              </div>
            </HoverCardTrigger>
            <HoverCardContent>
              The React Framework – created and maintained by @vercel.
            </HoverCardContent>
          </HoverCard>

          {geminiDecision && (
            <div className="absolute bottom-45 right-0 flex items-center justify-center z-20">
              <div
                className="p-0.5 border-1 border-[#FF6600]"
                color={bgColorBalthasar}
              >
                <div
                  className={`${notoSansTC.className} p-2 border-1 items-center text-4xl border-[#FF6600] text-[#FF6600]`}
                >
                  {decisionText[geminiDecision as keyof typeof decisionText] ||
                    "未知"}
                </div>
              </div>
            </div>
          )}

          {/* CASPER */}
          <div className="absolute bottom-10 left-0 h-32">
            <ClippedRecCas width={280} height={160} color={bgColorCasper}>
              <div className="text-black text-xl font-black">CASPER·3</div>
            </ClippedRecCas>
          </div>

          {/* MELCHIOR */}
          <div className="absolute bottom-10 right-0 h-32">
            <ClippedRecMel width={280} height={160} color={bgColorMelchior}>
              <div className="text-black text-xl font-black">MELCHIOR·1</div>
            </ClippedRecMel>
          </div>

          {/* MAGI center node */}
          <div
            className={`${notoSansTC.className} absolute top-[45%] left-[50%] transform -translate-x-1/2 text-[#FF6600] font-bold text-2xl`}
          >
            MAGI
          </div>
        </div>
      </div>

      {/* Fixed footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-[#00FF66] text-xs z-30">
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
