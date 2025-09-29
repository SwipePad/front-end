import { BottomDraw } from "@/components/shared/bottom-draw";
import { toast } from "@/components/shared/toast";
import { Input } from "@/components/ui/input";
import { useProfileContext } from "@/features/profile/profile.context";
import { useAlbumControllerRenameAlbum } from "@/services/queries";
import { sendHapticAction } from "@/utils/miniapp";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type ChangeCollectionNameBottomDrawProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  collectionName: string;
};

export default function ChangeCollectionNameBottomDraw({
  open,
  setOpen,
  collectionName,
}: ChangeCollectionNameBottomDrawProps) {
  const { profileId } = useParams({
    strict: false,
  });
  const [collectionNameState, setCollectionNameState] = useState(collectionName ?? "");
  const { setCollections, collections } = useProfileContext();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { mutateAsync } = useAlbumControllerRenameAlbum();
  const onSave = async () => {
    try {
      await mutateAsync({
        data: {
          oldName: collectionName,
          newName: collectionNameState,
        },
      });
      setOpen(false);
      toast.success(t("profile.collectionNameUpdatedSuccessfully"));

      setCollections(
        collections.map(item => {
          if (item.name === decodeURIComponent(collectionName)) {
            return {
              ...item,
              name: collectionNameState,
            };
          }
          return item;
        })
      );
      navigate({
        to: "/profile/$profileId/collections/$collectionId",
        params: { profileId: profileId, collectionId: collectionNameState },
        replace: true,
      });
      setCollectionNameState(collectionNameState);
    } catch (error: any) {
      console.error("Error updating collection name:", error);
      sendHapticAction("notification", "error");
      toast.error(error.message ?? t("profile.failedToUpdateCollectionName"));
      setOpen(false);
    }
  };

  return (
    <BottomDraw
      isOpen={open}
      onClose={() => setOpen(false)}
      title="Change Collection Name"
      leftSection={<ChevronLeft className="size-6" onClick={() => setOpen(false)} />}
    >
      <div className="space-y-4 p-4">
        <Input
          placeholder="Collection Name"
          value={collectionNameState}
          autoFocus
          onChange={e => setCollectionNameState(e.currentTarget.value)}
        />
        <p className="text-sm text-[#777E90]">
          {t("profile.thisWillChangeHowWeDisplayYourCollectionName")}
        </p>

        <Button className="w-full" onClick={() => onSave()}>
          {t("profile.save")}
        </Button>
      </div>
    </BottomDraw>
  );
}
