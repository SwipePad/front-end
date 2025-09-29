import { CreateAndEarnBanner } from "@/components/shared/create-token-reward-banner";
import { useTemporaryVisibility } from "@/hooks/utils/use-temporary-visibility";
import { store } from "@/store";
import { sendHapticAction } from "@/utils/miniapp";
import { useLocation, useNavigate } from "@tanstack/react-router";
import clsx from "clsx";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

const ExplorerIcon = (props: { fill?: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M7.92 13.4697C9.33 13.4697 10.46 14.6107 10.46 16.0307V19.4397C10.46 20.8497 9.33 21.9997 7.92 21.9997H4.54C3.14 21.9997 2 20.8497 2 19.4397V16.0307C2 14.6107 3.14 13.4697 4.54 13.4697H7.92ZM19.4601 13.4697C20.8601 13.4697 22.0001 14.6107 22.0001 16.0307V19.4397C22.0001 20.8497 20.8601 21.9997 19.4601 21.9997H16.0801C14.6701 21.9997 13.5401 20.8497 13.5401 19.4397V16.0307C13.5401 14.6107 14.6701 13.4697 16.0801 13.4697H19.4601ZM7.92 2C9.33 2 10.46 3.15 10.46 4.561V7.97C10.46 9.39 9.33 10.53 7.92 10.53H4.54C3.14 10.53 2 9.39 2 7.97V4.561C2 3.15 3.14 2 4.54 2H7.92ZM19.4601 2C20.8601 2 22.0001 3.15 22.0001 4.561V7.97C22.0001 9.39 20.8601 10.53 19.4601 10.53H16.0801C14.6701 10.53 13.5401 9.39 13.5401 7.97V4.561C13.5401 3.15 14.6701 2 16.0801 2H19.4601Z"
        {...props}
      />
    </svg>
  );
};

const FeedIcon = (props: { fill?: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M9.13502 20.7733V17.7156C9.13502 16.9351 9.77242 16.3023 10.5587 16.3023H13.4329C13.8104 16.3023 14.1725 16.4512 14.4395 16.7163C14.7065 16.9813 14.8565 17.3408 14.8565 17.7156V20.7733C14.8541 21.0978 14.9823 21.4099 15.2126 21.6402C15.4429 21.8705 15.7563 22 16.0832 22H18.0441C18.9599 22.0023 19.839 21.6428 20.4874 21.0008C21.1358 20.3588 21.5002 19.487 21.5002 18.5778V9.86686C21.5002 9.13246 21.1723 8.43584 20.6049 7.96467L13.9343 2.67587C12.7739 1.74856 11.1114 1.7785 9.98564 2.74698L3.46726 7.96467C2.87298 8.42195 2.5178 9.12064 2.50024 9.86686V18.5689C2.50024 20.4639 4.04763 22 5.95642 22H7.87253C8.55147 22 9.10324 21.4562 9.10816 20.7822L9.13502 20.7733Z"
        {...props}
      />
    </svg>
  );
};

const WalletIcon = (props: { fill?: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M16.5156 3C19.9644 3 22 4.98459 22 8.3818H17.7689V8.41647C15.8052 8.41647 14.2133 9.96849 14.2133 11.883C14.2133 13.7975 15.8052 15.3495 17.7689 15.3495H22V15.6615C22 19.0154 19.9644 21 16.5156 21H7.48444C4.03556 21 2 19.0154 2 15.6615V8.33847C2 4.98459 4.03556 3 7.48444 3H16.5156ZM21.2533 9.87241C21.6657 9.87241 22 10.1983 22 10.6004V13.131C21.9952 13.5311 21.6637 13.8543 21.2533 13.8589H17.8489C16.8548 13.872 15.9855 13.2084 15.76 12.2643C15.6471 11.6783 15.8056 11.0736 16.1931 10.6122C16.5805 10.1509 17.1573 9.88007 17.7689 9.87241H21.2533ZM18.2489 11.0424H17.92C17.7181 11.0401 17.5236 11.1166 17.38 11.255C17.2364 11.3934 17.1556 11.5821 17.1556 11.779C17.1555 12.1921 17.4964 12.5282 17.92 12.533H18.2489C18.6711 12.533 19.0133 12.1993 19.0133 11.7877C19.0133 11.3761 18.6711 11.0424 18.2489 11.0424ZM12.3822 6.89119H6.73778C6.31903 6.89116 5.9782 7.2196 5.97333 7.62783C5.97333 8.04087 6.31415 8.37705 6.73778 8.3818H12.3822C12.8044 8.3818 13.1467 8.04812 13.1467 7.6365C13.1467 7.22487 12.8044 6.89119 12.3822 6.89119Z"
        {...props}
      />
    </svg>
  );
};

