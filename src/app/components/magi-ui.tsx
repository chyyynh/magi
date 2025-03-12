"use client";

import { useEffect, useState } from "react";
import ClippedRecCas from "./ClippedRecCas";
import ClippedRecMel from "./ClippedRecMel";
import ClippedRecBal from "./ClippedRecBal";

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

  return (
    <div className="flex flex-col h-full bg-black font-mono text-sm overflow-hidden">
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

      {/* Main MAGI system display - fixed */}
      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="relative w-full max-w-3xl h-[400px]">
          {/* BALTHASAR */}
          <div className="absolute top-0 left-[50%] transform -translate-x-1/2 h-32">
            <ClippedRecBal width={300} height={150} color={bgColorBalthasar}>
              <div className="text-black text-xl font-black">BALTHASAR·2</div>
            </ClippedRecBal>
          </div>

          {geminiDecision && (
            <div className="text-4xl text-white absolute top-25 right-0">
              <div
                className="p-1 border-1 border-[#FF6600]"
                color={bgColorBalthasar}
              >
                <div className="p-2 border-1 border-[#FF6600]">
                  {geminiDecision}
                </div>
              </div>
            </div>
          )}

          {/* CASPER */}
          <div className="absolute bottom-20 left-0 h-32">
            <ClippedRecCas width={280} height={160} color={bgColorCasper}>
              <div className="text-black text-xl font-black">CASPER·3</div>
            </ClippedRecCas>
          </div>

          {/* MELCHIOR */}
          <div className="absolute bottom-20 right-0 h-32">
            <ClippedRecMel width={280} height={160} color={bgColorMelchior}>
              <div className="text-black text-xl font-black">MELCHIOR·1</div>
            </ClippedRecMel>
          </div>

          {/* MAGI center node */}
          <div className="absolute top-[45%] left-[50%] transform -translate-x-1/2 text-[#FF6600] font-bold">
            MAGI
          </div>
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
