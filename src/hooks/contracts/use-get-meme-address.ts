import { useEffect, useState } from "react";
import { useMemeControllerCreateMemeNoFeeRequest } from "@/services/queries";
import { MemeFactoryAbi } from "@/smart-contracts/abi";
import { useReadContract } from "wagmi";
import { generateTokenId } from "@/lib/utils";
import { NATIVE_TOKEN_ADDRESS } from "@/constants/blockchain";

// This hook is used to validate the meme token address to ensure that native token alway be token1
export const useValidMemeTokenAddress = () => {
  const [tokenId, setTokenId] = useState<string>(generateTokenId());
  const [validTokenAddress, setValidTokenAddress] = useState<string | null>(null);

  const { data: noFeeRequestData } = useMemeControllerCreateMemeNoFeeRequest({});

  const { data: tokenAddress } = useReadContract({
    address: import.meta.env.VITE_TOKEN_FACTORY_ADDRESS,
    abi: MemeFactoryAbi,
    functionName: "getMemeAddress",
    args: [tokenId],
    query: {
      enabled: !!tokenId, // only trigger when tokenId is ready
    },
  });

  // When create token with no fee request, use the tokenId from the request
  useEffect(() => {
    if (noFeeRequestData?.tokenId) {
      setTokenId(noFeeRequestData.tokenId);
    }
  }, [noFeeRequestData?.tokenId]);

  useEffect(() => {
    const validate = async () => {
      if (!tokenAddress) return;

      try {
        const newTokenBN = BigInt((tokenAddress as string).toLowerCase());
        const nativeTokenBN = BigInt(NATIVE_TOKEN_ADDRESS.toLowerCase());

        if (newTokenBN < nativeTokenBN) {
          setValidTokenAddress(tokenAddress as string);
        } else {
          // Generate new tokenId until it's valid
          const nextId = generateTokenId();
          setTokenId(nextId);
        }
      } catch (err) {
        console.error("Error converting token address to BigInt:", err);
      }
    };

    validate();
  }, [tokenAddress]);

  return {
    tokenId,
    tokenAddress: validTokenAddress,
    noFeeRequestData,
  };
};
