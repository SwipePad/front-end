import { GOOGLE_ANALYTICS_ID } from "@/constants/analytics";
import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize(GOOGLE_ANALYTICS_ID);
};

export const logPageView = (path: string) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

export const logEvent = (action: string, params: Record<string, any> = {}) => {
  ReactGA.event(action, params);
};
