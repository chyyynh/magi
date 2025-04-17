"use client";

import { useEffect, useState } from "react";
import useIsMobile from "../../hooks/useIsMobile";
import PropUI from "../PropUI";
import ChatBot from "../ChatBot";
import { type LayoutProps, type Proposal } from "@/app/components/magi/types";
import { DesktopLayout, MobileLayout } from "./layout";

import { Noto_Serif_TC } from "next/font/google";

const notoSansTC = Noto_Serif_TC({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

// --- Main MagiInterface Component ---
export default function MagiInterface() {
  const isMobile = useIsMobile();

  // State management for proposal and decisions
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [geminiDecisionLoading, setGeminiDecisionLoading] = useState(false);
  const [geminiDecision, setGeminiDecision] = useState<string | null>(null);

  const [, /*blink*/ setBlinking] = useState(false);
  const [bgColorBalthasar, setBgColorBalthasar] = useState("#FF6600");
  const [bgColorCasper, setBgColorCasper] = useState("#FF6600");
  const [bgColorMelchior, setBgColorMelchior] = useState("#FF6600");

  // Callback for ChatBot to update parent state
  const handleProposalLoaded = (
    loadedProposal: Proposal | null,
    loading: boolean,
    decision: string | null
  ) => {
    setProposal(loadedProposal);
    setGeminiDecisionLoading(loading);
    setGeminiDecision(decision);
  };

  // Effects remain the same
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

  useEffect(() => {
    if (geminiDecisionLoading) {
      setBlinking(true);
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
      setBlinking(false);
      const finalColor =
        geminiDecision === "For"
          ? "#00FF66"
          : geminiDecision === "Against"
          ? "#FF4444"
          : "#FF6600";
      setBgColorBalthasar(finalColor);
      setBgColorCasper(finalColor);
      setBgColorMelchior(finalColor);
    }
  }, [geminiDecisionLoading, geminiDecision]);

  const decisionText = {
    For: "支持",
    Against: "反對",
  };

  // Prepare props for layout components
  const layoutProps: LayoutProps = {
    proposal, // Pass state
    geminiDecisionLoading, // Pass state
    geminiDecision, // Pass state
    bgColorBalthasar,
    bgColorCasper,
    bgColorMelchior,
    decisionText,
    notoSansTCClassName: notoSansTC.className,
    onProposalLoaded: handleProposalLoaded, // Pass callback
  };
  if (isMobile) {
    return <MobileLayout {...layoutProps} />;
  } else {
    return (
      <div className="flex h-full">
        <div className="w-1/5">
          <PropUI content={proposal?.body} choices={proposal?.choices} />
        </div>
        <div className="w-3/5">
          <DesktopLayout {...layoutProps} />
        </div>
        <div className="w-1/5">
          <ChatBot onProposalLoaded={handleProposalLoaded} />
        </div>
      </div>
    );
  }
}
