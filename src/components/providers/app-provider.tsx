import { useUser } from "@/components/providers/user-provider";
import { GOOGLE_ANALYTICS_ID } from "@/constants/analytics";
import { router } from "@/main";
import { userControllerUpdate } from "@/services/queries";
import { makeApiRequest } from "@/services/trading-chart/helpers";
import { initGA, logPageView } from "@/utils/analytics";
import { MiniKit } from "@worldcoin/minikit-js";
import React, { Fragment, useEffect } from "react";
import { getAddress } from "viem";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, address, setUserData } = useUser();

  const location = window.location.href;

  useEffect(() => {
    GOOGLE_ANALYTICS_ID && initGA(); // Initialize Google Analytics
  }, [GOOGLE_ANALYTICS_ID]);

  useEffect(() => {
    const unsub = router.subscribe("onResolved", () => {
      const path = router.state.location.pathname;
      logPageView(path);
    });

    return () => unsub();
  }, [location]);

  useEffect(() => {
    const handleFetchUsername = async () => {
      if (!address) return;

      try {
        const [userRes, userInfo] = await Promise.all([
          makeApiRequest(`/api/user/${getAddress(address)}`),
          MiniKit.getUserByAddress(address),
        ]);

        const userData = userRes?.[0];

        if (userData && userData?.claimState && userData?.name) {
          setUserData(null, userData?.name, address, userData?.image, userData?.claimState);
        }
        if (!userData || !userInfo || !userInfo.username) return;
        if (userData?.name === userInfo?.username) return;

        const res = await userControllerUpdate({
          name: userInfo?.username,
          background: userData?.background,
          bio: userData?.bio,
          image: userData?.image,
        });

        if (res) {
          setUserData(
            null,
            userInfo?.username,
            address,
            userData?.image,
            userData?.claimState || user?.claimState
          );
        }
      } catch (error) {
        console.error("Update username failed", error);
      }
    };

    handleFetchUsername();
  }, [address]);
  return <Fragment>{children}</Fragment>;
};

export default AppProvider;
