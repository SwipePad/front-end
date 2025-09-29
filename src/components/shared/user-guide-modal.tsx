import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveModal, ResponsiveModalContent } from "@/components/ui/dialog";

export const UserGuideModal = NiceModal.create(() => {
  const modal = useModal();

  return (
    <ResponsiveModal open={modal.visible} onOpenChange={modal.hide}>
      <ResponsiveModalContent className="rounded-3xl border-none bg-[#2A2522] p-8 lg:max-w-md">
        <button
          onClick={modal.hide}
          className="ring-offset-background focus:ring-ring absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">User guide</h2>

          <p className="text-sm text-gray-300">
          Swipepad.meme ensures optimal security for buyers offering unique protection for token
            creators
          </p>

          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="mt-1 text-orange-400">•</span>
              Each coin is a fair-launch with no presale and team allocation
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-orange-400">•</span>
              Deploy for 2x less a token thanks to our optimized contracts
            </li>
          </ul>

          <p className="text-sm text-gray-300">
            If the token generates enough fees to refund at least{" "}
            <span className="text-orange-400">1 ETH</span> to the creator (the initial liquidity
            provided), the token remains in <span className="text-orange-400">5/5</span> tax mode
            until the unclog is complete, after which the taxes drop to{" "}
            <span className="text-orange-400">0/0</span>.
          </p>

          <p className="text-sm text-gray-300">
            If the token does not generate enough fees within{" "}
            <span className="text-orange-400">24 hours</span>, the liquidity is withdrawn and sent
            back to the creator's wallet.
          </p>

          <Button
            onClick={modal.hide}
            className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600"
          >
            READY TO DEPLOY
          </Button>
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
});

// Helper function to show the modal
export const showUserGuide = () => {
  return NiceModal.show(UserGuideModal);
};
