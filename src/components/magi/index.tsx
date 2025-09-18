"use client";

import { useEffect, useState, useCallback } from "react";
import useIsMobile from "@/hooks/useIsMobile";
import PropUI from "@/components/common/PropUI";
import { type LayoutProps, type Proposal } from "@/types";
import { DesktopLayout, MobileLayout } from "./layout/layout";
import FloatingChatbot from "./chat/FloatingChatbot";

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

  // Callback for ChatBot to update parent state
  const handleProposalLoaded = useCallback(
    (
      loadedProposal: Proposal | null,
      loading: boolean,
      decision: string | null
    ) => {
      setProposal(loadedProposal);
      setGeminiDecisionLoading(loading);
      setGeminiDecision(decision);
    },
    []
  );

  const [, /*blink*/ setBlinking] = useState(false);
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
      <div className="flex h-full relative">
        <div className="w-1/4">
          <PropUI
            content={proposal?.body}
            choices={proposal?.choices}
            onProposalLoaded={handleProposalLoaded}
          />
        </div>
        <div className="flex-1">
          <DesktopLayout {...layoutProps} />
        </div>

        <FloatingChatbot />
      </div>
    );
  }
}
