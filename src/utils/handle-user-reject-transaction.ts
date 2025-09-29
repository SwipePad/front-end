import i18n from "i18next";

export const handleUserRejectTransaction = (
  error_code: string | undefined,
  action: "buy" | "sell"
) => {
  if (!error_code) return;

  const message =
    error_code === "user_rejected"
      ? i18n.t("toaster.userRejectedTheTransaction")
      : i18n.t("toaster.failBuySellToken", {
          action: action,
        });
  throw new Error(message);
};
