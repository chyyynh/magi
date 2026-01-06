"use client";

import { type LayoutProps } from "@/types";
import { AGENT_IDS, AGENT_CONFIGS } from "@/types";
import MagiSystem from "../core/MagiSystem";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, RotateCcw } from "lucide-react";
import { useState } from "react";

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
      {/* Center - MAGI System */}
      <div className="absolute inset-0 flex items-center justify-center">
        <MagiSystem
          colorBalthasar={bgColorBalthasar}
          colorCasper={bgColorCasper}
          colorMelchior={bgColorMelchior}
          contentBalthasar={
            <div className="text-center">
              <div className="text-black text-xl font-black tracking-wider">BALTHASAR·2</div>
              <div className="text-black/60 text-sm mt-1">Claude</div>
            </div>
          }
          contentCasper={
            <div className="text-center">
              <div className="text-black text-xl font-black tracking-wider">CASPER·3</div>
              <div className="text-black/60 text-sm mt-1">Gemini</div>
            </div>
          }
          contentMelchior={
            <div className="text-center">
              <div className="text-black text-xl font-black tracking-wider">MELCHIOR·1</div>
              <div className="text-black/60 text-sm mt-1">OpenAI</div>
            </div>
          }
        />
      </div>

      {/* Top Bar - Floating */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
        {/* Top Left - Title */}
        <div className="pointer-events-auto bg-black/60 backdrop-blur-sm border border-[#FF6600]/30 rounded-lg px-4 py-3">
          <div className="flex items-center gap-3">
            <div className={`${notoSansTCClassName} text-2xl font-bold text-[#FF6600]`}>
              MAGI
            </div>
            <div className="h-6 w-px bg-[#FF6600]/30" />
            <div className="text-xs text-gray-500">
              <div>SUPER-COMPUTER</div>
              <div>SYSTEM</div>
            </div>
          </div>
        </div>

        {/* Top Right - Agent Indicators */}
        <div className="pointer-events-auto bg-black/60 backdrop-blur-sm border border-[#FF6600]/30 rounded-lg px-4 py-3">
          <div className="flex items-center gap-4">
            {AGENT_IDS.map((agentId) => {
              const config = AGENT_CONFIGS[agentId];
              const state = agentStates[agentId];
              return (
                <div key={agentId} className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      state.status === "processing" ? "animate-pulse" : ""
                    }`}
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-xs" style={{ color: config.color }}>
                    {config.displayName.split("·")[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Left Panel - Floating Question Input */}
      <div className="absolute left-4 top-24 bottom-20 w-72 pointer-events-auto">
        <div className="h-full bg-black/60 backdrop-blur-sm border border-[#FF6600]/30 rounded-lg p-4 flex flex-col">
          <div className="mb-4">
            <div className={`${notoSansTCClassName} text-lg text-[#FF6600] mb-1`}>
              提問
            </div>
            <p className="text-xs text-gray-500">
              有什麼需要決定的事？
            </p>
          </div>

          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="輸入你的問題..."
            disabled={isExecuting}
            rows={4}
            className="bg-black/50 border-[#FF6600]/30 text-white resize-none focus:border-[#FF6600] mb-3"
          />

          <Button
            onClick={handleSubmit}
            disabled={isExecuting || !question.trim()}
            className="w-full bg-[#FF6600] hover:bg-[#FF6600]/80 text-black font-bold"
          >
            <Send className="w-4 h-4 mr-2" />
            詢問 MAGI
          </Button>

          {currentTask && (
            <div className="mt-4 p-3 bg-black/50 border border-[#FF6600]/20 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">目前問題</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetAgents}
                  className="h-5 w-5 p-0 text-gray-500 hover:text-white"
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-xs text-[#FF6600] leading-relaxed">{currentTask}</p>
            </div>
          )}

          {/* Agent Status */}
          <div className="mt-auto pt-4 border-t border-[#FF6600]/20">
            <div className="text-xs text-gray-600 mb-2">AGENT STATUS</div>
            {AGENT_IDS.map((agentId) => {
              const config = AGENT_CONFIGS[agentId];
              const state = agentStates[agentId];
              return (
                <div key={agentId} className="flex items-center gap-2 py-1.5">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      state.status === "processing" ? "animate-pulse" : ""
                    }`}
                    style={{ backgroundColor: config.color }}
                  />
                  <span className="text-xs" style={{ color: config.color }}>
                    {config.displayName}
                  </span>
                  <span className="text-[10px] text-gray-600 ml-auto uppercase tracking-wider">
                    {state.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Panel - Floating Results */}
      <div className="absolute right-4 top-24 bottom-20 w-80 pointer-events-auto">
        <div className="h-full bg-black/60 backdrop-blur-sm border border-[#FF6600]/30 rounded-lg flex flex-col overflow-hidden">
          <div className="p-4 border-b border-[#FF6600]/20">
            <div className={`${notoSansTCClassName} text-lg text-[#FF6600]`}>
              分析結果
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 hide-scrollbar">
            {AGENT_IDS.map((agentId) => {
              const config = AGENT_CONFIGS[agentId];
              const state = agentStates[agentId];

              return (
                <div
                  key={agentId}
                  className="bg-black/40 border rounded-lg overflow-hidden"
                  style={{ borderColor: `${config.color}40` }}
                >
                  <div
                    className="px-3 py-2 flex items-center gap-2 border-b"
                    style={{
                      backgroundColor: `${config.color}10`,
                      borderColor: `${config.color}20`
                    }}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        state.status === "processing" ? "animate-pulse" : ""
                      }`}
                      style={{ backgroundColor: config.color }}
                    />
                    <span className="text-sm font-bold" style={{ color: config.color }}>
                      {config.displayName}
                    </span>
                    <span className="text-[10px] text-gray-500 ml-auto">
                      {config.name}
                    </span>
                  </div>

                  <div className="p-3 min-h-[70px]">
                    {state.status === "idle" && (
                      <span className="text-gray-600 text-xs">等待提問...</span>
                    )}
                    {state.status === "processing" && (
                      <div className="flex items-center gap-2">
                        <span className="animate-pulse" style={{ color: config.color }}>●</span>
                        <span className="text-gray-500 text-xs">分析中...</span>
                      </div>
                    )}
                    {state.status === "complete" && state.response && (
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {state.response}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Bar - Floating Status */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-center pointer-events-none">
        <div className="pointer-events-auto bg-black/60 backdrop-blur-sm border border-[#FF6600]/30 rounded-lg px-6 py-3">
          <div
            className={`text-sm ${
              anyProcessing
                ? "text-[#FF6600]"
                : allComplete
                ? "text-green-500"
                : "text-gray-500"
            }`}
          >
            {anyProcessing
              ? "● MAGI 系統分析中..."
              : allComplete
              ? "● 決議完成"
              : "○ 等待提問"}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Mobile Layout Component ---
export const MobileLayout: React.FC<LayoutProps> = ({
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
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-3 z-10">
        <div className="bg-black/70 backdrop-blur-sm border border-[#FF6600]/30 rounded-lg px-4 py-2 flex justify-between items-center">
          <div className={`${notoSansTCClassName} text-xl font-bold text-[#FF6600]`}>
            MAGI
          </div>
          <div className="flex items-center gap-2">
            {AGENT_IDS.map((agentId) => {
              const config = AGENT_CONFIGS[agentId];
              const state = agentStates[agentId];
              return (
                <div
                  key={agentId}
                  className={`w-2 h-2 rounded-full ${
                    state.status === "processing" ? "animate-pulse" : ""
                  }`}
                  style={{ backgroundColor: config.color }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* MAGI Visualization */}
      <div className="absolute inset-0 flex items-center justify-center pt-16 pb-48">
        <MagiSystem
          colorBalthasar={bgColorBalthasar}
          colorCasper={bgColorCasper}
          colorMelchior={bgColorMelchior}
          scale={0.45}
          contentBalthasar={
            <div className="text-black text-xs font-black">BALTHASAR·2</div>
          }
          contentCasper={
            <div className="text-black text-xs font-black">CASPER·3</div>
          }
          contentMelchior={
            <div className="text-black text-xs font-black">MELCHIOR·1</div>
          }
        />
      </div>

      {/* Bottom Panel */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="bg-black/70 backdrop-blur-sm border border-[#FF6600]/30 rounded-lg p-4">
          {!showResults ? (
            <>
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="有什麼需要決定的事？"
                disabled={isExecuting}
                rows={2}
                className="bg-black/50 border-[#FF6600]/30 text-white text-sm resize-none mb-3"
              />
              <Button
                onClick={handleSubmit}
                disabled={isExecuting || !question.trim()}
                className="w-full bg-[#FF6600] hover:bg-[#FF6600]/80 text-black"
              >
                <Send className="w-4 h-4 mr-2" />
                詢問 MAGI
              </Button>
            </>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs ${anyProcessing ? "text-[#FF6600]" : "text-green-500"}`}>
                  {anyProcessing ? "● 分析中..." : "● 完成"}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    resetAgents();
                    setShowResults(false);
                    setQuestion("");
                  }}
                  className="h-6 text-xs text-gray-500"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  重新提問
                </Button>
              </div>
              {AGENT_IDS.map((agentId) => {
                const config = AGENT_CONFIGS[agentId];
                const state = agentStates[agentId];
                return (
                  <div key={agentId} className="flex items-start gap-2 py-2 border-t border-[#FF6600]/10">
                    <div className="w-2 h-2 rounded-full mt-1" style={{ backgroundColor: config.color }} />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold" style={{ color: config.color }}>
                        {config.displayName}
                      </span>
                      <p className="text-xs text-gray-400 mt-1 truncate">
                        {state.status === "complete" ? state.response : "分析中..."}
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
