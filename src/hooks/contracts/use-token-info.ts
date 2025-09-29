import { useReadContract } from "wagmi";
import { erc20Abi } from "viem";
import { isAddress } from "viem";
import { useState, useEffect } from "react";

// Add token list URL constant
const HERCULES_TOKEN_LIST_URL = "https://tokens-list.hercules.exchange/tokens.json";

// Token list cache singleton
let tokenListCache: { tokens: HerculesToken[] } | null = null;
let tokenListPromise: Promise<{ tokens: HerculesToken[] }> | null = null;

// Function to get token list with caching
async function getTokenList() {
  // Return cached data if available
  if (tokenListCache) {
    return tokenListCache;
  }

  // Return existing promise if we're already fetching
  if (tokenListPromise) {
    return tokenListPromise;
  }

  // Create new promise for fetching
  tokenListPromise = fetch(HERCULES_TOKEN_LIST_URL)
    .then(response => response.json())
    .then(data => {
      tokenListCache = data;
      tokenListPromise = null;
      return data;
    })
    .catch(error => {
      tokenListPromise = null;
      throw error;
    });

  return tokenListPromise;
}

export interface TokenMetadata {
  name: string;
  decimals: number;
  symbol: string;
  totalSupply?: bigint;
  imageUrl?: string;
  description?: string;
  tags?: string[];
  twitter?: string;
  discord?: string;
  docs?: string;
  website?: string;
}

interface HerculesToken {
  address: string;
  logoURI: string;
  description?: string;
  tags?: string[];
  twitter?: string;
  discord?: string;
  docs?: string;
  website?: string;
}

export function useTokenInfo(tokenAddress?: string) {
  const isValidAddress = tokenAddress ? isAddress(tokenAddress) : false;

  const { data: name } = useReadContract({
    address: isValidAddress ? (tokenAddress as `0x${string}`) : undefined,
    abi: erc20Abi,
    functionName: "name",
  });

  const { data: symbol } = useReadContract({
    address: isValidAddress ? (tokenAddress as `0x${string}`) : undefined,
    abi: erc20Abi,
    functionName: "symbol",
  });

  const { data: decimals } = useReadContract({
    address: isValidAddress ? (tokenAddress as `0x${string}`) : undefined,
    abi: erc20Abi,
    functionName: "decimals",
  });

  const { data: totalSupply } = useReadContract({
    address: isValidAddress ? (tokenAddress as `0x${string}`) : undefined,
    abi: erc20Abi,
    functionName: "totalSupply",
  });

  // Add token list metadata fetching
  const [tokenMetadata, setTokenMetadata] = useState<HerculesToken | null>(null);

  useEffect(() => {
    async function fetchTokenList() {
      if (!isValidAddress) return;

      try {
        const data = await getTokenList();
        const token = data.tokens.find(
          (t: HerculesToken) => t.address.toLowerCase() === tokenAddress?.toLowerCase()
        );
        if (token) {
          setTokenMetadata(token);
        }
      } catch (error) {
        console.error("Error fetching token list:", error);
      }
    }

    fetchTokenList();
  }, [tokenAddress, isValidAddress]);

  if (!isValidAddress || !name || !symbol || decimals === undefined) {
    return { data: undefined, isValidAddress };
  }

  return {
    data: {
      name,
      symbol,
      decimals,
      totalSupply,
      imageUrl: tokenMetadata?.logoURI,
      description: tokenMetadata?.description,
      tags: tokenMetadata?.tags,
      twitter: tokenMetadata?.twitter,
      discord: tokenMetadata?.discord,
      docs: tokenMetadata?.docs,
      website: tokenMetadata?.website,
    } as TokenMetadata,
    isValidAddress,
  };
}
