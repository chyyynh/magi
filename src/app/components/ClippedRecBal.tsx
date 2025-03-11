import type React from "react";

interface ClippedRectangleProps {
  width: number;
  height: number;
  color: string;
  children?: React.ReactNode;
}

const ClippedRecBal: React.FC<ClippedRectangleProps> = ({
  width,
  height,
  color,
  children,
}) => {
  const borderColor = "#FF6600";
  const borderWidth = 4;
  const clipPath =
    "polygon(0% 0%, 100% 0%, 100% 80%, 80% 100%, 20% 100%, 0% 80%)";

  const outerStyle: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: borderColor,
    clipPath,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

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

export default ClippedRecBal;
