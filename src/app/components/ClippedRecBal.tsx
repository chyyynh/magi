import type React from "react";
import useResponsiveSize from "../hooks/useResponsiveSize"; // Import the hook

// Define default dimensions
const DEFAULT_WIDTH = 250;
const DEFAULT_HEIGHT = 300;

interface ClippedRectangleProps {
  // width and height are now handled internally
  color: string;
  children?: React.ReactNode;
}

const ClippedRecBal: React.FC<ClippedRectangleProps> = ({
  color,
  children,
}) => {
  // Get responsive dimensions from the hook
  const { width, height } = useResponsiveSize(DEFAULT_WIDTH, DEFAULT_HEIGHT);

  const borderColor = "#FF6600";
  const borderWidth = 4;
  const clipPath =
    "polygon(0% 0%, 100% 0%, 100% 80%, 75% 100%, 25% 100%, 0% 80%)";

  const outerStyle: React.CSSProperties = {
    width: `${width}px`, // Use responsive width
    height: `${height}px`, // Use responsive height
    backgroundColor: borderColor,
    clipPath,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const innerStyle: React.CSSProperties = {
    width: `${width - borderWidth * 2}px`, // Use responsive width
    height: `${height - borderWidth * 2}px`, // Use responsive height
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

export default ClippedRecBal;
