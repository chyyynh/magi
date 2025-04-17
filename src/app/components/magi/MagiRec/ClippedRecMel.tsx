import type React from "react";
import useResponsiveSize from "../../../hooks/useResponsiveSize"; // Import the hook

// Define default dimensions
const DEFAULT_WIDTH = 310;
const DEFAULT_HEIGHT = 160;

interface ClippedRectangleProps {
  // width and height are now handled internally
  color: string;
  // Keep borderColor and borderWidth if they are meant to be customizable,
  // otherwise remove them and define defaults inside the component.
  // Assuming they are not needed based on current usage.
  // borderColor?: string;
  // borderWidth?: number;
  children?: React.ReactNode;
}

// Renaming component to match filename convention
const ClippedRecMel: React.FC<ClippedRectangleProps> = ({
  color,
  children,
}) => {
  // Get responsive dimensions from the hook
  const { width, height } = useResponsiveSize(DEFAULT_WIDTH, DEFAULT_HEIGHT);

  // The clip path for both the outer and inner elements
  const clipPath = "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 35%)";
  const borderColor = "#FF6600"; // Default border color
  const borderWidth = 4; // Default border width

  // Outer element style (this will be the "border")
  const outerStyle: React.CSSProperties = {
    width: `${width}px`, // Use responsive width
    height: `${height}px`, // Use responsive height
    backgroundColor: borderColor,
    clipPath,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  // Inner element style (this will be the content area)
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

export default ClippedRecMel; // Export with the correct name
