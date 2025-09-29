import { parseAsInteger, useQueryState } from "nuqs";

export const useQueryParamsPage = (defaultPage: number = 1, defaultPageSize: number = 10) => {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(defaultPage));

  const [pageSize, setPageSize] = useQueryState(
    "pageSize",
    parseAsInteger.withDefault(defaultPageSize)
  );

  return { page, setPage, pageSize, setPageSize };
};
