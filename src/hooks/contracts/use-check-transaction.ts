import { useEffect, useRef, useState } from "react";
import { useWaitForTransactionReceipt } from "@worldcoin/minikit-react";
import { createPublicClient, http } from "viem";
import { worldchain } from "wagmi/chains";
import { useTranslation } from "react-i18next";

const client = createPublicClient({
  chain: worldchain,
  transport: http("https://worldchain-mainnet.g.alchemy.com/public"),
});

export const useCheckTransaction = () => {
  const [transactionId, setTransactionId] = useState<string>("");
  const { isSuccess: isConfirmed, error } = useWaitForTransactionReceipt({
    client: client as any,
    appConfig: {
      app_id: import.meta.env.VITE_APP_ID,
    },
    transactionId: transactionId,
  });
  const isConfirmedRef = useRef(isConfirmed);
  const errorRef = useRef(error);
  const transactionIdRef = useRef(transactionId);
  const { t } = useTranslation();

  useEffect(() => {
    // bất cứ khi nào giá trị thay đổi
    isConfirmedRef.current = isConfirmed;
    errorRef.current = error;
    transactionIdRef.current = transactionId;
  }, [isConfirmed, error, transactionId]);

  const checkTransactionStatus = async (_transactionId: string) => {
    if (!_transactionId) {
      console.warn("Transaction ID is not provided.");
      return;
    }

    setTransactionId(_transactionId);
    // Return a promise that resolves when the transaction is complete
    return new Promise((resolve, reject) => {
      let maxCount = 60; // Maximum number of checks
      let count = 0; // Current check count
      const checkStatus = () => {
        if (transactionIdRef.current && isConfirmedRef.current) {
          if (errorRef.current) {
            reject(error);
            return;
          }
          console.log("Transaction confirmed!");
          setTransactionId(""); // Reset transaction ID
          resolve(true);
        } else {
          if (count >= maxCount) {
            console.error("Transaction confirmation timed out.");
            setTransactionId(""); // Reset transaction ID
            reject(new Error(t("toaster.transactionTimeout")));
            return;
          }
          console.log("Transaction is confirming...");
          setTimeout(checkStatus, 1000); // Check every second
          count++;
        }
      };
      checkStatus();
    });
  };

  return {
    checkTransactionStatus,
  };
};
