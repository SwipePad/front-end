import { useState } from "react";
import { toast } from "@/components/shared/toast";
import { useTranslation } from "react-i18next";
import { sendHapticAction } from "@/utils/miniapp";

export interface useCopyToClipboardProps {
  timeout?: number;
  showToast?: boolean;
}

export function useCopyToClipboard({
  timeout = 2000,
  showToast = true,
}: useCopyToClipboardProps = {}) {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const { t } = useTranslation();

  const copyImageToClipboard = async (value: string) => {
    if (!value) {
      return;
    }

    try {
      const res = await fetch(value);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      setIsCopied(true);
      if (showToast) {
        toast.success(t("toaster.imageCopiedToClipboard"));
        sendHapticAction("notification", "success");
      }

      setTimeout(() => {
        setIsCopied(false);
      }, timeout);
    } catch (error) {
      if (showToast) toast.error(t("toaster.failedCopyImageToClipboard"));
    }
  };

  const copyToClipboard = (value: string, title?: string) => {
    if (!value) {
      return;
    }

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      if (showToast) {
        toast.success(t(title || "toaster.copyClipboardSuccessfully"));
        sendHapticAction("notification", "success");
      }

      setTimeout(() => {
        setIsCopied(false);
      }, timeout);
    });
  };

  return { isCopied, copyToClipboard, copyImageToClipboard };
}
