import { useUser } from "@/components/providers/user-provider";
import { HorizontalBaseCard } from "@/components/shared/horizontal-base-card";
import { Button } from "@/components/ui/button";
import { Button as MiniappButton } from "@worldcoin/mini-apps-ui-kit-react";
import { TabsSection } from "@/features/profile/components/TabsSection";
import { toCurrency } from "@/lib/number";
import {
  useAlbumControllerGetAlbumNames,
  useMemeControllerQueryPagination,
  useUserControllerFindOne,
  useUserControllerFollow,
} from "@/services/queries";
import { useNavigate, useParams, useRouter } from "@tanstack/react-router";
import { ExternalLink, Loader2, PencilLine } from "lucide-react";
import { getAddress, isAddress } from "viem";
import moment from "moment";
import { UserAndFollowStatusResponse } from "@/services/models";
import { useProfileContext } from "./profile.context";
import { useEffect, useMemo, useState } from "react";
import { ProjectsSection } from "./components/ProjectsSection";
import MessageIcon from "@/assets/icons/message.svg?react";
import { toast } from "@/components/shared/toast";
import { TabsContent } from "@/components/ui/tabs";
import { Image } from "@/components/ui/image";
import { MiniAppVerifyActionErrorPayload, MiniKit, VerificationLevel } from "@worldcoin/minikit-js";
import TickIcon from "@/assets/icons/tick.svg?react";
import CampaignsSection from "@/features/profile/components/CampaignsSection";
import HumanIcon from "@/assets/icons/human.svg?react";
import RectangleIcon from "@/assets/icons/rectangle.svg?react";
import { VERIFY_HUMAN_ACTION, ZERO_ADDRESS } from "@/constants/common";
import { makeApiPostRequest } from "@/services/trading-chart/helpers";
import { useTemporaryVisibility } from "@/hooks/utils/use-temporary-visibility";
import ArrowDownIcon from "@/assets/icons/arrow-down.svg?react";
import SwitchLanguageModal from "@/features/profile/components/SwitchLanguage";
import { useTranslation } from "react-i18next";
import truncateAddress from "@/utils/truncate-address";
import { sendHapticAction } from "@/utils/miniapp";
import { useAtom } from "jotai";
import { store } from "@/store";
import { useCopyToClipboard } from "@/hooks/utils/use-copy-to-clipboard";

