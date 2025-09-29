import { useEffect, useState, useCallback } from "react";
import { Image } from "@/components/ui/image";
import CloseCircleIcon from "@/components/shared/icons/close-circle-icon";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { getAddress } from "viem";
import useToggle from "@/hooks/utils/use-toggle";
import { SearchType } from "@/features/explore-search";

type SearchItem = {
  name: string;
  image: string;
  address: string;
  type: SearchType;
};

type RecentSearchItemProps = SearchItem & {
  onRemove: (address: string) => void;
};

const RecentSearchItem = ({ image, name, address, type, onRemove }: RecentSearchItemProps) => {
  const router = useRouter();
  const navigate = useNavigate();

  const handleRemove = () => onRemove(address);

  const handleClick = () => {
    if (type === SearchType.Token) {
      router.navigate({ to: `/tokens/${getAddress(address)}` });
    } else if (type === SearchType.Creator) {
      navigate({
        to: "/profile/$walletAddress",
        params: { walletAddress: address },
      });
    }
  };

  return (
    <div className="flex justify-between py-2">
      <div className="flex cursor-pointer items-center gap-1.5" onClick={handleClick}>
        <Image
          src={image || "/src/assets/icons/time-circle.svg"}
          alt={`${name}_image`}
          className="h-[19px] w-[19px] rounded-md"
        />
        <p className="text-sm">{name.toUpperCase()}</p>
      </div>

      <button onClick={handleRemove}>
        <CloseCircleIcon />
      </button>
    </div>
  );
};

const getRecentSearches = (): SearchItem[] => {
  try {
    const stored = localStorage.getItem("exploreSearchRecent");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const RecentSearch = () => {
  const [recentSearches, setRecentSearches] = useState<SearchItem[]>([]);
  const { value: shouldRefresh, toggle: toggleRefresh } = useToggle();

  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, [shouldRefresh]);

  const handleRemoveSearch = useCallback(
    (addressToRemove: string) => {
      const updated = getRecentSearches().filter(
        ({ address }) => address.toLowerCase() !== addressToRemove.toLowerCase()
      );
      localStorage.setItem("exploreSearchRecent", JSON.stringify(updated));
      toggleRefresh();
    },
    [toggleRefresh]
  );

  if (recentSearches.length === 0) return null;

  return (
    <div>
      <div className="text-sm font-semibold">Recent searches</div>
      <div className="flex flex-col">
        {recentSearches.map((item, index) => (
          <RecentSearchItem key={index} {...item} onRemove={handleRemoveSearch} />
        ))}
      </div>
    </div>
  );
};

export default RecentSearch;
