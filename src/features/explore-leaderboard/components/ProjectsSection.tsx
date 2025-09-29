import { HorizontalProjectCard } from "@/components/shared/horizontal-project-card";
import { Separate } from "@/components/shared/separate";
import { useLocalStorage } from "@/hooks/utils/use-local-storage";
import { MemePaginationResponse } from "@/services/models";

interface ProjectsSectionProps {
  data?: MemePaginationResponse;
}

export function ProjectsSection({ data }: ProjectsSectionProps) {
  const [quickBuyAmount] = useLocalStorage<number>("quickBuyAmount", 3);

  return (
    <div className="space-y-2 p-4">
      <div className="space-y-2">
        {data?.data.map((item, index) => (
          <div key={index}>
            <HorizontalProjectCard
              data={item}
              isQuickBuy
              isShowMarketCapV2
              quickBuyAmount={quickBuyAmount}
              isShowGuarded={true}
            />
            {index < data?.data.length - 1 && <Separate />}
          </div>
        ))}
      </div>
    </div>
  );
}
