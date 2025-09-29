import { BottomDraw } from "@/components/shared/bottom-draw";
import { WhiteWorldCoinSmallIcon, WorldCoinSmallIcon } from "@/components/shared/icons";
import { toast } from "@/components/shared/toast";
import { Image } from "@/components/ui/image";
import { listQuickBuyAmount } from "@/constants/common";
import { useMemeData } from "@/hooks/contracts/use-meme-data";
import { useDebounce } from "@/hooks/utils/use-debounce";
import { useLocalStorage } from "@/hooks/utils/use-local-storage";
import { MemeResponse } from "@/services/models";
import { sendHapticAction } from "@/utils/miniapp";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import clsx from "clsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NumericFormat } from "react-number-format";

type QuickBuyTokenBottomDrawProps = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  selectedToken: MemeResponse & {
    rawBalance?: string;
    readableBalance?: string;
  };
};

const AUTO_FETCH_MEME_DETAIL_ON_CHAIN = false;

const QuickBuyTokenBottomDraw = ({
  isOpen,
  setOpen,
  selectedToken,
}: QuickBuyTokenBottomDrawProps) => {
  const [customAmount, setCustomAmount] = useState<string>();
  const customAmountDebounced = useDebounce(customAmount, 300);
  const isTokenOnDex = selectedToken?.status === "completed";
  const [quickBuyAmount, setQuickBuyAmount] = useLocalStorage<number>("quickBuyAmount", 3);
  const { t } = useTranslation();
  const customAmountNumber = Number(customAmountDebounced?.replace(/,/g, ""));

  const { getDataOnDex, DEFAULT_MEME_DATA_ISNOT_ON_DEX } = useMemeData(
    selectedToken?.tokenAddress,
    customAmountNumber || quickBuyAmount || 1,
    true,
    0.01,
    isTokenOnDex,
    AUTO_FETCH_MEME_DETAIL_ON_CHAIN
  );

  const handleConfirm = async () => {
    try {
      if (!customAmount) {
        setQuickBuyAmount(quickBuyAmount || 1);
      } else {
        setQuickBuyAmount(Number(customAmount.replace(/,/g, "")));
      }

      const memeOnChainData = isTokenOnDex ? await getDataOnDex() : DEFAULT_MEME_DATA_ISNOT_ON_DEX;

      if (!memeOnChainData) {
        sendHapticAction("notification", "error");
        toast.error(t("explore.quickBuyTokenBottomDraw.cannotBuyToken"));
        return;
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <BottomDraw isOpen={isOpen} onClose={() => setOpen(false)}>
      <div className="flex flex-col gap-5 px-4">
        <Image
          src={selectedToken?.image}
          alt={selectedToken?.name ?? ""}
          className="mx-auto h-12 w-12 rounded-xl bg-white object-cover"
        />
        <div className="flex flex-col items-center">
          <p className="font-medium">
            {t("explore.quickBuyTokenBottomDraw.quickBuy")} {selectedToken?.symbol}
          </p>
          <p className="mt-1 text-center text-xs font-normal text-[#777E90]">
            {t("explore.quickBuyTokenBottomDraw.description")}
          </p>
        </div>

        <div className="flex justify-center gap-1">
          {listQuickBuyAmount.map(item => {
            const isSelected = quickBuyAmount === item;

            return (
              <Button
                className={clsx(
                  "h-10 flex-[25%] text-nowrap px-1 py-2.5",
                  isSelected ? "bg-[#141416] text-[#fff]" : "bg-[#F4F5F6] text-xs text-[#23262F]"
                )}
                key={item}
                onClick={() => {
                  (setQuickBuyAmount(item), setCustomAmount(""));
                }}
                variant="secondary"
              >
                {isSelected ? <WhiteWorldCoinSmallIcon /> : <WorldCoinSmallIcon />}
                {item} WLD
              </Button>
            );
          })}
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="font-medium text-[#141416]">
            {t("explore.quickBuyTokenBottomDraw.orCustomAmount")}
          </p>

          <NumericFormat
            value={customAmount}
            placeholder={t("explore.configQuickBuyBottomDraw.yourCustomAmount")}
            thousandSeparator
            onChange={e => setCustomAmount(e.target.value)}
            className="w-full rounded-full border border-[#E6E8EC] p-4"
          />
        </div>

        <Button
          onClick={handleConfirm}
          disabled={Number(customAmount) < 0.000001 || Number(customAmount) > 100000000000}
        >
          {t("explore.quickBuyTokenBottomDraw.confirm")}
        </Button>
      </div>
    </BottomDraw>
  );
};

export default QuickBuyTokenBottomDraw;
