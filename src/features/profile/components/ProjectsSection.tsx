import { useUser } from "@/components/providers/user-provider";
import { HorizontalProjectCard } from "@/components/shared/horizontal-project-card";
import { Separate } from "@/components/shared/separate";
import { useQueryParamsPage } from "@/hooks/params/use-query-state-page";
import { MemeResponse } from "@/services/models";
import { useMemeControllerQueryPagination } from "@/services/queries";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAddress } from "viem";

export function ProjectsSection({
  profileId,
  setTotalProjects,
  isOtherProfile,
}: {
  profileId?: string;
  isOtherProfile?: boolean;
  setTotalProjects: (total: number) => void;
}) {
  const { user } = useUser();
  const [page, setPage] = useState(1);
  const [creatorProjects, setCreatorProjects] = useState<MemeResponse[]>([]);
  const { pageSize } = useQueryParamsPage();
  const { t } = useTranslation();
  const {
    data: creatorProjectsRes,
    isFetching,
    isLoading,
  } = useMemeControllerQueryPagination({
    creator: getAddress(profileId ?? user.address!),
    page: page,
    pageSize: pageSize,
  });

  useEffect(() => {
    if (creatorProjectsRes && !isLoading && !isFetching) {
      if (page === 1) {
        setCreatorProjects([...creatorProjectsRes.data]);
        setTotalProjects(creatorProjectsRes.total);
      } else {
        const newData = [...creatorProjects, ...creatorProjectsRes.data];

        if (newData?.length <= creatorProjectsRes?.total) {
          setCreatorProjects(newData);
          setTotalProjects(creatorProjectsRes.total);
        }
      }
    }
  }, [creatorProjectsRes, page, setTotalProjects, setCreatorProjects, isLoading, isFetching]);

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;

      if (
        nearBottom &&
        !isFetching &&
        !isLoading &&
        creatorProjectsRes?.data?.length === pageSize
      ) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, creatorProjectsRes, pageSize]);

  return (
    <div className="space-y-2 p-4">
      <div className="space-y-2">
        {creatorProjects.map((item, index) => (
          <div key={index}>
            <HorizontalProjectCard data={item} isEditable={!isOtherProfile && true} />
            {index < creatorProjects.length - 1 && <Separate />}
          </div>
        ))}
        {isLoading || isFetching ? <p className="text-center">{t("profile.loadingMore")}</p> : null}
      </div>
    </div>
  );
}
