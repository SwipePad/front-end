import { FormProvider, UseFormReturn } from "react-hook-form";
import { type CreateTokenFormData } from "../schema";
import { TokenDescriptionInput } from "./inputs/token-description-input";
import { TokenNameInput } from "./inputs/token-name-input";
import { TokenSymbolInput } from "./inputs/token-symbol-input";
import { BottomBar, Button, Progress, Switch, TopBar } from "@worldcoin/mini-apps-ui-kit-react";
import ArrowLeft from "@/assets/icons/arrow-left.svg?react";
import { useNavigate } from "@tanstack/react-router";
import { useUser } from "@/components/providers/user-provider";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { BannerTagsInput } from "@/features/create-token/components/inputs/banner-tags-input";
import HumanIcon from "@/assets/icons/human.svg?react";
import { InitBuyInput } from "@/features/create-token/components/inputs/init-buy-input";
import useOutsideClick from "@/hooks/utils/use-outside-click";
import CustomKeyboard from "@/features/buy/CustomKeyboard";
import { useTokenBalance } from "@/hooks/contracts/use-token-balance";
import { NATIVE_TOKEN_ADDRESS } from "@/constants/blockchain";
import { formatEther } from "viem";
import { toast } from "@/components/shared/toast";
import CreateTokenHighLightBanner from "@/components/shared/create-token-reward-banner";

type Props = {
  methods: UseFormReturn<CreateTokenFormData>;
  nextStep: () => void;
  freeCount?: number;
  isPendingCreating: boolean;
  isRequiredHumanVerified: boolean;
  setIsRequiredHumanVerified: (value: boolean) => void;
};

export const AnimatedProgress = ({ target = 50, duration = 1000, className = "" }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = performance.now();

    const animate = (timestamp: number) => {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1); // 0 to 1
      const animatedValue = Math.floor(progress * target);

      setValue(animatedValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return (
    <Progress
      value={value}
      className={cn(
        "border-[rgba(0, 0, 0, 0.12)] fixed left-1/2 top-[64px] z-10 h-2 w-[calc(100%-48px)] !-translate-x-1/2 transform-none border bg-[#C0F2CE] [&>div]:animate-scroll-bg [&>div]:bg-[url('/images/token-detail/bg-progress.png')] [&>div]:bg-[length:200%_100%]",
        className
      )}
    />
  );
};

export function Step1({
  methods,
  isPendingCreating,
  nextStep,
  freeCount = 0,
  isRequiredHumanVerified,
  setIsRequiredHumanVerified,
}: Props) {
  const { data: nativeTokenBalance } = useTokenBalance(NATIVE_TOKEN_ADDRESS);

  const handleFormSubmit = async (_: CreateTokenFormData) => {
    const initBuy = methods.getValues("initBuy");

    if (parseFloat(initBuy) > parseFloat(formatEther(nativeTokenBalance ?? 0n))) {
      toast.error(t("createToken.insufficientBalanceInitBuy"));
      return;
    }

    if (parseFloat(initBuy) < 0.01) {
      toast.error(t("createToken.minInitBuy"));
      return;
    }

    nextStep();
  };
  const keyboardRef = useRef<HTMLDivElement>(null);
  useOutsideClick(keyboardRef, () => setIsShowCustomKeyboard(false));
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { isHiddenHighLightBanner } = useUser();
  const [isShowCustomKeyboard, setIsShowCustomKeyboard] = useState(false);

  const handleKeyPress = (key: string) => {
    if (key === "←") {
      const currentValue = methods.getValues("initBuy")?.toString().replace(/,/g, "");
      if (currentValue && currentValue.length > 0) {
        const newValue = currentValue.slice(0, -1);
        methods.setValue("initBuy", newValue);
      }
    } else {
      const currentValue = methods.getValues("initBuy")?.toString() || "";
      const newValue = currentValue.replace("WLD", "") + key;
      methods.setValue("initBuy", newValue);
    }
  };

  useEffect(() => {
    if (isShowCustomKeyboard) {
      document.body.style.overflow = "hidden";
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } else {
      document.body.style.overflow = "auto";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isShowCustomKeyboard]);

  return (
    <div className="h-full w-full">
      <TopBar
        startAdornment={<ArrowLeft onClick={() => navigate({ to: "/" })} />}
        title={t("createToken.projectInformation")}
        className="fixed top-0 z-10 bg-white !px-3 !pt-2"
      />
      <div className="mt-20 px-2 py-2">
        <div className="w-full !px-3">
          <AnimatedProgress target={50} duration={100} className="!px-3" />
        </div>

        {!isHiddenHighLightBanner && <CreateTokenHighLightBanner />}

        <div className={cn(!isHiddenHighLightBanner && "mt-[50px]", "w-full")}>
          {isShowCustomKeyboard && (
            <div
              ref={keyboardRef}
              onClick={e => e.stopPropagation()}
              onMouseDown={e => e.preventDefault()}
            >
              <CustomKeyboard
                onKeyPress={handleKeyPress}
                className="fixed bottom-[88px] left-0 z-20"
              />
            </div>
          )}

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleFormSubmit)}>
              <div
                className={cn(
                  "space-y-4 overflow-auto px-2 sm:space-y-6",
                  isShowCustomKeyboard && "pb-[300px]"
                )}
              >
                <TokenNameInput />
                <TokenSymbolInput />
                <TokenDescriptionInput />
                <BannerTagsInput />
                <InitBuyInput
                  isShowCustomKeyboard={isShowCustomKeyboard}
                  setIsShowCustomKeyboard={setIsShowCustomKeyboard}
                />

                <div className="flex gap-2 pb-[40px] pr-1">
                  <HumanIcon className="h-5 w-5 text-[#0064EF]" />

                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-[#0064EF]">
                      {t("createToken.humanPrioritized")}
                    </p>
                    <p className="text-xs font-medium text-[#777E90]">
                      {t("createToken.humanPrioritizedDescription")}
                    </p>
                  </div>

                  <Switch
                    checked={isRequiredHumanVerified}
                    onChange={checked => setIsRequiredHumanVerified(checked)}
                    style={{ marginLeft: "auto", minWidth: "40px" }}
                  />
                </div>

                <BottomBar>
                  <div className="fixed bottom-[0px] left-1/2 mt-4 w-[calc(100%-32px)] -translate-x-1/2 bg-white pb-[30px]">
                    <Button type="submit" fullWidth variant="primary" disabled={isPendingCreating}>
                      {t("createToken.continue")}
                    </Button>

                    {freeCount > 0 && (
                      <p className="text-border-black absolute left-6 top-[-8px] text-center text-[14px] font-black italic leading-[16px] tracking-[-0.14px] text-white">
                        {t("createToken.free")} x{freeCount}
                      </p>
                    )}
                  </div>
                </BottomBar>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
