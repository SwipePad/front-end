import { BottomDraw } from "@/components/shared/bottom-draw";
// import { WhiteWorldCoinSmallIcon, WorldCoinSmallIcon } from "@/components/shared/icons";
import { listQuickBuyAmount } from "@/constants/common";
import CustomKeyboard from "@/features/buy/CustomKeyboard";
import useOutsideClick from "@/hooks/utils/use-outside-click";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NumericFormat } from "react-number-format";

type ConfigQuickBuyBottomDrawProps = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  quickBuyAmount: number;
  setQuickBuyAmount: (amount: number) => void;
};

const ConfigQuickBuyBottomDraw = ({
  isOpen,
  setOpen,
  quickBuyAmount,
  setQuickBuyAmount,
}: ConfigQuickBuyBottomDrawProps) => {
  const [customAmount, setCustomAmount] = useState<string>("");
  const [showKeyboard, setShowKeyboard] = useState(false);

  const { t } = useTranslation();
  const handleConfirm = () => {
    if (!customAmount) {
      setQuickBuyAmount(quickBuyAmount || 1);
    } else {
      setQuickBuyAmount(Number(customAmount.replace(/,/g, "")));
    }
    setOpen(false);
  };

  const keyboardRef = useRef<HTMLDivElement>(null);
  useOutsideClick(keyboardRef, () => setShowKeyboard(false));

  useEffect(() => {
    if (isOpen && quickBuyAmount && !listQuickBuyAmount.includes(quickBuyAmount)) {
      setCustomAmount(quickBuyAmount.toString());
    }
  }, [isOpen, quickBuyAmount]);

  const handleKeyPress = (key: string) => {
    if (key === "←") {
      if (customAmount.length === 0) return;
      setCustomAmount((prev: string) => prev.slice(0, -1));
      return;
    }

    if (key === ".") {
      if (!customAmount.includes(".")) {
        setCustomAmount(prev => prev + key);
      }
      return;
    }

    setCustomAmount(prev => prev + key);
  };

  const renderDisable = () => {
    if (
      (customAmount && Number(customAmount) <= 0) ||
      Number(customAmount) < 0.000001 ||
      Number(customAmount) > 100000000000
    ) {
      return true;
    }
    return false;
  };
  return (
    <BottomDraw
      isOpen={isOpen}
      onClose={() => setOpen(false)}
      title={t("explore.configQuickBuyBottomDraw.title")}
    >
      <div className="flex flex-col gap-5 px-4">
        <p className="mt-1 text-center text-xs font-normal text-[#777E90]">
          {t("explore.configQuickBuyBottomDraw.description")}
        </p>

        <div className="flex justify-center gap-2">
          {listQuickBuyAmount.map(item => {
            const isSelected = quickBuyAmount === item;

            return (
              <Button
                className={clsx(
                  "h-10 flex-[25%] text-nowrap px-1 py-2.5 text-sm",
                  isSelected ? "bg-[#141416] text-[#fff]" : "bg-[#F4F5F6] text-[#23262F]"
                )}
                key={item}
                onClick={() => {
                  setQuickBuyAmount(item);
                  setCustomAmount(item.toString());
                }}
                variant="secondary"
              >
                {/* {isSelected ? <WhiteWorldCoinSmallIcon /> : <WorldCoinSmallIcon />} */}
                {item} $
              </Button>
            );
          })}
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="font-medium text-[#141416]">
            {t("explore.configQuickBuyBottomDraw.orCustomAmount")}
          </p>

          <NumericFormat
            value={customAmount}
            placeholder={t("explore.configQuickBuyBottomDraw.yourCustomAmount")}
            thousandSeparator
            onChange={e => setCustomAmount(e.target.value)}
            className="w-full rounded-full border border-[#E6E8EC] p-4"
            readOnly
            onClick={() => setShowKeyboard(prev => !prev)}
          />
        </div>

        {showKeyboard && (
          <div ref={keyboardRef}>
            <CustomKeyboard onKeyPress={handleKeyPress} className="relative bottom-0" />
          </div>
        )}

        <Button onClick={handleConfirm} disabled={renderDisable()}>
          {t("explore.configQuickBuyBottomDraw.confirm")}
        </Button>
      </div>
    </BottomDraw>
  );
};

export default ConfigQuickBuyBottomDraw;