export default function ProfilePage() {
  const { profileId } = useParams({
    strict: false,
  });
  const navigate = useNavigate();
  const { user } = useUser();
  const address = localStorage.getItem("address");
  const { saveData, data: profileData, setCollections } = useProfileContext();
  const { t } = useTranslation();
  const [totalProjects, setTotalProjects] = useState(0);
  const [isOpenSwitchLanguageModal, setIsOpenSwitchLanguageModal] = useState(false);
  const { copyToClipboard } = useCopyToClipboard();

  const [_, setAppProvider] = useAtom(store.appProviderAtom);
  const router = useRouter();

  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const setLanguage = (language: string) => {
    i18n.changeLanguage(language);
    setSelectedLanguage(language);
  };

  const isOtherProfile = useMemo(
    () => profileId && profileId.toLowerCase() !== address?.toLowerCase(),
    [profileId, address]
  );

  useEffect(() => {
    if (isOtherProfile) {
      setAppProvider(prev => ({
        ...prev,
        hiddenBottomNav: true,
      }));
    }

    return () => {
      setAppProvider(prev => ({
        ...prev,
        hiddenBottomNav: false,
      }));
    };
  }, [isOtherProfile]);

  const isVisibleVerifyHumanToolTip = useTemporaryVisibility(3000);

  const { data: albums } = useAlbumControllerGetAlbumNames(
    {
      userWalletAddress: getAddress(profileId ?? user.address),
      tokenAddress: undefined,
    },
    {
      query: {
        refetchOnMount: true,
      },
    }
  );

  const { data: creatorProjectsRes } = useMemeControllerQueryPagination({
    creator: getAddress(profileId ?? user.address!),
    page: 1,
    pageSize: 10,
  });

  useEffect(() => {
    if (creatorProjectsRes) {
      if (creatorProjectsRes.data.length) {
        setTotalProjects(creatorProjectsRes.total);
      } else {
        setTotalProjects(0);
      }
    }
  }, [creatorProjectsRes?.total]);

  useEffect(() => {
    if (albums) {
      setCollections(albums);
    }
  }, [albums, setCollections]);

  const { data: userData, refetch } = useUserControllerFindOne(getAddress(profileId ?? address), {
    query: {
      refetchOnMount: "always",
    },
  });

  useEffect(() => {
    if (userData) {
      const currentUserData = (userData as any as UserAndFollowStatusResponse[])[0];

      saveData({
        name: currentUserData.walletAddress.includes(currentUserData.name)
          ? truncateAddress(currentUserData.walletAddress)
          : currentUserData.name,
        avatar: currentUserData?.image,
        background: (currentUserData as any).background ?? "/images/profile/default-bg.png",
        bio: currentUserData.bio,
        nullifierHash: currentUserData.nullifierHash,
        address: currentUserData.walletAddress,
      });
    }
  }, [userData, saveData]);

  const { mutateAsync } = useUserControllerFollow();
  const onFollow = async (address: string) => {
    try {
      await mutateAsync({
        data: {
          followingWalletAddress: getAddress(address),
        },
      });
      await refetch();
    } catch (error: any) {
      console.error("Error following user:", error);
    }
  };

  if (!userData) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  const currentUserData = (userData as any as UserAndFollowStatusResponse[])[0];

  // TODO
  const totalCampaigns = 1;

  const handleVerifyHuman = async () => {
    if (!address) {
      sendHapticAction("notification", "error");
      toast.error(t("profile.somethingWentWrong"));
      return;
    }

    const { finalPayload } = await MiniKit.commandsAsync.verify({
      action: VERIFY_HUMAN_ACTION,
      verification_level: VerificationLevel.Orb,
      signal: getAddress(address || ZERO_ADDRESS),
    });

    if (finalPayload?.status === "error") {
      const message =
        ((finalPayload as MiniAppVerifyActionErrorPayload)?.error_code as string) == "user_rejected"
          ? t("toaster.userRejectedTheTransaction")
          : t("profile.somethingWentWrong");
      sendHapticAction("notification", "error");
      toast.error(message);
      return;
    }

    const { status, ...verifyBody } = finalPayload;

    await makeApiPostRequest("/api/user/verify-human", {
      action: VERIFY_HUMAN_ACTION,
      signal: getAddress(address || ZERO_ADDRESS),
      payload: verifyBody,
    });

    refetch();
  };

  return (
    <section className="relative overflow-hidden rounded-t-2xl pb-[80px]">
      <div className="relative h-[145px]">
        <Image
          src={(profileData as any).background ?? "/images/profile/bg1.png"}
          alt=""
          className="h-full w-full object-cover"
        />

        {isOtherProfile && (
          <div
            className="z-9999 absolute left-2.5 top-4 flex items-center gap-0.5 rounded-full bg-[#FFF] px-2 font-semibold"
            onClick={() => router.history.back()}
          >
            <ArrowDownIcon className="h-[14px] w-[14px] rotate-90 text-[#000000]" />
            {t("profile.back")}
          </div>
        )}

        {!isOtherProfile && (
          <div
            className="z-9999 absolute right-2.5 top-2.5 flex items-center gap-0.5 rounded-full border border-[#000] bg-[#FFF] px-2 font-bold uppercase"
            onClick={() => setIsOpenSwitchLanguageModal(true)}
          >
            {selectedLanguage}
            <ArrowDownIcon className="h-[14px] w-[14px] text-black" />
          </div>
        )}
      </div>

      <div className="relative -mt-6 space-y-[10px] rounded-t-2xl bg-white p-4">
        <div className="space-y-4">
          <HorizontalBaseCard
            leftSection={
              <div className="h-[52px] w-[52px] rounded-xl">
                <Image
                  src={profileData.avatar}
                  alt=""
                  className="h-[52px] w-[52px] rounded-xl object-cover"
                />
              </div>
            }
            centerSection={
              <div
                onClick={() =>
                  copyToClipboard(profileData.address, t("toaster.walletAddressCopied"))
                }
              >
                <div className="flex gap-1">
                  <p className="font-semibold text-[#141416]">
                    {isAddress(profileData?.name)
                      ? truncateAddress(profileData?.name)
                      : (profileData?.name ?? "--")}
                  </p>
                  {profileData?.nullifierHash ? (
                    <>
                      <p className="text-[#777E90]">·</p>
                      <div className="flex items-center gap-1">
                        <HumanIcon className="h-[14px] w-[14px] text-[#0064EF]" />
                        <p className="text-xs font-semibold text-[#0064EF]">
                          {t("profile.humanVerified")}
                        </p>
                      </div>
                    </>
                  ) : (
                    !isOtherProfile && (
                      <div className="relative flex items-center gap-1">
                        <p className="text-[#777E90]">·</p>
                        <div
                          className="flex items-center gap-1 rounded-[34px] border border-[#E6E8EC] px-2.5"
                          onClick={e => {
                            e.stopPropagation();
                            handleVerifyHuman();
                          }}
                        >
                          <HumanIcon className="h-[14px] w-[14px] text-[#0064EF]" />
                          <p className="text-xs font-semibold text-[#0064EF]">
                            {t("profile.verifyHuman")}
                          </p>
                        </div>
                        {isVisibleVerifyHumanToolTip && (
                          <div className="text absolute left-1/2 top-[-34px] w-max -translate-x-1/2 text-nowrap rounded-lg bg-[#0161E8] px-2 py-1.5 text-xs italic text-[#FFF]">
                            {t("profile.alreadyVerifiedWithOrb")}
                            <RectangleIcon className="absolute left-1/2 top-[100%] h-[5px] w-[7px] text-[#0161E8]" />
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
                <p className="text-xs italic text-[#777E90]">
                  {truncateAddress(profileData?.address?.replace(/ /g, "_"))}·{" "}
                  {t("profile.joinedOn")} {moment(currentUserData.created_at).format("DD/MM/YYYY")}
                </p>
              </div>
            }
          />
          <p className="text-xs font-medium text-[#141416]">
            {(userData as any)?.[0]?.bio
              ? (userData as any)?.[0].bio
              : isOtherProfile
                ? t("profile.noBio")
                : t("profile.pleaseUpdateItInYourProfileSettings")}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 py-1">
          <div
            className="flex-1 text-center"
            onClick={() =>
              navigate({ to: `/profile/${currentUserData.walletAddress}/follow?tabs=following` })
            }
          >
            <p className="font-semibold text-[#141416]">
              {toCurrency(currentUserData?.totalFollowing ?? 0, { decimals: 0 })}
            </p>
            <p className="text-sm text-[#A3A8B5]">{t("profile.following")}</p>
          </div>
          <div className="h-5 w-0 border border-[#E6E8EC]"></div>
          <div
            className="flex-1 text-center"
            onClick={() =>
              navigate({ to: `/profile/${currentUserData.walletAddress}/follow?tabs=followers` })
            }
          >
            <p className="font-semibold text-[#141416]">
              {toCurrency(currentUserData?.totalFollowers ?? 0, { decimals: 0 })}
            </p>
            <p className="text-sm text-[#A3A8B5]">
              {t(currentUserData?.totalFollowers > 1 ? "profile.followers" : "profile.follower")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isOtherProfile ? (
            <Button
              variant="pillOutline"
              className="flex-1"
              onClick={() => navigate({ to: `/profile/edit` })}
            >
              {t("profile.editProfile")}
              <PencilLine className="size-[14px]" />
            </Button>
          ) : (
            <MiniappButton
              onClick={() => onFollow(getAddress(profileId))}
              variant={!currentUserData.isFollow ? "primary" : "secondary"}
              className="h-[40px] flex-1"
            >
              {!currentUserData.isFollow ? (
                `${t("profile.follow")} +`
              ) : (
                <>
                  {t("profile.following")} <TickIcon />
                </>
              )}
            </MiniappButton>
          )}

          {!isOtherProfile ? (
            <Button
              variant="pillOutline"
              className="flex-1"
              onClick={() => toast.message(t("profile.comingSoon"))}
            >
              {t("profile.invite")}
              <ExternalLink className="size-[14px]" />
            </Button>
          ) : (
            <Button
              // onClick={async () => {
              //   const data = await MiniKit.getUserByAddress(getAddress(profileId ?? address));
              //   if (data.username) {
              //     const deepLink = getWorldChatDeeplinkUrl({ username: data.username });
              //     window.open(deepLink, "_blank");
              //   }
              // }}
              onClick={() => toast.message(t("profile.comingSoon"))}
              className="hidden flex-1"
              variant="pillOutline"
            >
              {t("profile.message")}
              <MessageIcon />
            </Button>
          )}
        </div>
      </div>

      <div>
        <TabsSection
          totalProjects={totalProjects}
          totalCampaigns={totalCampaigns}
          isOtherProfile={isOtherProfile}
        >
          {!isOtherProfile && (
            <TabsContent value="campaign">
              <CampaignsSection totalCampaigns={totalCampaigns} />
            </TabsContent>
          )}

          <TabsContent value="project">
            <ProjectsSection
              profileId={profileId}
              setTotalProjects={(t: number) => setTotalProjects(t)}
              isOtherProfile={isOtherProfile}
            />
          </TabsContent>
        </TabsSection>
      </div>

      {isOpenSwitchLanguageModal && (
        <SwitchLanguageModal
          open={true}
          setOpen={setIsOpenSwitchLanguageModal}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setLanguage}
        />
      )}
    </section>
  );
}
