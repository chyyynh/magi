import { useState, useEffect } from "react";

interface Size {
  width: number;
  height: number;
}

const MOBILE_BREAKPOINT = 768;
const SCALE_FACTOR = 0.5; // 50% scaling for mobile

/**
 * Custom hook to calculate responsive dimensions based on window width.
 * @param defaultWidth The default width for larger screens.
 * @param defaultHeight The default height for larger screens.
 * @returns An object containing the calculated width and height.
 */
const useResponsiveSize = (
  defaultWidth: number,
  defaultHeight: number
): Size => {
  const [size, setSize] = useState<Size>({
    width: defaultWidth,
    height: defaultHeight,
  });

  useEffect(() => {
    // Check if window is defined (for SSR compatibility)
    if (typeof window === "undefined") {
      return;
    }

    const calculateSize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < MOBILE_BREAKPOINT) {
        setSize({
          width: Math.round(defaultWidth * SCALE_FACTOR),
          height: Math.round(defaultHeight * SCALE_FACTOR),
        });
      } else {
        setSize({
          width: defaultWidth,
          height: defaultHeight,
        });
      }
    };

    // Calculate initial size
    calculateSize();

    // Add event listener for window resize
    window.addEventListener("resize", calculateSize);

    // Cleanup function to remove event listener
    return () => window.removeEventListener("resize", calculateSize);
  }, [defaultWidth, defaultHeight]); // Re-run effect if default dimensions change

  return size;
};

export default useResponsiveSize;
