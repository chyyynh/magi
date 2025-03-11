import type React from "react";

interface ClippedRectangleProps {
  width: number;
  height: number;
  color: string;
  borderColor?: string;
  borderWidth?: number;
  children?: React.ReactNode;
}

const ClippedRectangle: React.FC<ClippedRectangleProps> = ({
  width,
  height,
  color,
  children,
}) => {
  // The clip path for both the outer and inner elements
  const clipPath = "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 20%)";
  const borderColor = "#FF6600";
  const borderWidth = 4;

  // Outer element style (this will be the "border")
  const outerStyle: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: borderColor,
    clipPath,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  // Inner element style (this will be the content area)
  const innerStyle: React.CSSProperties = {
    width: `${width - borderWidth * 2}px`,
    height: `${height - borderWidth * 2}px`,
    backgroundColor: color,
    clipPath,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div style={outerStyle}>
      <div style={innerStyle}>{children}</div>
    </div>
  );
};

export default ClippedRectangle;
