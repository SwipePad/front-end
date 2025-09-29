import { Header } from "@/components/shared/header";
import { HorizontalBaseCard } from "@/components/shared/horizontal-base-card";
import { Separate } from "@/components/shared/separate";
import { Input } from "@/components/ui/input";
import EditCollectionBottomDraw from "@/features/profile-collection/components/EditCollectionBottomDraw";
import { useQueryParamsType } from "@/hooks/params/use-query-state-type";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
import { Search, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useProfileContext } from "../profile/profile.context";
import { useParams, useRouter } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { getAddress } from "viem";
import { AlbumResponse, MemeResponse } from "@/services/models";
import { toast } from "@/components/shared/toast";
import { useAlbumControllerRemoveAlbumRecords } from "@/services/queries";
import { Image } from "@/components/ui/image";
import { useQueryParamsSearchInput } from "@/hooks/params/use-query-state-search-input";
import { useDebounce } from "@/hooks/utils/use-debounce";
import { useTranslation } from "react-i18next";
import { sendHapticAction } from "@/utils/miniapp";

export default function ProfileCollection() {
  const { searchInput, setSearchInput } = useQueryParamsSearchInput();
  const router = useRouter();
  const { t } = useTranslation();
  const searchInputDebounced = useDebounce(searchInput, 300);
  const { profileId, collectionId } = useParams({
    strict: false,
  });
  // const navigate = useNavigate();
  const { type, setType } = useQueryParamsType();
  const [listTokenAddressDelete, setListTokenAddressDelete] = useState<string[]>([]);

  const getCurrentCollection = (data: AlbumResponse[]) => {
    return data.find(
      c => c.name === decodeURIComponent(collectionId) && c.walletAddress === getAddress(profileId)
    )?.memes;
  };

  const { collections, setCollections } = useProfileContext();

  const currentCollection = getCurrentCollection(collections);
  const [listMemes, setListMemes] = useState<MemeResponse[]>(
    (currentCollection as MemeResponse[]) || []
  );

  const { mutateAsync } = useAlbumControllerRemoveAlbumRecords();

  const onDelete = async () => {
    try {
      await mutateAsync({
        data: {
          name: collectionId,
          tokenAddresses: listTokenAddressDelete,
        },
      });
      toast.success(t("profile.collectionUpdatedSuccessfully"));
      setCollections(
        collections.map(item => {
          if (
            item.name === decodeURIComponent(collectionId) &&
            item.walletAddress === getAddress(profileId)
          ) {
            return {
              ...item,
              memes: item.memes.filter(m => !listTokenAddressDelete.includes(m.tokenAddress)),
            };
          }
          return item;
        })
      );
      setListTokenAddressDelete([]);
      setListMemes(prev => prev.filter(m => !listTokenAddressDelete.includes(m.tokenAddress)));
      setType("");
    } catch (error: any) {
      console.error("Error deleting collection:", error);
      sendHapticAction("notification", "error");
      toast.error(error.message || t("profile.failedToDeleteCollection"));
    }
  };

  useEffect(() => {
    if (searchInputDebounced) {
      const foundMemes = currentCollection?.filter(
        meme =>
          meme.name.toLowerCase().includes(searchInputDebounced.toLowerCase()) ||
          meme.symbol.toLowerCase().includes(searchInputDebounced.toLowerCase()) ||
          meme.tokenAddress.toLowerCase().includes(searchInputDebounced.toLowerCase())
      );

      setListMemes(foundMemes || []);
    } else {
      setListMemes((currentCollection as MemeResponse[]) ?? []);
    }
  }, [searchInputDebounced]);

  return (
    <section className="overflow-hidden rounded-t-2xl">
      <Header title={collectionId} rightSection={<EditCollectionBottomDraw />} />
      <div className="p-4">
        <Input
          placeholder={t("profile.searchForAnyTokens")}
          className="rounded-full"
          leftSection={<Search className="size-4" />}
          value={searchInput || ""}
          onChange={e => setSearchInput(e.target.value)}
        />
      </div>
      <div className="space-y-1 px-4 py-1">
        {listMemes.map((token, index) => (
          <div
            key={token.name}
            className="py-2"
            onClick={() => {
              router.navigate({
                to: `/tokens/${getAddress(token?.tokenAddress)}`,
              });
            }}
          >
            <HorizontalBaseCard
              leftSection={
                <Image src={token.image} alt={token.name} className="h-12 w-12 rounded-xl" />
              }
              centerSection={<p className="font-medium">{token.name}</p>}
              rightSection={
                type === "remove" ? (
                  <Trash
                    className="size-4"
                    onClick={() => {
                      setListMemes(prev => prev.filter(m => m.tokenAddress !== token.tokenAddress));
                      setListTokenAddressDelete(prev => {
                        return [...prev, token.tokenAddress];
                      });
                    }}
                  />
                ) : (
                  <div className="text-end">
                    <p className="font-semibold">${token.currentPriceByUsd}</p>
                    <p
                      className={cn(
                        "text-xs font-semibold",
                        Number(token.price24hChange) >= 0 ? "text-[#1FA645]" : "text-[#FF5555]"
                      )}
                    >
                      {Number(token.price24hChange) >= 0
                        ? `+${Number(token.price24hChange).toFixed(2)}`
                        : Number(token.price24hChange).toFixed(2)}
                      %
                    </p>
                  </div>
                )
              }
            />
            {index !== listMemes.length - 1 && <Separate />}
          </div>
        ))}

        {listMemes.length === 0 && searchInputDebounced && (
          <div className="!mt-10 text-center text-sm text-[#777E90]">
            {t("profile.noTokenFound")}
          </div>
        )}
      </div>

      {listTokenAddressDelete.length > 0 && (
        <div className="fixed bottom-[98px] left-0 right-0 p-4">
          <Button className="w-full" onClick={() => onDelete()}>
            {t("profile.save")}
          </Button>
          <Button
            className="mt-2 w-full"
            variant="tertiary"
            onClick={() => {
              setListTokenAddressDelete([]);
              setListMemes(
                (collections.find(
                  c =>
                    c.name === decodeURIComponent(collectionId) &&
                    c.walletAddress === getAddress(profileId)
                )?.memes as any) ?? []
              );
            }}
          >
            {t("profile.cancel")}
          </Button>
        </div>
      )}
    </section>
  );
}