const ProfileIcon = (props: { fill?: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.2504 17.7508H8.05039C7.75039 17.7508 7.55039 17.5508 7.55039 17.2508C7.55039 15.5508 8.95039 13.7508 12.1504 13.7508C15.3504 13.7508 16.7504 15.5508 16.7504 17.2508C16.7504 17.5508 16.5504 17.7508 16.2504 17.7508ZM12.1504 6.25078C13.8504 6.25078 15.2504 7.65078 15.2504 9.35078C15.2504 11.0508 13.8504 12.4508 12.1504 12.4508C10.4504 12.4508 9.05039 11.0508 9.05039 9.35078C9.05039 7.65078 10.4504 6.25078 12.1504 6.25078ZM16.3504 2.55078H7.95039C4.85039 2.55078 2.75039 4.75078 2.65039 8.05078V15.9508C2.65039 19.1508 4.85039 21.4508 7.95039 21.4508H16.3504C19.5504 21.4508 21.6504 19.2508 21.6504 15.9508V8.05078C21.6504 4.85078 19.4504 2.55078 16.3504 2.55078Z"
        {...props}
      />
    </svg>
  );
};

const CreateIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
      <g clip-path="url(#clip0_129_2916)">
        <path
          d="M11 20C11 20.3978 11.158 20.7794 11.4393 21.0607C11.7206 21.342 12.1022 21.5 12.5 21.5C12.8978 21.5 13.2794 21.342 13.5607 21.0607C13.842 20.7794 14 20.3978 14 20V13.5H20.5C20.8978 13.5 21.2794 13.342 21.5607 13.0607C21.842 12.7794 22 12.3978 22 12C22 11.6022 21.842 11.2206 21.5607 10.9393C21.2794 10.658 20.8978 10.5 20.5 10.5H14V4C14 3.60218 13.842 3.22064 13.5607 2.93934C13.2794 2.65804 12.8978 2.5 12.5 2.5C12.1022 2.5 11.7206 2.65804 11.4393 2.93934C11.158 3.22064 11 3.60218 11 4V10.5H4.5C4.10218 10.5 3.72064 10.658 3.43934 10.9393C3.15804 11.2206 3 11.6022 3 12C3 12.3978 3.15804 12.7794 3.43934 13.0607C3.72064 13.342 4.10218 13.5 4.5 13.5H11V20Z"
          fill="#777E91"
        />
      </g>
      <defs>
        <clipPath id="clip0_129_2916">
          <rect width="24" height="24" fill="white" transform="translate(0.5)" />
        </clipPath>
      </defs>
    </svg>
  );
};

const LIST_PATH_HIDDEN_BOTTOM_NAV = ["/wallet/my-activity", "/create-token"];

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isHiddenBottomNav, setIsHiddenBottomNav] = useState(false);

  const [_, setAppProvider] = useAtom(store.appProviderAtom);

  const address = localStorage.getItem("address");

  useEffect(() => {
    const currentPath = location.pathname;
    if (LIST_PATH_HIDDEN_BOTTOM_NAV.includes(currentPath)) {
      setIsHiddenBottomNav(true);
      setAppProvider(prev => ({
        ...prev,
        hiddenBottomNav: true,
      }));

      return;
    }

    setIsHiddenBottomNav(false);
    setAppProvider(prev => ({
      ...prev,
      hiddenBottomNav: false,
    }));
  }, [location, setIsHiddenBottomNav]);

  const isVisibleCreateTokenAndEarnBanner = useTemporaryVisibility(8000);

  return (
    <div
      className={clsx("fixed bottom-0 left-0 right-0 z-20 border-t bg-white py-[6px] pb-[20px]")}
      style={{
        display: isHiddenBottomNav ? "none" : "block",
      }}
    >
      <div className="flex w-full items-center justify-between gap-1 px-4">
        <div
          className="flex basis-2/12 items-center justify-center p-4"
          onClick={() => {
            navigate({ to: "/feed" });
            sendHapticAction();
          }}
        >
          <FeedIcon fill={location.pathname.includes("/feed") ? "#FF3E56" : "#CCCCCC"} />
        </div>
        <div
          className="flex basis-2/12 items-center justify-center p-4"
          onClick={() => {
            navigate({ to: "/explore" });
            sendHapticAction();
          }}
        >
          <ExplorerIcon fill={location.pathname.includes("/explore") ? "#FF3E56" : "#CCCCCC"} />
        </div>

        <div
          className="relative"
          onClick={() => {
            navigate({ to: "/create-token" });
            sendHapticAction();
          }}
        >
          {isVisibleCreateTokenAndEarnBanner && <CreateAndEarnBanner />}

          <div className="animation-border relative">
            <CreateIcon />
          </div>
        </div>

        <div
          className="flex basis-2/12 items-center justify-center p-4"
          onClick={() => {
            navigate({ to: "/wallet" });
            sendHapticAction();
          }}
        >
          <WalletIcon fill={location.pathname.includes("/wallet") ? "#FF3E56" : "#CCCCCC"} />
        </div>
        <div
          className="flex basis-2/12 items-center justify-center p-4"
          onClick={() => {
            navigate({ to: `/profile/${address}` });
            sendHapticAction();
          }}
        >
          <ProfileIcon
            fill={
              location.pathname.includes("/profile") &&
              address &&
              location.pathname.includes(address)
                ? "#FF3E56"
                : "#CCCCCC"
            }
          />
        </div>
      </div>
    </div>
  );
};
