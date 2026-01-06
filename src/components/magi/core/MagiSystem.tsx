"use client";

import React from "react";

/**
 * MAGI System - SVG Implementation with Motion Animations
 *
 * Based on Evangelion MAGI computer system layout.
 */

interface MagiSystemProps {
  colorBalthasar: string;
  colorCasper: string;
  colorMelchior: string;
  contentBalthasar?: React.ReactNode;
  contentCasper?: React.ReactNode;
  contentMelchior?: React.ReactNode;
  scale?: number;
}

// SVG Viewbox dimensions
const WIDTH = 800;
const HEIGHT = 600;
const BORDER_COLOR = "#FFFFFF";
const STROKE_WIDTH = 2;

// Unit dimensions
const UNIT_W = 300;
const UNIT_H_TOP = 240;
const UNIT_H_BOT = 180;
const CUT = 60;

// Positions
const CX = WIDTH / 2;
const GAP = 100;

// Balthasar (top center)
const BAL_X = CX - UNIT_W / 2;
const BAL_Y = 120;

// Bottom units
const BOT_Y = 380;
const CAS_X = CX - UNIT_W - GAP / 2;
const MEL_X = CX + GAP / 2;

// SVG Path definitions
const BALTHASAR_PATH = `
  M ${BAL_X} ${BAL_Y}
  L ${BAL_X + UNIT_W} ${BAL_Y}
  L ${BAL_X + UNIT_W} ${BAL_Y + UNIT_H_TOP - CUT}
  L ${BAL_X + UNIT_W - CUT} ${BAL_Y + UNIT_H_TOP}
  L ${BAL_X + CUT} ${BAL_Y + UNIT_H_TOP}
  L ${BAL_X} ${BAL_Y + UNIT_H_TOP - CUT}
  Z
`;

const CASPER_PATH = `
  M ${CAS_X} ${BOT_Y}
  L ${CAS_X + UNIT_W - CUT} ${BOT_Y}
  L ${CAS_X + UNIT_W} ${BOT_Y + CUT}
  L ${CAS_X + UNIT_W} ${BOT_Y + UNIT_H_BOT}
  L ${CAS_X} ${BOT_Y + UNIT_H_BOT}
  Z
`;

const MELCHIOR_PATH = `
  M ${MEL_X + CUT} ${BOT_Y}
  L ${MEL_X + UNIT_W} ${BOT_Y}
  L ${MEL_X + UNIT_W} ${BOT_Y + UNIT_H_BOT}
  L ${MEL_X} ${BOT_Y + UNIT_H_BOT}
  L ${MEL_X} ${BOT_Y + CUT}
  Z
`;

// Center positions for data flow
const MAGI_CENTER = {
  x: CX,
  y: (BAL_Y + UNIT_H_TOP + BOT_Y) / 2 + 15,
};

const BAL_CENTER = { x: BAL_X + UNIT_W / 2, y: BAL_Y + UNIT_H_TOP / 2 - 20 };
const CAS_CENTER = { x: CAS_X + (UNIT_W - CUT) / 2, y: BOT_Y + UNIT_H_BOT / 2 };
const MEL_CENTER = { x: MEL_X + CUT + (UNIT_W - CUT) / 2, y: BOT_Y + UNIT_H_BOT / 2 };

