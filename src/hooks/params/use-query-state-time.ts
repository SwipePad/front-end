import { parseAsString, useQueryState } from "nuqs";

export const useQueryParamsTime = (defaultTime: string = "") => {
  const [time, setTime] = useQueryState("time", parseAsString.withDefault(defaultTime));

  return { time, setTime };
};
