import { Avatar } from "@/components/ui/avatar";
import { Image } from "@/components/ui/image";

type UserAvatarProps = {
  name?: string;
  image: string;
  className?: string;
  onClick?: () => void;
};

export function UserAvatar({ image, className, onClick }: UserAvatarProps) {
  return (
    <Avatar
      className={className}
      onClick={() => {
        onClick && onClick();
      }}
    >
      <Image src={image} className="h-full w-full" />
    </Avatar>
  );
}
