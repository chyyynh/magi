import { type LayoutProps } from "@/app/components/magi/types";
import ClippedRecCas from "./MagiRec/ClippedRecCas";
import ClippedRecMel from "./MagiRec/ClippedRecMel";
import ClippedRecBal from "./MagiRec/ClippedRecBal";
import PropUI from "../PropUI";
import ChatBot from "../ChatBot";

// --- Desktop Layout Component ---
// Desktop layout remains largely the same, but receives props differently if needed
export const DesktopLayout: React.FC<LayoutProps> = ({
  proposal, // Use proposal state
  geminiDecisionLoading,
  geminiDecision,
  bgColorBalthasar,
  bgColorCasper,
  bgColorMelchior,
  decisionText,
  notoSansTCClassName,
  // onProposalLoaded is not used directly here but passed for consistency
}) => {
  const proposalID = proposal?.id;
  const title = proposal?.title;

  return (
    <div className="flex flex-col h-full bg-black font-mono text-sm overflow-hidden relative">
      {/* Fixed Header section */}
      <div className="px-10 py-4 z-10 relative">
        <div className="flex items-center justify-between gap-4 text-[#FF6600]">
          <div
            className={`${notoSansTCClassName} text-8xl font-bold inline-block`}
          >
            提 訴
          </div>
          <div
            className={`${notoSansTCClassName} text-8xl font-bold inline-block`}
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

      {/* Main MAGI system display */}
      <div className="absolute inset-0 p-4 flex justify-center z-20">
        <div className="relative w-full max-w-3xl h-[400px]">
          {/* BALTHASAR */}
          <div className="absolute top-0 left-[50%] transform -translate-x-1/2 h-32">
            <ClippedRecBal color={bgColorBalthasar}>
              <div className="text-black text-xl font-black">BALTHASAR·2</div>
            </ClippedRecBal>
          </div>

          {/* Decision Text Display */}
          <div className="absolute bottom-35 right-0 flex items-center justify-center z-20">
            {!geminiDecisionLoading && geminiDecision && (
              <div className="p-0.5 border-1 border-[#FF6600]">
                <div
                  className={`${notoSansTCClassName} p-2 border-1 items-center text-4xl border-[#FF6600]`}
                  style={{ color: bgColorBalthasar }}
                >
                  {decisionText[geminiDecision as keyof typeof decisionText] ||
                    "未知"}
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

          {/* MAGI center node */}
          <div
            className={`${notoSansTCClassName} absolute top-[80%] left-[50%] transform -translate-x-1/2 text-[#FF6600] font-bold text-2xl`}
          >
            MAGI
          </div>
        </div>
      </div>

      {/* Fixed footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-[#00FF66] text-xs z-30">
        <div className="flex justify-between items-center h-[42px]">
          <span>MAGI SYSTEM v0.1</span>
          <span className={geminiDecisionLoading ? "opacity-100" : "opacity-0"}>
            PROCESSING DATA
          </span>
        </div>
      </div>
    </div>
  );
};

// --- Mobile Layout Component ---
export const MobileLayout: React.FC<LayoutProps> = ({
  proposal, // Use proposal state
  geminiDecisionLoading,
  geminiDecision,
  bgColorBalthasar,
  bgColorCasper,
  bgColorMelchior,
  decisionText,
  notoSansTCClassName,
  onProposalLoaded, // Use callback for ChatBot
}) => {
  // const proposalID = proposal?.id;
  // const title = proposal?.title;

  return (
    // Use flex-col and h-dvh for vertical distribution to account for browser UI
    <div className="flex flex-col h-full bg-black font-mono text-sm">
      {/* Magi UI Section (2/5 height) */}
      <div className="h-[40%] overflow-hidden p-4 pt-6 flex flex-col items-center justify-center relative border-b border-[#FF6600]/50">
        {/* Simplified Header */}
        <div className="text-[#FF6600] text-center mb-2">
          <div className={`${notoSansTCClassName} text-2xl font-bold`}>
            提訴 / 決議
          </div>
          <div className="text-xs mt-1">Code: 666</div>
        </div>

        {/* MAGI Components - Smaller & Centered */}
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
          </ClippedRecMel>{" "}
        </div>

        {/* Decision Text Display */}
        <div className="flex items-center justify-center mt-2">
          {!geminiDecisionLoading && geminiDecision && (
            <div className="p-0.5 border border-[#FF6600]">
              <div
                className={`${notoSansTCClassName} p-1 border border-[#FF6600] items-center text-lg`}
                style={{ color: bgColorBalthasar }}
              >
                {decisionText[geminiDecision as keyof typeof decisionText] ||
                  "未知"}
              </div>
            </div>
          )}
        </div>
        {/* MAGI center node */}
        <div
          className={`${notoSansTCClassName} text-center text-[#FF6600] font-bold text-md mt-1`}
        >
          MAGI
        </div>
        {/* Processing Text */}
        <div
          className={`absolute bottom-1 right-2 text-[#00FF66] text-[10px] ${
            geminiDecisionLoading ? "opacity-100" : "opacity-0"
          }`}
        >
          PROCESSING DATA
        </div>
      </div>

      {/* PropUI Section (1/5 height) */}
      <div className="h-[20%] overflow-hidden border-b border-[#FF6600]/50">
        <PropUI content={proposal?.body} choices={proposal?.choices} />
      </div>

      {/* ChatBot Section (2/5 height) */}
      <div className="h-[40%]">
        <ChatBot onProposalLoaded={onProposalLoaded} />
      </div>
    </div>
  );
};
