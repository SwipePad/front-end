import { BottomDraw } from "@/components/shared/bottom-draw";
import ChangeCollectionNameBottomDraw from "@/features/profile-collection/components/ChangeCollectionNameBottomDraw";
import { useQueryParamsType } from "@/hooks/params/use-query-state-type";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ChevronRight, Ellipsis, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function EditCollectionBottomDraw() {
  const { profileId, collectionId } = useParams({
    strict: false,
  });
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { setType } = useQueryParamsType();
  const [changeCollectionNameOpen, setChangeCollectionNameOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <>
      <Ellipsis className="size-6" onClick={() => setOpen(true)} />
      <ChangeCollectionNameBottomDraw
        open={changeCollectionNameOpen}
        setOpen={setChangeCollectionNameOpen}
        collectionName={decodeURIComponent(collectionId)}
      />
      <BottomDraw isOpen={open} onClose={() => setOpen(false)} title={t("profile.editCollection")}>
        <div className="space-y-1 p-4">
          <div
            className="flex items-center justify-between px-1 py-3"
            onClick={() => {
              setChangeCollectionNameOpen(true);
              setOpen(false);
            }}
          >
            <div className="flex items-center gap-2">
              <Pencil className="size-4" />
              <p className="text-sm font-medium text-[#141416]">
                {t("profile.changeCollectionName")}
              </p>
            </div>

            <ChevronRight className="size-4" />
          </div>

          <div
            className="flex items-center justify-between px-1 py-3"
            onClick={() => {
              navigate({
                to: "/profile/$profileId/collections/$collectionId",
                params: { profileId: profileId, collectionId: collectionId },
                search: { type: "remove" },
              });
              setType("remove");
              setOpen(false);
            }}
          >
            <div className="flex items-center gap-2">
              <Trash className="size-4" />
              <p className="text-sm font-medium text-[#141416]">
                {t("profile.removeSavedProjects")}
              </p>
            </div>

            <ChevronRight className="size-4" />
          </div>
        </div>
      </BottomDraw>
    </>
  );
}
