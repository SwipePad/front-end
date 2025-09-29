import { parseAsString, useQueryState } from "nuqs";

export const useQueryParamsType = () => {
  const [type, setType] = useQueryState("type", parseAsString);

  return { type, setType };
};
