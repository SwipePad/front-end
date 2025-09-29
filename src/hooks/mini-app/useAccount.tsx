import { useUser } from "@/components/providers/user-provider";
import { MiniKit } from "@worldcoin/minikit-js";
import { useEffect, useState } from "react";

export const useAccount = () => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const { user } = useUser();
  useEffect(() => {
    if (MiniKit.isInstalled()) {
      setAddress(user.address ?? null);
      setIsConnected(!!MiniKit.user.walletAddress);
      // setChain( || null);
      setChainId(import.meta.env.VITE_CHAIN_ID || null);
    } else {
      console.warn("MiniKit is not installed.");
    }
  }, []);

  return {
    address,
    isConnected,
    chainId,
    nativeToken: import.meta.env.VITE_NATIVE_TOKEN_ADDRESS ?? "",
  };
};
