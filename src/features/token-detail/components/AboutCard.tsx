import { Image } from "@/components/ui/image";
import { AddedToFavouriteBottomDraw } from "@/features/token-detail/components/AddedToFavouriteBottomDraw";
import { MemeDetailResponseStatus, MemeResponse } from "@/services/models";
import { useMemeControllerLikeMeme } from "@/services/queries";
import numeral from "numeral";
import { useState } from "react";
import { toast } from "sonner";
import { formatUnits } from "viem";
import HumanIcon from "@/assets/icons/human.svg?react";
import { useTranslation } from "react-i18next";
import { shortenAddress } from "@/lib/utils";
import CopyIcon from "@/assets/icons/copy.svg?react";
import DexscreenerIcon from "@/assets/icons/dexscreener.svg?react";
import ArrowTopRight from "@/assets/icons/arrow-top-right.svg?react";
import GraduatedBackground from "@/assets/icons/graduate-backgroud.svg?react";
import { useCopyToClipboard } from "@/hooks/utils/use-copy-to-clipboard";
import { sendHapticAction } from "@/utils/miniapp";
import PriceTiny from "@/features/token-detail/components/format-price";
import PreviewTokenLogoModal from "@/features/token-detail/components/preview-token-logo";

export function AboutCard({ data }: { data?: MemeResponse; refetch: () => void }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { mutate: likeMeme } = useMemeControllerLikeMeme();
  const [isLike, setIsLike] = useState(data?.isUserLike || false);
  const [totalLikes, setTotalLikes] = useState(data?.totalLikes || 0);
  const [isOpenIsPreviewTokenLogoModal, setIsOpenPreviewTokenLogoModal] = useState(false);

  const handleLikeMeme = () => {
    likeMeme(
      {
        data: {
          tokenAddress: data?.tokenAddress || "",
        },
      },
      {
        onSuccess: () => {
          setIsLike(prev => !prev);
          setTotalLikes(prev => (isLike ? prev - 1 : prev + 1));
        },
        onError: () => {
          sendHapticAction("notification", "error");
          toast.error(t("tokenDetail.failedToLike"));
        },
      }
    );
  };

  const { copyToClipboard } = useCopyToClipboard();

  return (
    <div className="space-y-3 rounded-2xl border border-[#E6E8EC] p-3">
      <div className="relative flex items-center gap-2">
        {data?.status === "completed" && (
          <div className="absolute -top-[35px] left-[60%] z-[9] w-max">
            <p
              className="absolute left-3 top-[10px] z-10 text-[#FFF]"
              style={{ transform: "rotate(-10deg)" }}
            >
              {t("tokenDetail.graduated")}
            </p>
            <GraduatedBackground className="absolute left-0 top-0 z-[5] w-[100px]" />
          </div>
        )}

        <div className="relative h-12 w-12 rounded-xl">
          <Image
            src={data?.image}
            alt={data?.name}
            className="h-full w-full rounded-xl object-cover"
            onClick={() => data?.image && setIsOpenPreviewTokenLogoModal(true)}
          />

          {data?.guarded && (
            <div className="p-1/2 z-9999 absolute -bottom-1 -right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full border border-[#E6E8EC] bg-[#FFF] p-[2px]">
              <HumanIcon className="h-7 w-7 text-[#0064EF]" />
            </div>
          )}
        </div>
        <div className="flex-1 text-[#141416]">
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold">{data?.name}</p>
          </div>
          <PriceTiny
            price={Number(data?.currentPriceByUsd)}
            className="!text-lg font-semibold [&_.zero-count]:top-[6px] [&_.zero-count]:text-[12px]"
          />
        </div>
        <div className="flex items-center justify-end gap-3 text-[#141416]">
          <div className="absolute -right-9 -top-9 flex flex-col items-center justify-center gap-1">
            <div
              className={`heart ${isLike ? "heart-is-active" : "0"}`}
              onClick={handleLikeMeme}
            ></div>
            <p className="-mt-9 text-base font-semibold">{numeral(totalLikes).format("0,0")}</p>
          </div>
          {/* <div
            className="flex flex-col items-center justify-center gap-1"
            onClick={() => setOpen(true)}
          >
            <Bookmark className="size-5" />
            <p className="text-base font-semibold">{numeral(data?.totalComments).format("0,0")}</p>
          </div> */}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h4 className="text-sm font-medium">{t("tokenDetail.contractAddress")}</h4>

        <div className="flex h-9 items-center justify-between rounded-[90px] border border-[#E6E8EC] px-4 py-2 !pr-1">
          <p className="text-sm text-[#777E90]">
            {shortenAddress(data?.tokenAddress || "", 8, 10) || "N/A"}
          </p>

          <div
            className="flex items-center justify-center gap-1 rounded-[90px] bg-[#F4F5F6] px-2 py-1 text-sm"
            onClick={() => copyToClipboard(data?.tokenAddress || "")}
          >
            <CopyIcon className="h-4 w-4 text-[#353945]" />
            {t("tokenDetail.copy")}
          </div>
        </div>

        {data?.status === MemeDetailResponseStatus.completed && (
          <div
            className="flex h-9 items-center justify-between rounded-[90px] border border-[#E6E8EC] px-4 py-2"
            onClick={() =>
              window.open(`https://dexscreener.com/worldchain/${data?.pairAddress}`, "_blank")
            }
          >
            <DexscreenerIcon className="h-[14px] w-[12px]" />
            <p className="ml-1.5 mr-auto text-[13px] font-medium">Dexscreener</p>

            <ArrowTopRight className="h-[14px] w-[14px]" />
          </div>
        )}
      </div>

      <div className="space-y-1 pt-1">
        <p className="text-sm font-medium text-[#141416]">{t("tokenDetail.about")}</p>
        <p className="text-sm text-[#777E90]">{data?.description}</p>
      </div>
      <div className="flex items-center rounded-xl border border-[#E6E8EC]">
        <div className="flex flex-1 flex-col items-center justify-center gap-1 py-2">
          <p className="font-medium uppercase text-[#141416]">
            {numeral(data?.marketCap).format("$0a")}
          </p>
          <p className="text-xs text-[#777E90]">{t("tokenDetail.marketCap")}</p>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-1 border-x border-[#E6E8EC] py-2">
          <p className="font-medium uppercase text-[#141416]">
            {numeral(data?.volume24hs).format("$0.00.00a")}
          </p>
          <p className="text-xs text-[#777E90]">{t("tokenDetail.volume24h")}</p>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-1 py-2">
          <p className="font-medium uppercase text-[#141416]">
            {numeral(formatUnits(BigInt(data?.totalSupply || 0), 18)).format("0.00a")}
          </p>
          <p className="text-xs text-[#777E90]">{t("tokenDetail.totalSupply")}</p>
        </div>
      </div>
      {open && <AddedToFavouriteBottomDraw open={open} setOpen={setOpen} />}
      <PreviewTokenLogoModal
        open={isOpenIsPreviewTokenLogoModal}
        setOpen={setIsOpenPreviewTokenLogoModal}
        image={data?.image}
      />
    </div>
  );
}
