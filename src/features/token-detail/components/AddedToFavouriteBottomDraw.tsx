import { BottomDraw } from "@/components/shared/bottom-draw";
import { HorizontalBaseCard } from "@/components/shared/horizontal-base-card";
import Bookmarked from "@/assets/icons/bookmarked.svg?react";
import { HorizontalCollectionCard } from "@/components/shared/horizontal-collection-card";
import { CirclePlus } from "lucide-react";
import { Checkbox } from "@worldcoin/mini-apps-ui-kit-react";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  useAlbumControllerAddOrRemoveRecordAlbum,
  useAlbumControllerGetAlbumNames,
} from "@/services/queries";
import { useEffect, useState } from "react";
import { getAddress } from "viem";
import { useUser } from "@/components/providers/user-provider";
import { toast } from "@/components/shared/toast";
import { AlbumResponse } from "@/services/models";
import { Image } from "@/components/ui/image";
import { useTranslation } from "react-i18next";
import { getRandomUserImage } from "@/lib/utils";
import { sendHapticAction } from "@/utils/miniapp";

type AddedToFavouriteBottomDrawProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const AddedToFavouriteBottomDraw = ({ open, setOpen }: AddedToFavouriteBottomDrawProps) => {
  const { t } = useTranslation();
  const { tokenId } = useParams({
    strict: false,
  });
  const navigate = useNavigate();
  const { address } = useUser();
  const [collections, setCollections] = useState<AlbumResponse[]>([]);
  const { data: albums, isFetching } = useAlbumControllerGetAlbumNames(
    {
      userWalletAddress: getAddress(address!),
      tokenAddress: tokenId,
    },
    {
      query: {
        refetchOnMount: true,
      },
    }
  );

  useEffect(() => {
    if (albums) {
      setCollections(albums);
    }
  }, [albums, isFetching]);

  const data: {
    imgs: string[];
    name: string;
    description?: string;
    isInCollection: boolean;
  }[] = (collections ?? []).map(a => ({
    imgs: a.memes.slice(0, 4).map(m => m.image),
    name: a.name,
    description: a.type === "private" ? t("tokenDetail.private") : t("tokenDetail.public"),
    isInCollection: a.isTokenInAlbum,
  }));

  const { mutateAsync } = useAlbumControllerAddOrRemoveRecordAlbum();

  const addToCollection = async (isAdd: boolean, collectionName: string) => {
    try {
      setCollections(
        collections.map(item => {
          if (item.name === collectionName) {
            return {
              ...item,
              isTokenInAlbum: isAdd,
            };
          }
          return item;
        })
      );
      await mutateAsync({
        data: {
          name: collectionName,
          tokenAddress: getAddress(tokenId!),
        },
      });

      // await refetch();
    } catch (error: any) {
      console.error("Error adding to collection:", error);
      sendHapticAction("notification", "error");
      toast.error(error?.message || t("tokenDetail.failedToAddToCollection"));
    }
  };

  return (
    <BottomDraw isOpen={open} onClose={() => setOpen(false)}>
      <div className="space-y-5 p-4">
        <HorizontalBaseCard
          leftSection={<Image src={getRandomUserImage()} alt="" className="size-12 rounded-xl" />}
          centerSection={
            <div className="space-y-1">
              <p className="font-medium text-black">{t("tokenDetail.addedToFavorites")}</p>
              <p className="text-xs text-[#777E90]">{t("tokenDetail.allCoins")}</p>
            </div>
          }
          rightSection={<Bookmarked className="size-5" />}
        />

        <div>
          <div className="flex items-center justify-between">
            <p className="font-medium text-[#141416]">{t("tokenDetail.collections")}</p>
            <p
              className="flex items-center gap-1 text-sm font-medium text-[#19BF58]"
              onClick={() => navigate({ to: "/collections/add" })}
            >
              <CirclePlus className="size-4" />
              {t("tokenDetail.addNewCollection")}
            </p>
          </div>
          <div>
            {data.map((item, index) => (
              <div key={index} className="py-3">
                <HorizontalCollectionCard
                  data={item}
                  rightSection={
                    <Checkbox
                      checked={item.isInCollection}
                      onClick={() => addToCollection(!item.isInCollection, item.name)}
                    />
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </BottomDraw>
  );
};
