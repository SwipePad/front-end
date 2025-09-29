import { HorizontalProjectCard } from "@/components/shared/horizontal-project-card";
import { Separate } from "@/components/shared/separate";
import { LookEmpty } from "@/features/wallet/components/LookEmpty";
import { MemePaginationResponse } from "@/services/models";
import { Loader2 } from "lucide-react";

type MyProjectsSectionProps = {
  isLoading: boolean;
  myProjects?: MemePaginationResponse;
};

export function MyProjectsSection({ myProjects, isLoading }: MyProjectsSectionProps) {
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <Loader2 className="size-10 animate-spin" />
      </div>
    );
  }

  return myProjects?.data?.length && myProjects?.data?.length > 0 ? (
    <div className="px-4 py-3">
      <div className="space-y-2">
        {myProjects?.data.map((item, index) => (
          <div key={index}>
            <HorizontalProjectCard key={index} data={item} isShowGuarded />
            {index < myProjects?.data.length - 1 && <Separate />}
          </div>
        ))}
      </div>
    </div>
  ) : (
    <LookEmpty />
  );
}
