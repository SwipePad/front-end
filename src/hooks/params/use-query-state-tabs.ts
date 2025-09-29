import { parseAsString, useQueryState } from "nuqs";

export const useQueryParamsTabs = (defaultValue: string = "") => {
  const [tabs, setTabs] = useQueryState("tabs", parseAsString.withDefault(defaultValue));

  return { tabs, setTabs };
};
