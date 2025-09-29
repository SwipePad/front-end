import { AXIOS_INSTANCE } from "@/services/custom-client";
import { ResponseClaimParamDtoClaimState } from "@/services/models";
import { createContext, PropsWithChildren, useContext, useState } from "react";

type UserContextType = {
  token: string | null;
  setToken: (token: string) => void;
  setUserData: (
    id: string | null,
    name: string | null,
    address: string | null,
    image: string | null,
    claimState: ResponseClaimParamDtoClaimState
  ) => void;
  user: {
    name?: string | null;
    address?: string | null;
    image?: string | null;
    id?: string | null;
    claimState?: ResponseClaimParamDtoClaimState;
  };
  address: string | null;
  notFirstUser?: boolean;
  setNotFirstUser: (notFirstUser: boolean) => void;
  isHiddenHighLightBanner: boolean;
};

const UserContext = createContext<UserContextType>({
  token: null,
  user: {
    name: null,
    address: "0xdca5cb515de3e710d76c82310e7e15ad091890f8",
    image: null,
    id: null,
  },
  address: null,
  setToken: () => {},
  setUserData: () => {},
  notFirstUser: false,
  setNotFirstUser: () => {},
  isHiddenHighLightBanner: false,
});

type Props = PropsWithChildren;
// AXIOS_INSTANCE.defaults.headers.common["x-jwt"] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3YWxsZXRBZGRyZXNzIjoiMHhkQ2E1Q0I1MTVkRTNFNzEwRDc2QzgyMzEwRTdlMTVhZDA5MTg5MGY4IiwiaWF0IjoxNzUyMDgzNjc5LCJleHAiOjE3NTIxNzAwNzl9.tFx7kbC32pYLgixsEm34FciL3t6SbKVDYB6rJ_SxSbA"
export const UserProvider = (props: Props) => {
  const [user, setUser] = useState<UserContextType>({
    token: localStorage.getItem("token") || null,
    isHiddenHighLightBanner: localStorage.getItem("isHiddenHighLightBanner") === "true",
    setToken: (token: string) => {
      AXIOS_INSTANCE.defaults.headers.common["x-jwt"] = token;
      setUser((prev: any) => ({ ...prev, token }));
      localStorage.setItem("token", token);
    },
    setUserData: (
      id: string | null,
      name: string | null,
      address: string | null,
      image: string | null,
      claimState: ResponseClaimParamDtoClaimState = ResponseClaimParamDtoClaimState.ineligible
    ) => {
      setUser((prev: any) => ({
        ...prev,
        user: {
          id: id || prev.user.id,
          name: name || prev.user.name,
          address: address || prev.user.address,
          image: image || prev.user.image,
          claimState: claimState || prev.user.claimState,
        },
      }));

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: id,
          name: name,
          address: address,
          image: image,
          claimState: claimState,
        })
      );

      localStorage.setItem("address", address || "");
    },
    user: JSON.parse(localStorage.getItem("user") ?? "{}"),
    address: localStorage.getItem("address") || null,
    notFirstUser: localStorage.getItem("notFirstUser") === "true",
    setNotFirstUser: (notFirstUser: boolean) => {
      localStorage.setItem("notFirstUser", String(notFirstUser));
      setUser((prev: any) => ({ ...prev, notFirstUser }));
    },
  });

  return <UserContext.Provider value={user}>{props.children}</UserContext.Provider>;
};

export const useUser = () => {
  return useContext(UserContext);
};
