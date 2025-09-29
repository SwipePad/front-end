import { parseAsString, useQueryState } from "nuqs";

export const useQueryParamsSearchInput = () => {
  const [searchInput, setSearchInput] = useQueryState("searchInput", parseAsString);

  return { searchInput, setSearchInput };
};
