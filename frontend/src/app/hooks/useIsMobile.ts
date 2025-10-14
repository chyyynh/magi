import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Custom hook to determine if the current window width is considered mobile.
 * @returns A boolean indicating if the screen width is below the mobile breakpoint (768px).
 */
const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window is defined (for SSR compatibility)
    if (typeof window === "undefined") {
      // Default to non-mobile or handle as needed for SSR
      setIsMobile(false);
      return;
    }

    const checkDeviceSize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Initial check
    checkDeviceSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkDeviceSize);

    // Cleanup function to remove event listener
    return () => window.removeEventListener("resize", checkDeviceSize);
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  return isMobile;
};

export default useIsMobile;
