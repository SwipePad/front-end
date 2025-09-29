import { cn } from "@/lib/utils";

export function OrderCircle({ index }: { index: number }) {
  return (
    <div
      className={cn(
        "flex h-[22px] w-[22px] items-center justify-center rounded-full border-[1.5px] border-[#D1D4DC] bg-[#E6E8EC]",
        {
          "border-[#EAA900] bg-[#FFC121]": index === 0,
          "border-[#0071EA] bg-[#28ADFF]": index === 1,
          "border-[#007039] bg-[#009C50]": index === 2,
        }
      )}
    >
      <p
        className={cn("text-[10px] font-black", {
          "text-white": index === 0 || index === 1 || index === 2,
          "text-[#353945]": index > 2,
        })}
      >
        {index + 1}
      </p>
    </div>
  );
}
