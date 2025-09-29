import { userControllerGetNonce, userControllerLogin } from "@/services/queries";
import { MiniKit, WalletAuthInput } from "@worldcoin/minikit-js";
import { useEffect, useState } from "react";
import { Button, LiveFeedback } from "@worldcoin/mini-apps-ui-kit-react";
import { useUser } from "@/components/providers/user-provider";
import { Image } from "@/components/ui/image";
import { toast } from "@/components/shared/toast";
import { useTranslation } from "react-i18next";
import { sendHapticAction } from "@/utils/miniapp";
import { ResponseClaimParamDtoClaimState } from "@/services/models";

const walletAuthInput = (nonce: string): WalletAuthInput => {
  return {
    nonce,
    requestId: "0",
    expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
    notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
    statement: "This is my statement and here is a link https://worldcoin.com/apps",
  };
};

export const Onboard = (props: { isLogged: boolean; setIsLogged: any }) => {
  const [init, setInit] = useState<boolean>(true);
  const [state, setState] = useState<"success" | "failed" | "pending" | undefined>(undefined);
  const { setToken, setUserData } = useUser();
  const { t } = useTranslation();

  useEffect(() => {
    // TODO: check jwt backend
    const token = localStorage.getItem("token");

    if (!token) {
      setInit(false);
      return;
    }

    // extract token
    const jwtPayload = token.split(".")[1];
    if (!jwtPayload) {
      setInit(false);
      return;
    }

    const payload = JSON.parse(atob(jwtPayload));

    // check expiration
    const expirationTime = payload.exp * 1000; // convert to milliseconds
    if (Date.now() > expirationTime) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setInit(false);
      return;
    }

    setInit(false);
    props.setIsLogged(true);
  }, []);

  const token = localStorage.getItem("token");
  useEffect(() => {
    setTimeout(() => {
      if (token) return;
      handleWalletAuth();
    }, 500);
  }, [token]);

  const handleWalletAuth = async () => {
    if (!MiniKit.isInstalled()) {
      console.warn('Tried to invoke "walletAuth", but MiniKit is not installed.');
      return;
    }

    setState("pending");
    const nonce = await userControllerGetNonce();
    const { commandPayload: _, finalPayload } = await MiniKit.commandsAsync.walletAuth(
      walletAuthInput(nonce)
    );

    if (finalPayload.status === "error") {
      setState(undefined);
      return;
    } else {
      try {
        const userWalletAddress = MiniKit.user.walletAddress;
        const userInfo = await MiniKit.getUserByAddress(MiniKit.user.walletAddress);

        const token = await userControllerLogin({
          nonce: nonce,
          payload: finalPayload,
          username: userInfo.username || userWalletAddress || "",
        });
        setState("success");
        // Store token in local storage
        setToken(token);
        setUserData(
          null,
          MiniKit.user?.username ?? null,
          userWalletAddress ?? null,
          MiniKit.user.profilePictureUrl ?? null,
          ResponseClaimParamDtoClaimState.ineligible
        );

        setTimeout(() => {
          props.setIsLogged(true);
        }, 1000);
      } catch (error) {
        console.log("Error during user creation:", error);
        sendHapticAction("notification", "error");
        toast.error(t("toaster.loginError"));
        setState(undefined);
      }
    }
  };

  return (
    <div className="relative flex h-screen flex-col">
      <Image
        src="/images/wallet/login-bg.png"
        alt="Logo"
        className="absolute top-0 w-full object-cover"
      />

      <div className="fixed bottom-[20px] w-full px-4 pb-2">
        {!init && !props.isLogged && (
          <LiveFeedback
            className="w-full"
            label={{
              failed: "Failed",
              pending: "Pending",
              success: "Success",
            }}
            state={state}
          >
            <Button fullWidth variant="primary" onClick={handleWalletAuth}>
              Login
            </Button>
          </LiveFeedback>
        )}
      </div>
    </div>
  );
};
