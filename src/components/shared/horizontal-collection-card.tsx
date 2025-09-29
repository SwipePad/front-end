import { HorizontalBaseCard } from "@/components/shared/horizontal-base-card";
import { Image } from "@/components/ui/image";

type HorizontalCollectionCardProps = {
  data: {
    imgs: string[];
    name: string;
    description?: string;
    descriptionIcon?: React.ReactNode;
  };
  rightSection?: React.ReactNode;
};

export function HorizontalCollectionCard({ data, rightSection }: HorizontalCollectionCardProps) {
  const get4Imgs = () => {
    return [data.imgs[0], data.imgs[1], data.imgs[2], data.imgs[3]];
  };

  return (
    <HorizontalBaseCard
      leftSection={
        <div className="grid grid-cols-2 gap-[2px] rounded-xl border border-[#E6E8EC] p-1">
          {get4Imgs().map((img, index) =>
            img ? (
              <Image key={index} src={img} alt={data.name} className="size-5 rounded-md" />
            ) : (
              <div key={index} className="size-5 rounded-md bg-[#E6E8EC]" />
            )
          )}
        </div>
      }
      centerSection={
        <div className="flex-1">
          <p className="text-base font-semibold text-[#141416]">{data.name}</p>
          <p className="flex items-center gap-1 text-sm font-medium text-[#777E90]">
            {data.descriptionIcon}
            {data.description}
          </p>
        </div>
      }
      rightSection={rightSection}
    />
  );
}
