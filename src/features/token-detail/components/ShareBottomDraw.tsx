import { BottomDraw } from "@/components/shared/bottom-draw";
import { Image } from "@/components/ui/image";
import { useTranslation } from "react-i18next";
import { MiniKit } from "@worldcoin/minikit-js";

type ShareBottomDrawProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: {
    avatarUrl: string;
    name: string;
    symbol: string;
    // facebookUrl: string;
    xUrl: string;
    // instagramUrl: string;
    discordUrl: string;
    websiteUrl: string;
  };
};

export const ShareBottomDraw = ({ open, setOpen, data }: ShareBottomDrawProps) => {
  const { t } = useTranslation();
  const shareCommand = async () => {
    await MiniKit.commandsAsync.share({
      title: "SwipePad",
      url: data.websiteUrl,
    });
  };

  const handleShareOnX = () => {
    const baseUrl = "https://x.com/intent/tweet";
    const text = encodeURIComponent(`Check out ${data.name} on SwipePad!`);
    const url = encodeURIComponent(data.websiteUrl);
    const shareUrl = `${baseUrl}?text=${text}&url=${url}`;

    window.open(shareUrl, "_blank");
  };
  return (
    <BottomDraw isOpen={open} onClose={() => setOpen(false)}>
      <div className="space-y-3 p-4">
        <div className="relative w-full">
          <Image src="/images/token-detail/bg1.png" alt="" />

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 space-y-2 text-center">
            <div className="mx-auto h-14 w-14 overflow-hidden rounded-[13px] border-2 border-[#E6E8EC]">
              <Image src={data.avatarUrl} alt="" className="h-full w-full object-cover" />
            </div>
            <p className="text-center text-2xl font-bold text-[#141416]">{data.name}</p>
            <p className="text-center text-sm font-bold text-[#777E90]">${data.symbol}</p>
          </div>
        </div>

        <div className="flex items-center justify-evenly gap-3 py-2">
          <div className="space-y-1 text-center" onClick={shareCommand}>
            <Image src="/images/token-detail/share-icon.png" alt="" className="mx-auto h-11 w-11" />
            <p className="text-xs font-medium text-[#353945]">{t("tokenDetail.share")}</p>
          </div>

          <div className="space-y-1 text-center" onClick={handleShareOnX}>
            <img src="/images/token-detail/x-icon.png" alt="" className="mx-auto h-11 w-11" />
            <p className="text-xs font-medium text-[#353945]">{t("tokenDetail.x")}</p>
          </div>

          {/* <a
            className="space-y-1 text-center"
            href={data.discordUrl}
            target="_blank"
            rel="noreferrer"
          >
            <img src="/images/token-detail/discord-icon.png" alt="" className="mx-auto h-11 w-11" />
            <p className="text-xs font-medium text-[#353945]">{t("tokenDetail.discord")}</p>
          </a> */}
        </div>
      </div>
    </BottomDraw>
  );
};
