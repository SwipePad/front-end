import { BottomDraw } from "@/components/shared/bottom-draw";
import CustomKeyboard from "@/features/buy/CustomKeyboard";
import { useLocalStorage } from "@/hooks/utils/use-local-storage";
import useOutsideClick from "@/hooks/utils/use-outside-click";
import { tryParseNumber } from "@/lib/number";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { ChevronLeft } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { NumericFormat } from "react-number-format";

type SetPresetAmountBottomDrawProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  setValueState: (value: number) => void;
};

export function SetPresetAmountBottomDraw({
  open,
  setOpen,
  setValueState,
}: SetPresetAmountBottomDrawProps) {
  const { t } = useTranslation();
  const [quickBuyAmount] = useLocalStorage<number>("quickBuyAmount", 3);
  const [value, setValue] = useState<string>(quickBuyAmount.toString());
  const [showKeyboard, setShowKeyboard] = useState(false);

  const keyboardRef = useRef<HTMLDivElement>(null);
  useOutsideClick(keyboardRef, () => setShowKeyboard(false));

  const handleSave = () => {
    if (!value) {
      setValueState(0);
    } else {
      setValueState(tryParseNumber(value));
    }
    setOpen(false);
  };

  const handleKeyPress = (key: string) => {
    if (key === "←") {
      setValue(prev => prev.slice(0, -1));
      return;
    }

    if (key === ".") {
      if (!value.includes(".")) {
        setValue(prev => prev + key);
      }
      return;
    }

    setValue(prev => prev + key);
  };

  return (
    <BottomDraw
      isOpen={open}
      onClose={() => setOpen(false)}
      title={t("feed.setPresetAmount")}
      leftSection={<ChevronLeft className="size-4" onClick={() => setOpen(false)} />}
    >
      <div className="p-4">
        <NumericFormat
          value={value}
          suffix=" $"
          thousandSeparator
          onChange={e => setValue(e.target.value)}
          className="w-full rounded-full border border-[#E6E8EC] p-4"
          readOnly
          onClick={() => setShowKeyboard(prev => !prev)}
        />
        <p className="mt-1 text-center text-xs text-[#777E90]">
          {t("feed.thisAmountWillBeAppliedToTokensYouSwipeRightOn")}
        </p>

        {showKeyboard && (
          <div ref={keyboardRef}>
            <CustomKeyboard onKeyPress={handleKeyPress} className="relative bottom-0" />
          </div>
        )}
        <Button
          className="mt-4 w-full"
          disabled={!value || Number(value) <= 0.000001 || Number(value) > 100000000000}
          onClick={handleSave}
        >
          {t("feed.save")}
        </Button>
      </div>
    </BottomDraw>
  );
}
