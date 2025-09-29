import { SearchType } from "@/features/explore-search";
import { useTranslation } from "react-i18next";

type ExploreSearchTypeProps = {
  searchType: SearchType;
  setSearchType: (type: SearchType) => void;
};

const ExploreSearchType = ({ searchType, setSearchType }: ExploreSearchTypeProps) => {
  const { t } = useTranslation();
  return (
    <div className="border-b-1 ml-[-16px] flex w-[calc(100%+32px)] border-b border-[#E6E8EC] px-3">
      {Object.values(SearchType).map(type => {
        const isActive = searchType === type;

        return (
          <div
            className={`px-4 py-2.5 text-[#777E90] capitalize ${isActive && "border-b-2 border-[#141416] font-semibold !text-[#141416]"}`}
            key={type}
            onClick={() => setSearchType(type)}
            style={{ cursor: "pointer" }}
          >
            {t(type)}
          </div>
        );
      })}
    </div>
  );
};

export default ExploreSearchType;
