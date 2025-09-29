import { useState, useEffect } from "react";

/**
 * A SSR-safe hook that detects if a media query matches the current screen size
 * @param query The media query to check (e.g. "(max-width: 768px)")
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  // Default to false on server-side
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia(query);

      // Set initial value
      setMatches(mediaQuery.matches);

      // Create event listener function
      const handleChange = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };

      // Add event listener
      mediaQuery.addEventListener("change", handleChange);

      // Cleanup
      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }
  }, [query]); // Re-run effect if query changes

  return matches;
}
