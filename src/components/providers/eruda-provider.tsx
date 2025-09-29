import eruda from "eruda";
import { ReactNode, useEffect } from "react";

const Eruda = (props: { children: ReactNode }) => {
  useEffect(() => {
    try {
      eruda.init();
    } catch (error) {
      console.log("Eruda failed to initialize", error);
    }
  }, []);

  return <>{props.children}</>;
};

export const ErudaProvider = (props: { children: ReactNode }) => {
  if (import.meta.env.VITE_ENV === "prod") {
    return props.children;
  }
  return <Eruda>{props.children}</Eruda>;
};
