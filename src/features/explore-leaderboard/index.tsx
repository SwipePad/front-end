import { ProjectsSection } from "@/features/explore-leaderboard/components/ProjectsSection";
import { Top100TokenProjectSection } from "@/features/explore-leaderboard/components/Top100TokenProjectSection";
import { useQueryParamsPage } from "@/hooks/params/use-query-state-page";
import { useMemeControllerQueryPagination } from "@/services/queries";
export function Leaderboard() {
  const { page } = useQueryParamsPage();
  const { data } = useMemeControllerQueryPagination({
    page,
    pageSize: 100,
    sortBy: "currentPriceByUsd",
  });
  return (
    <section className="space-y-1 overflow-hidden rounded-t-2xl">
      <Top100TokenProjectSection />
      <ProjectsSection data={data} />
    </section>
  );
}
