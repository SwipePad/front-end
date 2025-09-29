import { AlbumResponse } from "@/services/models";
import { createContext, useContext, useState, ReactNode, FC } from "react";
import { useTranslation } from "react-i18next";

type ProfileData = {
  name: string;
  bio: string;
  avatar: string;
  background: string;
  nullifierHash: string | null;
  address: string;
};

type ProfileContextType = {
  data: ProfileData;
  collections: AlbumResponse[];
  setCollections: (collections: AlbumResponse[]) => void;
  saveData: (newData: ProfileData) => void;
};

const defaultProfileData: ProfileData = {
  name: "",
  bio: "",
  avatar: "",
  background: "",
  nullifierHash: null,
  address: "",
};

const ProfileContext = createContext<ProfileContextType | null>(null);

const ProfileProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<ProfileData>(defaultProfileData);
  const [collections, setCollections] = useState<AlbumResponse[]>([]);

  const saveData = (newData: ProfileData) => {
    setData(newData);
  };

  return (
    <ProfileContext.Provider value={{ data, saveData, collections, setCollections }}>
      {children}
    </ProfileContext.Provider>
  );
};

const useProfileContext = (): ProfileContextType => {
  const context = useContext(ProfileContext);
  const { t } = useTranslation();

  if (!context) {
    throw new Error(t("toaster.form.useProfileContextNeedWrapper"));
  }
  return context;
};

export { ProfileProvider, useProfileContext };
