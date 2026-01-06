"use client";

import React from "react";

/**
 * MAGI System - SVG Implementation
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
const BORDER_COLOR = "#FF6600";
const STROKE_WIDTH = 3;

// Unit dimensions
const UNIT_W = 300;
const UNIT_H_TOP = 240;
const UNIT_H_BOT = 180;
const CUT = 60;

// Positions
const CX = WIDTH / 2;
const GAP = 100; // Increased gap between bottom panels

// Balthasar (top center) - moved down
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

// Center MAGI position
const MAGI_CENTER = {
  x: CX,
  y: (BAL_Y + UNIT_H_TOP + BOT_Y) / 2 + 15,
};

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
        {/* Background */}
        <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="black" />

        {/* Grid background */}
        <g opacity="0.05">
          {Array.from({ length: 20 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={i * 30}
              x2={WIDTH}
              y2={i * 30}
              stroke={BORDER_COLOR}
              strokeWidth="1"
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
              strokeWidth="1"
            />
          ))}
        </g>

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

        {/* Center MAGI Label */}
        <g transform={`translate(${MAGI_CENTER.x}, ${MAGI_CENTER.y})`}>
          <rect
            x="-60"
            y="-22"
            width="120"
            height="44"
            fill="black"
            stroke={BORDER_COLOR}
            strokeWidth="2"
          />
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
          strokeWidth="3"
        />
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
