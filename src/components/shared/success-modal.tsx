import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Button } from "@/components/ui/button";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalTitle,
} from "@/components/ui/dialog";
import type { ReactNode } from "react";
import IconCheck from "@/assets/icons/check.svg?react";
import { Root as VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface SuccessModalProps {
  title?: string;
  message?: string;
  buttonText?: string;
  buttonIcon?: ReactNode;
  children?: ReactNode;
}

export const SuccessModal = NiceModal.create(
  ({
    title = "Mission Accomplished!",
    message = "Your request has been successfully completed in Swipepad.meme!",
    buttonText = "Close",
    buttonIcon,
    children,
  }: SuccessModalProps) => {
    const modal = useModal();

    return (
      <ResponsiveModal open={modal.visible} onOpenChange={modal.hide}>
        <ResponsiveModalContent className="bg-card border-none p-6 lg:max-w-md" closeable={false}>
          <VisuallyHidden>
            <ResponsiveModalTitle>{title}</ResponsiveModalTitle>
          </VisuallyHidden>

          <div className="flex flex-col items-center space-y-6 text-center">
            {/* Success Icon */}
            <IconCheck className="h-24 w-24 text-white" />

            {/* Title */}
            <h2 className="text-2xl font-semibold text-[#8BC34A]">{title}</h2>

            {/* Message */}
            <p className="text-base text-white/90">{message}</p>

            {/* Custom Content */}
            {children && <div className="w-full">{children}</div>}

            {/* Close Button */}
            <Button onClick={modal.hide} className="mt-4 w-full text-base font-bold">
              {buttonIcon && <span className="mr-2">{buttonIcon}</span>}
              {buttonText}
            </Button>
          </div>
        </ResponsiveModalContent>
      </ResponsiveModal>
    );
  }
);

// Helper function to show the modal with custom content
export const showSuccessModal = (props?: SuccessModalProps) => {
  return NiceModal.show(SuccessModal, props);
};
