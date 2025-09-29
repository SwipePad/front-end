import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Button } from "@/components/ui/button";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalTitle,
} from "@/components/ui/dialog";
import { RotateCcw, X } from "lucide-react";
import { ReactNode } from "react";
import { Root as VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ErrorModalProps {
  title?: string;
  message?: string;
  closeText?: string;
  retryText?: string;
  onRetry?: () => void;
  children?: ReactNode;
}

export const ErrorModal = NiceModal.create(
  ({
    title = "Cosmic Error Detected!",
    message = "Looks like we've hit a snag in space. Let's try again!",
    closeText = "Close",
    retryText = "Try Again",
    onRetry,
    children,
  }: ErrorModalProps) => {
    const modal = useModal();

    const handleRetry = () => {
      if (onRetry) {
        onRetry();
      }
      modal.hide();
    };

    return (
      <ResponsiveModal open={modal.visible} onOpenChange={modal.hide}>
        <ResponsiveModalContent className="border-none lg:max-w-md" closeable={false}>
          <VisuallyHidden>
            <ResponsiveModalTitle>{title}</ResponsiveModalTitle>
          </VisuallyHidden>
          <div className="flex flex-col items-center space-y-6 text-center">
            {/* Error Icon */}
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#E74C3C]">
              <X className="h-12 w-12 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-semibold text-[#E74C3C]">{title}</h2>

            {/* Message */}
            <p className="text-base text-white/90">{message}</p>

            {/* Custom Content */}
            {children && <div className="w-full">{children}</div>}

            {/* Buttons */}
            <div className="flex w-full gap-4">
              <Button onClick={modal.hide} variant="outline" className="flex-1 bg-transparent">
                {closeText}
              </Button>
              <Button onClick={handleRetry} className="flex-1">
                <RotateCcw className="mr-2 h-4 w-4" />
                {retryText}
              </Button>
            </div>
          </div>
        </ResponsiveModalContent>
      </ResponsiveModal>
    );
  }
);

// Helper function to show the modal
export const showErrorModal = (props?: ErrorModalProps) => {
  return NiceModal.show(ErrorModal, props);
};
