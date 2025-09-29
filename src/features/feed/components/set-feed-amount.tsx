import { BottomDraw } from "@/components/shared/bottom-draw";
import { Button } from "@/components/ui/button";
import { listQuickBuyAmount } from "@/constants/common";
import { SetPresetAmountBottomDraw } from "@/features/feed/components/SetPresetAmountBottomDraw";
import { RadioGroup, RadioGroupItem } from "@worldcoin/mini-apps-ui-kit-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  onClose: () => void;
  value: number;
  setValueState: (value: number) => void;
};

export const SetFeedAmountComponent = (props: Props) => {
  const { t } = useTranslation();
  const { value, setValueState } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <BottomDraw
        isOpen={props.open}
        onClose={() => props.onClose()}
        title={t("feed.presetAmount")}
      >
        <div className="flex flex-col gap-1 p-4">
          <RadioGroup value={value.toString()}>
            {listQuickBuyAmount.map(item => (
              <div
                key={item}
                className="flex justify-between"
                onClick={() => setValueState(Number(item))}
              >
                <span className="p-2 text-[14px] font-medium not-italic leading-[20px] tracking-[-0.56px]">
                  {item}
                </span>

                <RadioGroupItem value={item.toString()} />
              </div>
            ))}
          </RadioGroup>

          <Button
            variant="pillOutline"
            className="w-full"
            onClick={() => {
              setOpen(true);
            }}
          >
            {t("feed.customAmount")}
          </Button>
        </div>
        <SetPresetAmountBottomDraw open={open} setOpen={setOpen} setValueState={setValueState} />
      </BottomDraw>
    </>
  );
};
