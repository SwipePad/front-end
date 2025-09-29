import { ResponsiveModal, ResponsiveModalContent } from "@/components/ui/dialog";
import { Image } from "@/components/ui/image";
import CloseXIcon from "@/assets/icons/close-x.svg?react";
import { motion, AnimatePresence } from "framer-motion";

type PreviewTokenLogoModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  image?: string;
};

const PreviewTokenLogoModal = ({ open, setOpen, image }: PreviewTokenLogoModalProps) => {
  return (
    <AnimatePresence>
      {open && (
        <ResponsiveModal open={open} onOpenChange={setOpen}>
          <ResponsiveModalContent
            className="top-0 flex min-h-screen w-full flex-col items-center justify-center bg-[rgba(0,0,0,0.85)] lg:max-w-md"
            closeable={false}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col items-center gap-6"
            >
              <Image src={image} className="h-[320px] w-[320px] rounded-[50px] object-cover" />

              <div
                className="rounded-full p-2"
                onClick={() => setOpen(false)}
                style={{ background: "rgba(255, 255, 255, 0.12)" }}
              >
                <CloseXIcon className="h-5 w-5 text-white" />
              </div>
            </motion.div>
          </ResponsiveModalContent>
        </ResponsiveModal>
      )}
    </AnimatePresence>
  );
};

export default PreviewTokenLogoModal;
