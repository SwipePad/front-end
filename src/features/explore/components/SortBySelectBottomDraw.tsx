import { BottomDraw } from "@/components/shared/bottom-draw";
import { RadioGroup, RadioGroupItem } from "@worldcoin/mini-apps-ui-kit-react";

type SortBySelectBottomDrawProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  listSortBy: { label: string; value: string; icon: React.ReactNode }[];
  sortBy: string;
  setSortBy: (sortBy: string) => void;
};

export const SortBySelectBottomDraw = ({
  open,
  setOpen,
  listSortBy,
  sortBy,
  setSortBy,
}: SortBySelectBottomDrawProps) => {
  const handleTagSelect = (value: string) => {
    setSortBy(value);
    setOpen(false);
  };

  return (
    <BottomDraw isOpen={open} onClose={() => setOpen(false)} title="Sort By">
      <RadioGroup
        value={sortBy || listSortBy[0].value}
        onChange={value => handleTagSelect(value)}
        orientation="vertical"
      >
        <div className="space-y-1 p-4">
          {listSortBy.map(item => (
            <div className="flex w-full items-center justify-between px-2 py-1" key={item.value}>
              <label
                className="flex items-center gap-2 text-sm font-medium text-[#141416]"
                htmlFor={item.value.toString()}
              >
                <div className="flex items-center gap-2">{item.icon}</div>
                {item.label}
              </label>

              <RadioGroupItem
                id={item.value.toString()}
                value={item.value.toString()}
                checked={sortBy === item.value.toString()}
              />
            </div>
          ))}
        </div>
      </RadioGroup>
    </BottomDraw>
  );
};
