import { BottomDraw } from "@/components/shared/bottom-draw";
import { RadioGroup, RadioGroupItem } from "@worldcoin/mini-apps-ui-kit-react";

type TimeSelectBottomDrawProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  listTime: { label: string; value: string }[];
  time: string;
  setTime: (time: string) => void;
};

export const TimeSelectBottomDraw = ({
  open,
  setOpen,
  listTime,
  time,
  setTime,
}: TimeSelectBottomDrawProps) => {
  const handleTagSelect = (value: string) => {
    setTime(value);
    setOpen(false);
  };

  return (
    <BottomDraw isOpen={open} onClose={() => setOpen(false)} title="Time">
      <RadioGroup
        value={time || listTime[0].value}
        onChange={value => handleTagSelect(value)}
        orientation="vertical"
      >
        <div className="space-y-1 p-4">
          {listTime.map(item => (
            <div className="flex w-full items-center justify-between px-2 py-1" key={item.value}>
              <label className="text-sm font-medium text-[#141416]" htmlFor={item.value.toString()}>
                {item.label}
              </label>

              <RadioGroupItem
                id={item.value.toString()}
                value={item.value.toString()}
                checked={time === item.value.toString()}
              />
            </div>
          ))}
        </div>
      </RadioGroup>
    </BottomDraw>
  );
};
