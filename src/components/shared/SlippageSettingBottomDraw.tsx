import DangerIcon from "@/assets/icons/danger.svg?react";
import { BottomDraw } from "@/components/shared/bottom-draw";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { NumericFormat } from "react-number-format";

type SlippageSettingBottomDrawProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  form: UseFormReturn<any>;
};

export const SlippageSettingBottomDraw = ({
  open,
  setOpen,
  form,
}: SlippageSettingBottomDrawProps) => {
  const { t } = useTranslation();
  return (
    <BottomDraw
      isOpen={open}
      onClose={() => setOpen(false)}
      title={t("shared.slippageSettingBottomDraw.title")}
    >
      <div className="space-y-5 p-4">
        {" "}
        <p className="text-xs text-[#777E90]">
          {t("shared.slippageSettingBottomDraw.description")}
        </p>
        <div className="space-y-2">
          <p className="font-medium text-[#141416]">
            {t("shared.slippageSettingBottomDraw.customSlippage")}
          </p>
          <FormField
            control={form.control}
            name="slippage"
            render={({ field }) => (
              <FormItem className="h-fit">
                <FormControl>
                  <NumericFormat
                    {...field}
                    className="w-full rounded-full border border-[#E6E8EC] px-3 py-[14px]"
                    thousandSeparator=","
                    decimalSeparator="."
                    suffix="%"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="pillOutline"
              className="flex-1 py-5"
              onClick={() => form.setValue("slippage", "0.5%")}
            >
              0.5%
            </Button>

            <Button
              variant="pillOutline"
              className="flex-1 py-5"
              onClick={() => form.setValue("slippage", "1%")}
            >
              1%
            </Button>

            <Button
              variant="pillOutline"
              className="flex-1 py-5"
              onClick={() => form.setValue("slippage", "3%")}
            >
              3%
            </Button>

            <Button
              variant="pillOutline"
              className="flex-1 py-5"
              onClick={() => form.setValue("slippage", "5%")}
            >
              5%
            </Button>
          </div>
        </div>
        <div className="flex items-start justify-between gap-2 rounded-2xl bg-[#FFEAE0] p-3 text-[#FF5100]">
          <div className="w-5">
            <DangerIcon />
          </div>
          <p className="text-sm font-medium">
            {t("shared.slippageSettingBottomDraw.highSlippageTolerance")}
          </p>
        </div>
      </div>
    </BottomDraw>
  );
};
