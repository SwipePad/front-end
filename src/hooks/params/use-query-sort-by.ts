import { parseAsString, useQueryState } from "nuqs";

export const useQueryParamsSortBy = (defaultSortBy: string = "") => {
  const [sortBy, setSortBy] = useQueryState("sortBy", parseAsString.withDefault(defaultSortBy));

  return { sortBy, setSortBy };
};
