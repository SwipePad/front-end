import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { Button } from "@/components/ui/button";
import { ResponsiveModal, ResponsiveModalContent } from "@/components/ui/dialog";

export const TutorialModal = NiceModal.create(() => {
  const modal = useModal();

  return (
    <ResponsiveModal open={modal.visible} onOpenChange={modal.hide}>
      <ResponsiveModalContent className="border-none lg:max-w-md">
        <div className="space-y-6">
          <h2 className="text-gradient text-xl font-semibold">Tutorial</h2>

          <p className="text-white/80">
            Swipepad.meme ensures security for investors and creators through our innovative protocol
          </p>

          <ul className="space-y-3 text-white/80">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Fair-launch only: No presales or team allocations
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              50% lower deployment costs via optimized contracts
            </li>
          </ul>

          <p className="text-white/80">
            DEX listing unlocks at 150 METIS. 5% of METIS trades go to Pump pool. When majority
            holders (51%+) activate the PUMP mechanism, accumulated METIS is used for automatic
            token buybacks.
          </p>

          <Button onClick={modal.hide} className="w-full font-bold">
            READY TO EXPLORE
          </Button>
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
});

// Helper function to show the modal
export const showTutorial = () => {
  return NiceModal.show(TutorialModal);
};
