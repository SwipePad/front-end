import { cn } from "@/lib/utils";
import { useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export interface HeaderProps {
  className?: string;
  title?: string;
  rightSection?: React.ReactNode;
}
export const Header = ({ className, title, rightSection }: HeaderProps) => {
  const router = useRouter();

  const queryParams = new URLSearchParams(window.location.search);
  const fromTransaction = queryParams.get("fromTransaction");

  const handleGoBack = () => {
    if (fromTransaction) {
      router.navigate({ to: `/explore` });
    } else {
      router.history.back();
    }
  };

  return (
    <div className={cn("flex items-center justify-between p-4", className)}>
      <div className="flex h-10 w-10 flex-1 items-center">
        <ChevronLeft className="h-5 w-5" onClick={handleGoBack} />
      </div>

      <div className="text-base font-semibold leading-6 text-black">{title}</div>

      <div className="flex flex-1 items-center justify-end">{rightSection}</div>
    </div>
  );
};
