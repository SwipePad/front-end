import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Button } from "@/components/ui/button";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalTitle,
} from "@/components/ui/dialog";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { estimateTokenBuy } from "@/lib/utils";
import { fromDecimals, toCurrency, toDecimals } from "@/lib/number";
import { POOL_BALANCE } from "@/constants/blockchain";
import { Decimal } from "decimal.js";
import { Image } from "@/components/ui/image";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useAccount, useBalance } from "wagmi";
import { useTranslation } from "react-i18next";

interface FirstBuyModalProps {
  tokenSymbol: string;
  onSubmit: (amount: string | null) => void;
}

const TOTAL_SUPPLY = 1_000_000_000; // 1B tokens
const MAX_BUY_PERCENTAGE = 0.2; // 20%

export const FirstBuyModal = NiceModal.create(({ tokenSymbol, onSubmit }: FirstBuyModalProps) => {
  const { t } = useTranslation();
  const modal = useModal();
  const [amount, setAmount] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });

  const tokenPrice = fromDecimals(
    estimateTokenBuy({
      tokenIn: toDecimals(1),
      slippage: 0,
      realTotalSupply: 0,
      poolBalance: POOL_BALANCE.toFixed(0),
      totalRaised: "0",
    }).minAmountOut
  );

  const { amountOut } = useMemo(() => {
    if (Decimal.isDecimal(amount)) {
      return {};
    }

    const amountOut = Number(new Decimal(amount || 0).mul(tokenPrice).toFixed(6));

    return { amountOut };
  }, [amount, tokenPrice]);

  const handleAmountChange = (value: string) => {
    setError("");
    if (balance && Number(value) > Number(balance.formatted)) {
      setError(
        t("createToken.insufficientBalance", {
          max: balance.formatted,
          symbol: balance.symbol,
        })
      );
    }

    const maxTokens = TOTAL_SUPPLY * MAX_BUY_PERCENTAGE;
    const tokenAmount = Number(value) * Number(tokenPrice);
    if (tokenAmount > maxTokens) {
      setError(
        `Amount exceeds maximum allowed (20% of total supply). Maximum: ${toCurrency(
          maxTokens
        )} ${tokenSymbol}`
      );
    }

    setAmount(value);
  };

  const handleSubmit = () => {
    if (error || (amount && balance && Number(amount) > Number(balance.formatted))) {
      return;
    }
    onSubmit(amount ? String(amount) : null);
    modal.hide();
  };

  return (
    <ResponsiveModal open={modal.visible} onOpenChange={modal.hide}>
      <ResponsiveModalContent className="bg-card border-none p-6 lg:max-w-md">
        <VisuallyHidden>
          <ResponsiveModalTitle>
            {t("createToken.chooseHowManyYouWantToBuy", { tokenSymbol })}
          </ResponsiveModalTitle>
        </VisuallyHidden>
        <h2 className="mb-2 mr-6 text-xl font-bold">
          {t("createToken.chooseHowMany")} <span className="text-primary">{tokenSymbol}</span>{" "}
          {t("createToken.youWantToBuy")}
        </h2>

        <div className="flex flex-col gap-4">
          <p className="mb-4 flex items-start gap-2 text-white/80">
            <span className="h-6 w-6 text-lg">💡</span>
            {t("createToken.tips")}
          </p>

          <p className="-mb-2 -mt-2 text-white/60">{t("createToken.optional")}</p>

          <div className="relative">
            <Input
              type="number"
              value={amount}
              onChange={e => handleAmountChange(e.target.value)}
              className={`w-full pr-20 ${error ? "border-red-500" : ""}`}
              placeholder="0"
              min="0"
            />
            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
              <Image src="/metis.png" alt="Metis" className="h-6 w-6" />
              <span className="text-primary font-bold uppercase">Metis</span>
            </div>
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}

          {amount && (
            <div className="text-white/60">
              {t("createToken.yourReceive")}:{" "}
              <span className="text-gradient">
                {toCurrency(amountOut || 0)} {tokenSymbol}
              </span>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            className="w-full py-4 font-bold text-black"
            disabled={!!error}
          >
            {t("createToken.createToken")}
          </Button>
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
});

// Helper function to show the modal
export const showFirstBuyModal = (
  tokenSymbol: string,
  onSubmit: (amount: string | null) => void
) => {
  return NiceModal.show(FirstBuyModal, { tokenSymbol, onSubmit });
};
