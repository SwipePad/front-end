import { useEffect, useState } from "react";

export function useTemporaryVisibility(durationMs: number = 3000): boolean {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs]);

  return visible;
}
