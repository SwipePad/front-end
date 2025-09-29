import { useMemo, useState } from "react";
import { Step1 } from "./components/step-1";
import { Step2 } from "./components/step-2";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTokenFormData, createTokenSchema, BannerFormData, bannerSchema } from "./schema";
import { BottomDraw } from "@/components/shared/bottom-draw";
import { BottomBar, Button, LiveFeedback } from "@worldcoin/mini-apps-ui-kit-react";
import { Image } from "@/components/ui/image";
import { toast } from "@/components/shared/toast";
import { generateTokenId, sleep } from "@/lib/utils";
import { useAccount } from "@/hooks/mini-app/useAccount";
import { useDeployProject } from "@/hooks/contracts/use-deploy-project";
import { useNavigate } from "@tanstack/react-router";
import {
  useMemeControllerCountMemeNoFeeRequest,
  useMemeControllerCreateOffChainData,
} from "@/services/queries";
import { useTranslation } from "react-i18next";
import { makeApiRequest } from "@/services/trading-chart/helpers";
import { sendHapticAction } from "@/utils/miniapp";
import useToastCreateToken from "@/hooks/contracts/use-toast-create-token";
import { getAddress } from "viem";
import { useUser } from "@/components/providers/user-provider";

export function CreateToken() {
  const { t } = useTranslation();
  const { address, chainId } = useAccount();
  const [open, setOpen] = useState(false);
  const [deployState, setDeployState] = useState<"failed" | "pending" | "success" | undefined>();
  const methodsTokenDetails = useForm<CreateTokenFormData>({
    resolver: zodResolver(createTokenSchema),
    defaultValues: {
      name: "",
      symbol: "",
      description: "",
      tags: "Meme",
    },
  });
  const [isRequiredHumanVerified, setIsRequiredHumanVerified] = useState(false);
  const isPendingCreating = useMemo(() => deployState === "pending", [deployState]);
  const navigate = useNavigate();

  const methodsBannerDetails = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      banner: "",
      caption: "",
      // allowComments: true,
      // whoCanSee: "public",
    },
  });
  const [step, setStep] = useState(1);

  const { data: memeCreateCountData } = useMemeControllerCountMemeNoFeeRequest({});
  const { deployProject } = useDeployProject();
  const { mutateAsync: createProjectOffChain } = useMemeControllerCreateOffChainData({});
  const { creatingTokenToastId, toastCreatingToken, toastCreateSuccessfully } =
    useToastCreateToken();
  const { setUserData } = useUser();

  const numberOfCreateFreeTokens =
    (memeCreateCountData?.total ?? 0) - (memeCreateCountData?.used ?? 0);
  const isFeeFree = numberOfCreateFreeTokens > 0;
  const totalWld =
    Math.floor(
      (parseFloat(methodsTokenDetails.getValues("initBuy") || "0") + (isFeeFree ? 0 : 5)) * 10000
    ) / 10000;
  const onConfirm = async () => {
    const initBuy = methodsTokenDetails.getValues("initBuy");

    setDeployState(undefined);
    try {
      setDeployState("pending");
      // let lTokenAddress = tokenAddress as string;
      if (!address || !chainId) {
        throw new Error(t("toaster.pleaseConnectWalletFirst"));
      }

      const submissionId = generateTokenId();

      await deployProject({
        creator: address,
        name: methodsTokenDetails.getValues("name").trim(),
        symbol: methodsTokenDetails.getValues("symbol").trim(),
        initialDeposit: parseFloat(initBuy || "0"),
        whitelistStartTs: 0,
        whitelistEndTs: 0, // 24 hours later
        isGuarded: isRequiredHumanVerified,
        isFeeFree: isFeeFree,
        submissionId,
      });

      toastCreatingToken();
      navigate({ to: `/feed` });
      setOpen(false);

      const tokenAddress = await createProjectOffChain({
        data: {
          description: methodsTokenDetails.getValues("description")?.trim(),
          image: methodsBannerDetails.getValues("logo").trim(),
          banner: methodsBannerDetails.getValues("banner"),
          tags: methodsTokenDetails
            .getValues("tags")
            .split(",")
            .map(tag => tag.trim()),
          caption: methodsBannerDetails.getValues("caption")?.trim(),
          submissionId,
        },
      });

      if (!tokenAddress) {
        sendHapticAction("notification", "error");
        toast.dismiss(creatingTokenToastId);
        await sleep(300);
        toast.error(
          t("createToken.createTokenFailed"),
          t("createToken.createTokenFailedDescription")
        );
        setOpen(false);
        return;
      }

      let retries = 0;
      const maxRetries = 60;

      while (retries < maxRetries) {
        const data = await makeApiRequest(`/api/meme/${tokenAddress}`);

        if (data) {
          await sleep(7000);

          toast.dismiss(creatingTokenToastId);
          await sleep(1000);
          toastCreateSuccessfully(data.image, data.tokenAddress);
          sendHapticAction("notification", "success");
          break;
        }

        await sleep(1000); // retry interval
        retries++;
      }

      if (retries === maxRetries) {
        toast.dismiss(creatingTokenToastId);

        if (isFeeFree) {
          toast.error(
            t("createToken.createTokenFailed"),
            t("createToken.createTokenFailedDescription")
          );

          return;
        }

        toast.info(t("createToken.tokenCreationInQueue"));
        sendHapticAction("notification", "error");
        return;
      }

      await sleep(1000);

      const userDetail = await makeApiRequest(`/api/user/${getAddress(address)}`);

      if (userDetail && userDetail?.[0] && userDetail?.[0]?.claimState && userDetail?.[0]?.name) {
        setUserData(
          null,
          userDetail?.[0]?.name,
          address,
          userDetail?.[0]?.image,
          userDetail?.[0]?.claimState
        );
      }

      setDeployState("success");
      setOpen(false);

      // methods.reset();
    } catch (error: any) {
      toast.dismiss(creatingTokenToastId);
      setOpen(false);
      setDeployState(undefined);
      sendHapticAction("notification", "error");
      toast.error(
        t("createToken.createTokenFailed"),
        t("createToken.createTokenFailedDescription")
      );
      console.error("Token creation error:", error);
    }
  };

  return (
    <div className="mb-[34px] h-full w-full">
      {step === 1 && (
        <Step1
          freeCount={numberOfCreateFreeTokens}
          methods={methodsTokenDetails}
          isPendingCreating={isPendingCreating}
          nextStep={() => setStep(2)}
          isRequiredHumanVerified={isRequiredHumanVerified}
          setIsRequiredHumanVerified={setIsRequiredHumanVerified}
        />
      )}
      {step === 2 && (
        <Step2
          freeCount={numberOfCreateFreeTokens}
          methods={methodsBannerDetails}
          methodsTokenDetails={methodsTokenDetails}
          backToPreviousStep={() => setStep(1)}
          onPublish={() => setOpen(true)}
          isPendingCreating={isPendingCreating}
        />
      )}

      <BottomDraw
        isOpen={open}
        onClose={() => {
          if (deployState !== "pending") {
            setOpen(false);
          }
        }}
        title={t("createToken.preview")}
        disableCloseDrag={deployState == "pending"}
      >
        <div className="px-4">
          <div className="flex flex-col items-center gap-3 self-stretch p-4">
            <Image
              src={methodsBannerDetails.getValues("logoPreview")}
              alt="Preview"
              style={{ transform: "rotate(5.532deg)" }}
              className="h-[80px] w-[80px] rounded-lg object-cover"
            />
            <div className="flex items-start justify-between gap-1 self-stretch">
              <div className="p flex items-start gap-0.5 overflow-hidden text-center font-['Inter'] text-sm leading-5 text-[#353945]">
                {t("createToken.projectName")}
              </div>
              <div className="description flex items-center justify-center gap-2.5 overflow-hidden text-right font-['Inter'] text-sm font-medium leading-5 text-[#141416]">
                {methodsTokenDetails.getValues("name")}
              </div>
            </div>
            <div className="flex items-start justify-between gap-1 self-stretch">
              <div className="description-1 flex items-start gap-0.5 overflow-hidden text-center font-['Inter'] text-sm leading-5 text-[#353945]">
                {t("createToken.symbol")}
              </div>
              <div className="description-2 flex items-center justify-center gap-2.5 overflow-hidden text-right font-['Inter'] text-sm font-medium leading-5 text-[#141416]">
                {methodsTokenDetails.getValues("symbol")}
              </div>
            </div>

            <div className="flex items-start justify-between gap-1 self-stretch">
              <div className="description-3 flex items-start gap-0.5 overflow-hidden text-center font-['Inter'] text-sm leading-5 text-[#353945]">
                {t("createToken.creationFee")}
              </div>
              <div className="description-4 flex items-center justify-center gap-2.5 overflow-hidden text-right font-['Inter'] text-sm font-medium leading-5 text-[#141416]">
                {isFeeFree ? 0 : "5 WLD"}
              </div>
            </div>

            <div className="flex items-start justify-between gap-1 self-stretch">
              <div className="description-3 flex items-start gap-0.5 overflow-hidden text-center font-['Inter'] text-sm leading-5 text-[#353945]">
                {t("createToken.creatorBuy")}
              </div>
              <div className="description-4 flex items-center justify-center gap-2.5 overflow-hidden text-right font-['Inter'] text-sm font-medium leading-5 text-[#141416]">
                {`${
                  Math.floor(parseFloat(methodsTokenDetails.getValues("initBuy") || "0") * 10000) /
                  10000
                } WLD`}
              </div>
            </div>

            <div className="flex items-start justify-between gap-1 self-stretch font-bold">
              <div className="description-3 flex items-start gap-0.5 overflow-hidden text-center font-['Inter'] text-sm leading-5 text-[#353945]">
                {t("createToken.total")}
              </div>
              <div className="description-4 flex items-center justify-center gap-2.5 overflow-hidden text-right font-['Inter'] text-sm leading-5 text-[#141416]">
                {totalWld} WLD
              </div>
            </div>
          </div>

          <BottomBar>
            <LiveFeedback
              className="w-full"
              label={{
                failed: t("createToken.failed"),
                pending: t("createToken.pending"),
                success: t("createToken.success"),
              }}
              state={deployState}
            >
              <Button
                onClick={() => onConfirm()}
                className="w-full"
                disabled={deployState === "pending"}
              >
                {t("createToken.confirm")}
              </Button>
            </LiveFeedback>
          </BottomBar>
        </div>
      </BottomDraw>
    </div>
  );
}
