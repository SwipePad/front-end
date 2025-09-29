import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { shortenAddress } from "@/lib/utils";
import { isAddress } from "viem";
import { Image } from "@/components/ui/image";

interface CreatedByProps {
  creator: string;
  address: string;
  avatar?: string;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
  size?: "sm" | "md";
  onClick?: (e: React.MouseEvent) => void;
}

const ProfileButton = ({
  children,
  address,
  onClick,
  className,
}: {
  children: React.ReactNode;
  address: string;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick(e);
    } else {
      navigate({ to: "/profile/$profileId", params: { profileId: address } });
    }
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
};

export function CreatedBy({
  creator,
  address,
  avatar,
  className,
  labelClassName,
  valueClassName,
  size = "md",
  onClick,
}: CreatedByProps) {
  const textSizes = {
    sm: "text-sm",
    md: "text-base",
  };

  return (
    <div className={cn("flex items-center gap-2 leading-none", className)}>
      <span className={cn("text-white/60", textSizes[size], labelClassName)}>Created by:</span>
      <div className="flex items-center gap-2">
        <ProfileButton address={address} onClick={onClick} className="block">
          <div className="h-6 w-6 flex-shrink-0 overflow-hidden rounded-full">
            <Image src={avatar} alt={creator} className="h-full w-full object-cover" />
          </div>
        </ProfileButton>
        <ProfileButton
          address={address}
          onClick={onClick}
          className={cn(
            "text-white/60",
            textSizes[size],
            valueClassName,
            "transition-colors hover:text-white"
          )}
        >
          {isAddress(creator) ? shortenAddress(creator) : creator}
        </ProfileButton>
      </div>
    </div>
  );
}