const MagiSystem: React.FC<MagiSystemProps> = ({
  colorBalthasar,
  colorCasper,
  colorMelchior,
  contentBalthasar,
  contentCasper,
  contentMelchior,
  scale = 1,
}) => {
  return (
    <div
      className="relative"
      style={{
        width: `${WIDTH}px`,
        height: `${HEIGHT}px`,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-full"
        style={{ overflow: "visible" }}
      >
        {/* Pattern & Filter Definitions */}
        <defs>
          {/* Diagonal stripes pattern */}
          <pattern id="diagonalStripes" patternUnits="userSpaceOnUse" width="8" height="8">
            <path d="M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"/>
          </pattern>

          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Pulse glow filter */}
          <filter id="pulseGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Data flow gradient */}
          <linearGradient id="dataFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="50%" stopColor="white" stopOpacity="0.8" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="black" />

        {/* Animated Grid background */}
        <g opacity="0.06">
          {Array.from({ length: 20 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={i * 30}
              x2={WIDTH}
              y2={i * 30}
              stroke={BORDER_COLOR}
              strokeWidth="0.5"
            />
          ))}
          {Array.from({ length: 27 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * 30}
              y1="0"
              x2={i * 30}
              y2={HEIGHT}
              stroke={BORDER_COLOR}
              strokeWidth="0.5"
            />
          ))}
        </g>

        {/* Diagonal stripes overlay */}
        <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="url(#diagonalStripes)" opacity="0.2" />

        {/* ===== ANIMATED ELEMENTS ===== */}

        {/* Orbiting circles around center */}
        <g transform={`translate(${MAGI_CENTER.x}, ${MAGI_CENTER.y})`}>
          {/* Outer orbit ring */}
          <circle
            r="180"
            fill="none"
            stroke={BORDER_COLOR}
            strokeWidth="0.5"
            opacity="0.1"
            strokeDasharray="4 4"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0"
              to="360"
              dur="60s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Middle orbit ring */}
          <circle
            r="140"
            fill="none"
            stroke={BORDER_COLOR}
            strokeWidth="0.5"
            opacity="0.15"
            strokeDasharray="8 4"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360"
              to="0"
              dur="45s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Inner orbit ring */}
          <circle
            r="100"
            fill="none"
            stroke={BORDER_COLOR}
            strokeWidth="0.5"
            opacity="0.2"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0"
              to="360"
              dur="30s"
              repeatCount="indefinite"
            />
          </circle>

          {/* Orbiting particles */}
          {[0, 120, 240].map((angle, i) => (
            <g key={`orbit-particle-${i}`}>
              <circle r="3" fill={BORDER_COLOR} opacity="0.4" filter="url(#glow)">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from={`${angle}`}
                  to={`${angle + 360}`}
                  dur={`${20 + i * 5}s`}
                  repeatCount="indefinite"
                />
                <animateMotion
                  path={`M 0 0 m -${140 + i * 20} 0 a ${140 + i * 20} ${140 + i * 20} 0 1 1 ${(140 + i * 20) * 2} 0 a ${140 + i * 20} ${140 + i * 20} 0 1 1 -${(140 + i * 20) * 2} 0`}
                  dur={`${25 + i * 8}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          ))}
        </g>

        {/* Data flow lines - BALTHASAR to center */}
        <line
          x1={BAL_CENTER.x}
          y1={BAL_CENTER.y + 80}
          x2={MAGI_CENTER.x}
          y2={MAGI_CENTER.y - 30}
          stroke={BORDER_COLOR}
          strokeWidth="1"
          opacity="0.15"
          strokeDasharray="4 4"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="100"
            to="0"
            dur="3s"
            repeatCount="indefinite"
          />
        </line>

        {/* Data flow lines - CASPER to center */}
        <line
          x1={CAS_CENTER.x + 60}
          y1={CAS_CENTER.y - 40}
          x2={MAGI_CENTER.x - 40}
          y2={MAGI_CENTER.y + 10}
          stroke={BORDER_COLOR}
          strokeWidth="1"
          opacity="0.15"
          strokeDasharray="4 4"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="100"
            to="0"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </line>

        {/* Data flow lines - MELCHIOR to center */}
        <line
          x1={MEL_CENTER.x - 60}
          y1={MEL_CENTER.y - 40}
          x2={MAGI_CENTER.x + 40}
          y2={MAGI_CENTER.y + 10}
          stroke={BORDER_COLOR}
          strokeWidth="1"
          opacity="0.15"
          strokeDasharray="4 4"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="100"
            to="0"
            dur="3.5s"
            repeatCount="indefinite"
          />
        </line>

        {/* Pulsing center glow */}
        <circle
          cx={MAGI_CENTER.x}
          cy={MAGI_CENTER.y}
          r="60"
          fill={BORDER_COLOR}
          opacity="0.03"
        >
          <animate
            attributeName="r"
            values="60;80;60"
            dur="4s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.03;0.08;0.03"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>

        {/* ===== MAIN PANELS ===== */}

        {/* BALTHASAR Panel */}
        <path
          d={BALTHASAR_PATH}
          fill={colorBalthasar}
          stroke={BORDER_COLOR}
          strokeWidth={STROKE_WIDTH}
        />

        {/* CASPER Panel */}
        <path
          d={CASPER_PATH}
          fill={colorCasper}
          stroke={BORDER_COLOR}
          strokeWidth={STROKE_WIDTH}
        />

        {/* MELCHIOR Panel */}
        <path
          d={MELCHIOR_PATH}
          fill={colorMelchior}
          stroke={BORDER_COLOR}
          strokeWidth={STROKE_WIDTH}
        />

        {/* Panel corner accents */}
        {/* Balthasar corners */}
        <path d={`M ${BAL_X + 8} ${BAL_Y} L ${BAL_X + 8} ${BAL_Y + 20}`} stroke={BORDER_COLOR} strokeWidth="1" opacity="0.3" />
        <path d={`M ${BAL_X} ${BAL_Y + 8} L ${BAL_X + 20} ${BAL_Y + 8}`} stroke={BORDER_COLOR} strokeWidth="1" opacity="0.3" />
        <path d={`M ${BAL_X + UNIT_W - 8} ${BAL_Y} L ${BAL_X + UNIT_W - 8} ${BAL_Y + 20}`} stroke={BORDER_COLOR} strokeWidth="1" opacity="0.3" />
        <path d={`M ${BAL_X + UNIT_W} ${BAL_Y + 8} L ${BAL_X + UNIT_W - 20} ${BAL_Y + 8}`} stroke={BORDER_COLOR} strokeWidth="1" opacity="0.3" />

        {/* Center MAGI Label */}
        <g transform={`translate(${MAGI_CENTER.x}, ${MAGI_CENTER.y})`}>
          {/* Animated border */}
          <rect
            x="-65"
            y="-25"
            width="130"
            height="50"
            fill="black"
            stroke={BORDER_COLOR}
            strokeWidth="2"
          />
          {/* Inner glow rect */}
          <rect
            x="-60"
            y="-20"
            width="120"
            height="40"
            fill="none"
            stroke={BORDER_COLOR}
            strokeWidth="0.5"
            opacity="0.3"
          >
            <animate
              attributeName="opacity"
              values="0.3;0.6;0.3"
              dur="2s"
              repeatCount="indefinite"
            />
          </rect>
          <text
            x="0"
            y="8"
            textAnchor="middle"
            fill={BORDER_COLOR}
            fontSize="28"
            fontWeight="bold"
            fontFamily="monospace"
            letterSpacing="0.2em"
          >
            MAGI
          </text>
        </g>

        {/* Outer frame */}
        <rect
          x="2"
          y="2"
          width={WIDTH - 4}
          height={HEIGHT - 4}
          fill="none"
          stroke={BORDER_COLOR}
          strokeWidth="2"
        />

        {/* Corner brackets */}
        <path d="M 15 5 L 5 5 L 5 15" stroke={BORDER_COLOR} strokeWidth="2" fill="none" />
        <path d="M 25 5 L 25 15" stroke={BORDER_COLOR} strokeWidth="1" fill="none" opacity="0.5" />
        <path d={`M ${WIDTH - 15} 5 L ${WIDTH - 5} 5 L ${WIDTH - 5} 15`} stroke={BORDER_COLOR} strokeWidth="2" fill="none" />
        <path d={`M ${WIDTH - 25} 5 L ${WIDTH - 25} 15`} stroke={BORDER_COLOR} strokeWidth="1" fill="none" opacity="0.5" />
        <path d={`M 15 ${HEIGHT - 5} L 5 ${HEIGHT - 5} L 5 ${HEIGHT - 15}`} stroke={BORDER_COLOR} strokeWidth="2" fill="none" />
        <path d={`M 25 ${HEIGHT - 5} L 25 ${HEIGHT - 15}`} stroke={BORDER_COLOR} strokeWidth="1" fill="none" opacity="0.5" />
        <path d={`M ${WIDTH - 15} ${HEIGHT - 5} L ${WIDTH - 5} ${HEIGHT - 5} L ${WIDTH - 5} ${HEIGHT - 15}`} stroke={BORDER_COLOR} strokeWidth="2" fill="none" />
        <path d={`M ${WIDTH - 25} ${HEIGHT - 5} L ${WIDTH - 25} ${HEIGHT - 15}`} stroke={BORDER_COLOR} strokeWidth="1" fill="none" opacity="0.5" />

        {/* Technical labels */}
        <text x="35" y="18" fill={BORDER_COLOR} fontSize="10" fontFamily="monospace" opacity="0.4">
          SYS:MAGI_v3.14
        </text>
        <text x={WIDTH - 120} y="18" fill={BORDER_COLOR} fontSize="10" fontFamily="monospace" opacity="0.4">
          SEC_LV:01
        </text>
        <text x="35" y={HEIGHT - 10} fill={BORDER_COLOR} fontSize="10" fontFamily="monospace" opacity="0.4">
          0x8F2A
        </text>
        <text x={WIDTH - 80} y={HEIGHT - 10} fill={BORDER_COLOR} fontSize="10" fontFamily="monospace" opacity="0.4">
          ACTIVE
        </text>

        {/* Decorative lines */}
        <line x1="120" y1="12" x2="200" y2="12" stroke={BORDER_COLOR} strokeWidth="1" opacity="0.2" />
        <line x1={WIDTH - 200} y1="12" x2={WIDTH - 130} y2="12" stroke={BORDER_COLOR} strokeWidth="1" opacity="0.2" />

        {/* Animated scan line */}
        <line
          x1="0"
          y1="0"
          x2={WIDTH}
          y2="0"
          stroke={BORDER_COLOR}
          strokeWidth="1"
          opacity="0.1"
        >
          <animate
            attributeName="y1"
            values="0;600;0"
            dur="8s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y2"
            values="0;600;0"
            dur="8s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.1;0.3;0.1"
            dur="8s"
            repeatCount="indefinite"
          />
        </line>
      </svg>

      {/* HTML Content overlays */}
      <div
        className="absolute flex flex-col items-center justify-center text-center"
        style={{
          left: `${BAL_X + 20}px`,
          top: `${BAL_Y + 20}px`,
          width: `${UNIT_W - 40}px`,
          height: `${UNIT_H_TOP - CUT - 40}px`,
        }}
      >
        {contentBalthasar}
      </div>

      <div
        className="absolute flex flex-col items-center justify-center text-center"
        style={{
          left: `${CAS_X + 20}px`,
          top: `${BOT_Y + 20}px`,
          width: `${UNIT_W - CUT - 40}px`,
          height: `${UNIT_H_BOT - 40}px`,
        }}
      >
        {contentCasper}
      </div>

      <div
        className="absolute flex flex-col items-center justify-center text-center"
        style={{
          left: `${MEL_X + CUT + 20}px`,
          top: `${BOT_Y + 20}px`,
          width: `${UNIT_W - CUT - 40}px`,
          height: `${UNIT_H_BOT - 40}px`,
        }}
      >
        {contentMelchior}
      </div>
    </div>
  );
};

export default MagiSystem;
