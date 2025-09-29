import { useEffect, useState } from "react";

export function useIsBeforeLaunch() {
  const [isBeforeLaunch, setIsBeforeLaunch] = useState(true);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const launchDate = new Date("2025-01-09T01:00:00Z");

      setIsBeforeLaunch(now < launchDate);
    };

    // Check immediately and then every second
    checkTime();
    const interval = setInterval(checkTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Skip launch check for specified domain
  if (typeof window !== "undefined" && window.location.hostname === "pumpe-dapp.vercel.app") {
    return false; // Always return false to indicate we're not before launch
  }

  return isBeforeLaunch;
}
