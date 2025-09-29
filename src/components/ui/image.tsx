import { DEFAULT_IMAGE } from "@/constants/common";
import { useState } from "react";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  size?: number;
}

export function Image({
  src,
  alt,
  fallbackSrc = DEFAULT_IMAGE,
  size,
  className,
  ...props
}: ImageProps) {
  const [error, setError] = useState<any>(false);

  // Convert image URL to use wsrv.nl for optimization
  const getOptimizedUrl = (url: string) => {
    if (!url) return fallbackSrc;

    // Skip optimization for local assets and non-https URLs
    if (!url.startsWith("https://")) {
      return url; // Return original URL for local images
    }

    // Skip if already using wsrv.nl or if it's a data URL
    if (url.includes("wsrv.nl") || url.startsWith("data:") || url.includes(".fun")) return url;

    // Construct wsrv.nl URL with optimization parameters
    const wsrvUrl = new URL("https://wsrv.nl/");
    wsrvUrl.searchParams.set("url", url);

    // Add size if specified
    if (size) {
      wsrvUrl.searchParams.set("w", size.toString());
      wsrvUrl.searchParams.set("h", size.toString());
    }

    // Enable WebP if supported
    wsrvUrl.searchParams.set("output", "webp");

    return wsrvUrl.toString();
  };

  return (
    <img
      src={error ? fallbackSrc : getOptimizedUrl(src || "")}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
      crossOrigin="anonymous"
      // Add caching attributes for local images
      fetchPriority="auto"
      decoding="async"
      {...props}
    />
  );
}
