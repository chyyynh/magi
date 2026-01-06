"use client";

import React from "react";

// Corner bracket decorations for panels
export const CornerBrackets: React.FC<{ className?: string; size?: number }> = ({
  className = "",
  size = 12,
}) => (
  <>
    {/* Top-left */}
    <div
      className={`absolute top-0 left-0 border-l-2 border-t-2 border-white ${className}`}
      style={{ width: size, height: size }}
    />
    {/* Top-right */}
    <div
      className={`absolute top-0 right-0 border-r-2 border-t-2 border-white ${className}`}
      style={{ width: size, height: size }}
    />
    {/* Bottom-left */}
    <div
      className={`absolute bottom-0 left-0 border-l-2 border-b-2 border-white ${className}`}
      style={{ width: size, height: size }}
    />
    {/* Bottom-right */}
    <div
      className={`absolute bottom-0 right-0 border-r-2 border-b-2 border-white ${className}`}
      style={{ width: size, height: size }}
    />
  </>
);

// Technical code display component
export const TechCode: React.FC<{
  code: string;
  className?: string;
}> = ({ code, className = "" }) => (
  <div
    className={`font-mono text-[8px] text-white/30 tracking-widest uppercase ${className}`}
  >
    {code}
  </div>
);

// Status indicator with technical styling
export const StatusIndicator: React.FC<{
  status: "active" | "standby" | "processing" | "error";
  label?: string;
}> = ({ status, label }) => {
  const styles = {
    active: "bg-white",
    standby: "bg-white/30",
    processing: "bg-white animate-pulse",
    error: "bg-white",
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 ${styles[status]}`} />
      {label && (
        <span className="font-mono text-[10px] text-white/50 uppercase tracking-wider">
          {label}
        </span>
      )}
    </div>
  );
};

// Decorative line with endpoint marks
export const TechLine: React.FC<{
  direction?: "horizontal" | "vertical";
  className?: string;
}> = ({ direction = "horizontal", className = "" }) => (
  <div
    className={`relative ${
      direction === "horizontal" ? "w-full h-px" : "w-px h-full"
    } bg-white/20 ${className}`}
  >
    <div
      className={`absolute ${
        direction === "horizontal"
          ? "left-0 top-1/2 -translate-y-1/2"
          : "top-0 left-1/2 -translate-x-1/2"
      } w-1.5 h-1.5 bg-white`}
    />
    <div
      className={`absolute ${
        direction === "horizontal"
          ? "right-0 top-1/2 -translate-y-1/2"
          : "bottom-0 left-1/2 -translate-x-1/2"
      } w-1.5 h-1.5 bg-white`}
    />
  </div>
);

// Random code decoration overlay
export const DataOverlay: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const generateCode = () =>
    Math.random().toString(16).substring(2, 10).toUpperCase();

  return (
    <div
      className={`absolute inset-0 pointer-events-none font-mono text-[8px] text-white/20 ${className}`}
    >
      <div className="absolute top-2 left-2">{generateCode()}</div>
      <div className="absolute top-2 right-2">{generateCode()}</div>
      <div className="absolute bottom-2 left-2">{generateCode()}</div>
      <div className="absolute bottom-2 right-2">{generateCode()}</div>
    </div>
  );
};

// Technical label with industrial styling
export const TechLabel: React.FC<{
  text: string;
  className?: string;
}> = ({ text, className = "" }) => (
  <div
    className={`font-mono text-[10px] tracking-[0.3em] uppercase text-white/60 ${className}`}
  >
    {text}
  </div>
);

// Diagonal stripes background
export const DiagonalStripes: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <div
    className={`absolute inset-0 pointer-events-none ${className}`}
    style={{
      background: `repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 2px,
        rgba(255, 255, 255, 0.02) 2px,
        rgba(255, 255, 255, 0.02) 4px
      )`,
    }}
  />
);

// Grid background
export const GridBackground: React.FC<{ className?: string }> = ({
  className = "",
}) => (
  <div
    className={`absolute inset-0 pointer-events-none ${className}`}
    style={{
      backgroundImage: `
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
      `,
      backgroundSize: "20px 20px",
    }}
  />
);

// Glitch text component
export const GlitchText: React.FC<{
  text: string;
  className?: string;
}> = ({ text, className = "" }) => (
  <span className={`cyber-glitch ${className}`} data-text={text}>
    {text}
  </span>
);

// HUD Frame wrapper
export const HUDFrame: React.FC<{
  children: React.ReactNode;
  className?: string;
  showBrackets?: boolean;
  showOverlay?: boolean;
}> = ({ children, className = "", showBrackets = true, showOverlay = false }) => (
  <div className={`relative ${className}`}>
    {showBrackets && <CornerBrackets />}
    {showOverlay && <DataOverlay />}
    <DiagonalStripes />
    {children}
  </div>
);
