import { Separate } from "@/components/shared/separate";
import { AboutCard } from "@/features/token-detail/components/AboutCard";
import { AboutCreator } from "@/features/token-detail/components/AboutCreator";
import { BondingCurveProgress } from "@/features/token-detail/components/BondingCurveProgress";
import { MemeDetailResponse } from "@/services/models";

type OverviewSectionProps = {
  data?: MemeDetailResponse;
  refetch: () => void;
};

export function OverviewSection({ data, refetch }: OverviewSectionProps) {
  return data ? (
    <div className="space-y-2 p-4">
      <AboutCard data={data} refetch={refetch} />

      <BondingCurveProgress data={data} />

      <div className="flex flex-wrap gap-2 font-medium text-[#353945]">
        {data.tags.map(tag => (
          <div
            key={tag}
            className="rounded-xl border border-dashed border-[#E6E8EC] bg-[#F4F5F6] px-3 py-2"
          >
            {tag}
          </div>
        ))}
      </div>

      <Separate />

      <AboutCreator data={data} />
    </div>
  ) : null;
}
