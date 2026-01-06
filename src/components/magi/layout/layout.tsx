"use client";

import { type LayoutProps } from "@/types";
import { AGENT_IDS, AGENT_CONFIGS } from "@/types";
import MagiSystem from "../core/MagiSystem";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, RotateCcw } from "lucide-react";
import { useState } from "react";
import { CornerBrackets } from "../ui/HUDElements";

// --- Desktop Layout Component ---
export const DesktopLayout: React.FC<LayoutProps> = ({
  agentStates,
  currentTask,
  isExecuting,
  executeTask,
  resetAgents,
  bgColorBalthasar,
  bgColorCasper,
  bgColorMelchior,
  notoSansTCClassName,
}) => {
  const [question, setQuestion] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<string>("melchior");

  const handleSubmit = () => {
    if (question.trim()) {
      executeTask(question.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const anyProcessing = AGENT_IDS.some(
    (id) => agentStates[id].status === "processing"
  );
  const allComplete = AGENT_IDS.every(
    (id) => agentStates[id].status === "complete"
  );

  return (
    <div className="relative h-full bg-black font-mono text-sm overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-20" />

      {/* Scanlines effect */}
      <div className="absolute inset-0 cyber-scanlines pointer-events-none" />

      {/* Main 3-column layout */}
      <div className="h-full flex">

        {/* ===== LEFT PANEL - Agent Status ===== */}
        <div className="w-72 h-full border-r border-white/10 flex flex-col bg-black/50">
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className={`${notoSansTCClassName} text-xl font-bold text-white tracking-[0.2em]`}>
                MAGI
              </div>
              <div className="text-[8px] text-white/30 tracking-widest">
                <div>SUPER-COMPUTER</div>
                <div>SYSTEM v3.14</div>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="p-4 border-b border-white/10">
            <div className="text-[9px] text-white/30 tracking-[0.2em] mb-3">SYSTEM STATUS</div>
            <div className={`text-sm tracking-wider ${anyProcessing ? "text-white animate-pulse" : allComplete ? "text-white" : "text-white/40"}`}>
              {anyProcessing ? "● PROCESSING" : allComplete ? "● COMPLETE" : "○ STANDBY"}
            </div>
          </div>

          {/* Agent Steps */}
          <div className="flex-1 overflow-y-auto p-4 hide-scrollbar">
            <div className="text-[9px] text-white/30 tracking-[0.2em] mb-4">AGENT STATUS</div>

            <div className="space-y-3">
              {AGENT_IDS.map((agentId, index) => {
                const config = AGENT_CONFIGS[agentId];
                const state = agentStates[agentId];
                const isActive = state.status === "processing";
                const isComplete = state.status === "complete";

                return (
                  <div
                    key={agentId}
                    className={`relative border transition-all duration-300 ${
                      isActive ? "border-white/40 bg-white/5" : "border-white/10"
                    }`}
                    style={{ borderColor: isActive ? `${config.color}50` : undefined }}
                  >
                    {/* Corner brackets */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-l border-t" style={{ borderColor: config.color }} />
                    <div className="absolute top-0 right-0 w-2 h-2 border-r border-t" style={{ borderColor: config.color }} />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b" style={{ borderColor: config.color }} />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b" style={{ borderColor: config.color }} />

                    <div className="p-3">
                      {/* Agent Header */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="text-[10px] text-white/30 tracking-wider">STEP {String(index + 1).padStart(2, '0')}</div>
                        <div className="flex-1 h-px bg-white/10" />
                      </div>

                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 ${isActive ? "animate-pulse" : ""}`}
                          style={{ backgroundColor: config.color }}
                        />
                        <span className="text-[11px] font-bold tracking-wider" style={{ color: config.color }}>
                          {config.displayName}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="mt-2 text-[9px] text-white/40 tracking-wider">
                        {state.status === "idle" && "AWAITING QUERY..."}
                        {state.status === "processing" && (
                          <span className="text-white/60">
                            <span className="inline-block animate-pulse mr-1">▶</span>
                            ANALYZING...
                          </span>
                        )}
                        {state.status === "complete" && (
                          <span className="text-white/50">✓ COMPLETE</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Task */}
          {currentTask && (
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[9px] text-white/30 tracking-[0.2em]">CURRENT QUERY</div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetAgents}
                  className="h-5 w-5 p-0 text-white/30 hover:text-white"
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-[10px] text-white/50 leading-relaxed line-clamp-3">{currentTask}</p>
            </div>
          )}

          {/* Tech decoration */}
          <div className="p-4 border-t border-white/10">
            <div className="text-[8px] text-white/15 tracking-widest flex justify-between">
              <span>SYS:0x8F2A</span>
              <span>SEC_LV:01</span>
            </div>
          </div>
        </div>

        {/* ===== CENTER - MAGI System ===== */}
        <div className="flex-1 h-full flex flex-col relative overflow-hidden">
          {/* MAGI Visualization */}
          <div className="flex-1 flex items-center justify-center relative">
            {/* Animated rings behind MAGI */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[500px] h-[500px] rounded-full border border-white/5 animate-[spin_60s_linear_infinite]" />
              <div className="absolute w-[400px] h-[400px] rounded-full border border-white/5 animate-[spin_45s_linear_infinite_reverse]" />
              <div className="absolute w-[300px] h-[300px] rounded-full border border-white/10 animate-[spin_30s_linear_infinite]" />
            </div>

            {/* Pulsing glow effect */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div
                className={`w-64 h-64 rounded-full blur-3xl transition-all duration-1000 ${
                  anyProcessing ? "opacity-30" : "opacity-10"
                }`}
                style={{
                  background: `radial-gradient(circle, ${anyProcessing ? "#ffffff" : "#333333"} 0%, transparent 70%)`
                }}
              />
            </div>

            <MagiSystem
              colorBalthasar={bgColorBalthasar}
              colorCasper={bgColorCasper}
              colorMelchior={bgColorMelchior}
              scale={0.85}
              contentBalthasar={
                <div className="text-center">
                  <div className="text-black text-base font-black tracking-[0.1em]">BALTHASAR-02</div>
                  <div className="text-black/50 text-[9px] mt-0.5 tracking-widest">CLAUDE</div>
                </div>
              }
              contentCasper={
                <div className="text-center">
                  <div className="text-black text-base font-black tracking-[0.1em]">CASPER-03</div>
                  <div className="text-black/50 text-[9px] mt-0.5 tracking-widest">GEMINI</div>
                </div>
              }
              contentMelchior={
                <div className="text-center">
                  <div className="text-black text-base font-black tracking-[0.1em]">MELCHIOR-01</div>
                  <div className="text-black/50 text-[9px] mt-0.5 tracking-widest">OPENAI</div>
                </div>
              }
            />
          </div>

          {/* Bottom Input */}
          <div className="p-6">
            <div className="max-w-xl mx-auto">
              <div className="bg-black/80 border border-white/20 p-3 relative">
                <CornerBrackets size={6} />
                <div className="flex gap-3">
                  <Textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="有什麼需要決定的事？"
                    disabled={isExecuting}
                    rows={1}
                    className="flex-1 bg-transparent border-0 text-white resize-none focus:ring-0 placeholder:text-white/20 text-sm min-h-[36px] py-2 px-0"
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={isExecuting || !question.trim()}
                    className="bg-white hover:bg-white/80 text-black font-bold tracking-wider px-5 h-[36px]"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== RIGHT PANEL - Chat ===== */}
        <div className="w-96 h-full border-l border-white/10 flex flex-col bg-black/50">
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <div className={`${notoSansTCClassName} text-lg text-white tracking-wider`}>
              分析結果
            </div>
            <div className="text-[8px] text-white/30 mt-1 tracking-[0.2em]">ANALYSIS OUTPUT</div>
          </div>

          {/* Agent Tabs */}
          <div className="flex border-b border-white/10">
            {AGENT_IDS.map((agentId) => {
              const config = AGENT_CONFIGS[agentId];
              const state = agentStates[agentId];
              const isSelected = selectedAgent === agentId;

              return (
                <button
                  key={agentId}
                  onClick={() => setSelectedAgent(agentId)}
                  className={`flex-1 px-3 py-3 text-[10px] tracking-wider transition-all border-b-2 ${
                    isSelected
                      ? "border-current bg-white/5"
                      : "border-transparent hover:bg-white/5"
                  }`}
                  style={{ color: isSelected ? config.color : `${config.color}60` }}
                >
                  <div className="flex items-center justify-center gap-2">
                    <div
                      className={`w-1.5 h-1.5 ${state.status === "processing" ? "animate-pulse" : ""}`}
                      style={{ backgroundColor: config.color }}
                    />
                    {config.displayName.split("-")[0]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Chat Content */}
          <div className="flex-1 overflow-y-auto p-4 hide-scrollbar">
            {AGENT_IDS.map((agentId) => {
              const config = AGENT_CONFIGS[agentId];
              const state = agentStates[agentId];
              const isSelected = selectedAgent === agentId;

              if (!isSelected) return null;

              return (
                <div key={agentId} className="h-full flex flex-col">
                  {/* Agent Info */}
                  <div className="mb-4 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 ${state.status === "processing" ? "animate-pulse" : ""}`}
                        style={{ backgroundColor: config.color }}
                      />
                      <div>
                        <div className="text-sm font-bold tracking-wider" style={{ color: config.color }}>
                          {config.displayName}
                        </div>
                        <div className="text-[9px] text-white/30 tracking-widest">
                          {config.name.toUpperCase()} • {state.status.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Response */}
                  <div className="flex-1">
                    {state.status === "idle" && (
                      <div className="text-white/20 text-xs tracking-wide">
                        Awaiting query input...
                      </div>
                    )}
                    {state.status === "processing" && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: config.color }} />
                          <span className="text-white/50 text-xs tracking-wider">Analyzing...</span>
                        </div>
                        <div className="space-y-2">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="h-3 bg-white/5 rounded animate-pulse"
                              style={{ width: `${100 - i * 20}%`, animationDelay: `${i * 0.2}s` }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    {state.status === "complete" && state.response && (
                      <div className="space-y-3">
                        <div className="text-[11px] text-white/70 leading-relaxed whitespace-pre-wrap">
                          {state.response}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom decoration */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center justify-between text-[8px] text-white/20 tracking-widest">
              <span>OUTPUT STREAM</span>
              <span>●</span>
            </div>
          </div>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-white/10 pointer-events-none" />
      <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-white/10 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-white/10 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-white/10 pointer-events-none" />
    </div>
  );
};

// --- Mobile Layout Component ---
export const MobileLayout: React.FC<LayoutProps> = ({
  agentStates,
  isExecuting,
  executeTask,
  resetAgents,
  bgColorBalthasar,
  bgColorCasper,
  bgColorMelchior,
  notoSansTCClassName,
}) => {
  const [question, setQuestion] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = () => {
    if (question.trim()) {
      executeTask(question.trim());
      setShowResults(true);
    }
  };

  const anyProcessing = AGENT_IDS.some(
    (id) => agentStates[id].status === "processing"
  );

  return (
    <div className="relative h-full bg-black font-mono text-sm overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 cyber-grid pointer-events-none opacity-20" />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-3 z-10">
        <div className="bg-black/90 border border-white/20 px-4 py-2 flex justify-between items-center relative">
          <CornerBrackets size={5} />
          <div className={`${notoSansTCClassName} text-lg font-bold text-white tracking-[0.3em]`}>
            MAGI
          </div>
          <div className="flex items-center gap-2">
            {AGENT_IDS.map((agentId) => {
              const config = AGENT_CONFIGS[agentId];
              const state = agentStates[agentId];
              return (
                <div
                  key={agentId}
                  className={`w-1.5 h-1.5 ${state.status === "processing" ? "animate-pulse" : ""}`}
                  style={{ backgroundColor: config.color }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* MAGI Visualization */}
      <div className="absolute inset-0 flex items-center justify-center pt-14 pb-44">
        <MagiSystem
          colorBalthasar={bgColorBalthasar}
          colorCasper={bgColorCasper}
          colorMelchior={bgColorMelchior}
          scale={0.42}
          contentBalthasar={
            <div className="text-black text-[10px] font-black tracking-wider">BALTHASAR-02</div>
          }
          contentCasper={
            <div className="text-black text-[10px] font-black tracking-wider">CASPER-03</div>
          }
          contentMelchior={
            <div className="text-black text-[10px] font-black tracking-wider">MELCHIOR-01</div>
          }
        />
      </div>

      {/* Bottom Panel */}
      <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
        <div className="bg-black/95 border border-white/20 p-3 relative">
          <CornerBrackets size={6} />

          {!showResults ? (
            <>
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="有什麼需要決定的事？"
                disabled={isExecuting}
                rows={2}
                className="bg-black/50 border-white/10 text-white text-sm resize-none mb-2 placeholder:text-white/20"
              />
              <Button
                onClick={handleSubmit}
                disabled={isExecuting || !question.trim()}
                className="w-full bg-white hover:bg-white/80 text-black font-bold tracking-widest h-10"
              >
                <Send className="w-4 h-4 mr-2" />
                詢問 MAGI
              </Button>
            </>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] tracking-wider ${anyProcessing ? "text-white" : "text-white"}`}>
                  {anyProcessing ? "● PROCESSING..." : "● COMPLETE"}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    resetAgents();
                    setShowResults(false);
                    setQuestion("");
                  }}
                  className="h-6 text-[10px] text-white/40 hover:text-white tracking-wider"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  RESET
                </Button>
              </div>
              {AGENT_IDS.map((agentId) => {
                const config = AGENT_CONFIGS[agentId];
                const state = agentStates[agentId];
                return (
                  <div key={agentId} className="flex items-start gap-2 py-1.5 border-t border-white/10">
                    <div className="w-1.5 h-1.5 mt-1 shrink-0" style={{ backgroundColor: config.color }} />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold tracking-wider" style={{ color: config.color }}>
                        {config.displayName}
                      </span>
                      <p className="text-[10px] text-white/50 mt-0.5 line-clamp-2">
                        {state.status === "complete" ? state.response : "Processing..."}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
