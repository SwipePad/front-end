import { useEffect } from "react";
import { storeReferralAddress } from "@/lib/referral";

export const useReferralParams = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const referralAddress = urlParams.get("refAddress");

    if (referralAddress) {
      storeReferralAddress(referralAddress);

      // Clean up URL without refreshing the page
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, "", newUrl);
    }
  }, []);
};
