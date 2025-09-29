import { useCopyToClipboard } from "@/hooks/utils/use-copy-to-clipboard";
import { toast } from "@/components/shared/toast";
import { useTranslation } from "react-i18next";

interface ShareOptions {
  title?: string;
  text?: string;
  url: string;
}

export function useShare() {
  const { copyToClipboard } = useCopyToClipboard();
  const { t } = useTranslation();

  const share = async ({ title, text, url }: ShareOptions) => {
    // Check if device is mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile && navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
        toast.success(t("toaster.sharedSuccessfully"));
      } catch (error) {
        // User cancelled or share failed
        if (error instanceof Error && error.name !== "AbortError") {
          fallbackShare(url);
        }
      }
    } else {
      // Desktop or mobile without share capability - copy to clipboard
      fallbackShare(url);
    }
  };

  const fallbackShare = (url: string) => {
    copyToClipboard(url);
  };

  return { share };
}
