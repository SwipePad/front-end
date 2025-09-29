import NiceModal, { useModal } from "@ebay/nice-modal-react";
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalTitle,
} from "@/components/ui/dialog";
import { ReactNode } from "react";
import TimerIcon from "@/assets/icons/timer.svg?react";
import { Root as VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ProcessingModalProps {
  title?: string;
  message?: string;
  children?: ReactNode;
}

export const ProcessingModal = NiceModal.create(
  ({
    title = "Hold On, Traveler!",
    message = "We're preparing your request in the cosmos...",
    children,
  }: ProcessingModalProps) => {
    const modal = useModal();

    return (
      <ResponsiveModal open={modal.visible}>
        <ResponsiveModalContent
          className="bg-card rounded-3xl border-none p-8 lg:max-w-md"
          closeable={false}
        >
          <VisuallyHidden>
            <ResponsiveModalTitle>{title}</ResponsiveModalTitle>
          </VisuallyHidden>
          <div className="flex flex-col items-center space-y-6 text-center">
            {/* Processing Icon */}
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#E0B012]">
              <TimerIcon className="h-12 w-12 animate-spin text-white" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-semibold text-[#E0B012]">{title}</h2>

            {/* Message */}
            <p className="text-base text-white">{message}</p>

            {/* Custom Content */}
            {children && <div className="w-full">{children}</div>}
          </div>
        </ResponsiveModalContent>
      </ResponsiveModal>
    );
  }
);

// Helper function to show the modal
export const showProcessingModal = (props?: ProcessingModalProps) => {
  return NiceModal.show(ProcessingModal, props);
};

export const hideProcessingModal = () => {
  NiceModal.hide(ProcessingModal);
};
