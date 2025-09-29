import { HorizontalBaseCard } from "@/components/shared/horizontal-base-card";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { useUserControllerFollow } from "@/services/queries";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { getAddress } from "viem";

type HorizontalUserCardProps = {
  image: string;
  imageAlt: string;
  isFollow: boolean;
  totalFollowers: number;
  name: string;
  walletAddress: string;
  refetch?: () => void;
};

const HorizontalUserCard = ({
  name,
  image,
  imageAlt,
  isFollow,
  totalFollowers,
  walletAddress,
  refetch,
}: HorizontalUserCardProps) => {
  const { mutateAsync } = useUserControllerFollow();
  const { t } = useTranslation();
  const onFollow = async (address: string) => {
    try {
      await mutateAsync({
        data: {
          followingWalletAddress: getAddress(address),
        },
      });
      refetch?.();
    } catch (error: any) {
      console.error("Error following user:", error);
    }
  };

  const navigate = useNavigate();

  const handleClick = () => {
    navigate({
      to: "/profile/$walletAddress",
      params: { walletAddress },
    });
  };

  return (
    <div className="py-2">
      <HorizontalBaseCard
        leftSection={
          <Image
            src={image}
            alt={imageAlt}
            className="h-10 w-10 rounded-md"
            onClick={handleClick}
          />
        }
        centerSection={
          <div onClick={handleClick}>
            <p className="text-sm font-medium">{name}</p>
            <p className="text-xs font-medium text-[#777E90]">
              {totalFollowers} {t("shared.horizontalUserCard.followers")}
            </p>
          </div>
        }
        rightSection={
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onFollow(walletAddress)}
              variant="pillOutline"
              className="h-7 gap-1 px-3 py-0"
            >
              {isFollow ? t("shared.horizontalUserCard.unfollow") : t("shared.horizontalUserCard.follow")}
            </Button>
          </div>
        }
      />
    </div>
  );
};

export default HorizontalUserCard;
