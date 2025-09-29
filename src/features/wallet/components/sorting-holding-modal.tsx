import { BottomDraw } from "@/components/shared/bottom-draw";
import { useQueryParamsSortBy } from "@/hooks/params/use-query-sort-by";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

type SortingHoldingModalProps = {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
};

const SortingHoldingModal = ({ isOpen, setOpen }: SortingHoldingModalProps) => {
  const { t } = useTranslation();

  const orderOptions = [
    {
      label: t("wallet.holdingDesc"),
      value: "holdingDesc",
    },
    {
      label: t("wallet.holdingAsc"),
      value: "holdingAsc",
    },
    {
      label: t("wallet.default"),
      value: "default",
    },
  ];

  const { sortBy, setSortBy } = useQueryParamsSortBy(orderOptions[2].value);

  return (
    <BottomDraw isOpen={isOpen} onClose={() => setOpen(false)} title={t("wallet.sortingBy")}>
      <div className="mt-4 flex flex-col gap-2 px-4">
        {orderOptions.map(option => {
          return (
            <div
              key={option.value}
              className="flex items-center py-2 text-sm font-medium"
              onClick={() => {
                setSortBy(option.value);
                setOpen(false);
              }}
            >
              {option.label}

              <div
                className={cn(
                  "ml-auto flex h-5 w-5 items-center justify-center rounded-full border border-[#D2D5DA]",
                  sortBy === option.value ? "border-none bg-black" : "bg-white"
                )}
              >
                <div className="h-1/2 w-1/2 rounded-full bg-white"></div>
              </div>
            </div>
          );
        })}
      </div>
    </BottomDraw>
  );
};

export default SortingHoldingModal;
