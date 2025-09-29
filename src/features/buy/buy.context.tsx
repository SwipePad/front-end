import { createContext, useContext, useState } from "react";
import { useTranslation } from "react-i18next";

type DataType = {
  amount: string;
  usdAmount: string;
  slippage: string;
  maxRemainingAmount: string;
};
type BuyContextType = {
  data: DataType;
  saveData: (data: DataType) => void;
};

const BuyContext = createContext<BuyContextType | null>(null);

const BuyProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState({ amount: "0WLD", usdAmount: "0$", slippage: "0.5%", maxRemainingAmount: "" });

  const saveData = (data: DataType) => {
    setData(data);
  };

  return <BuyContext.Provider value={{ data, saveData }}>{children}</BuyContext.Provider>;
};

const useBuyContext = () => {
  const context = useContext(BuyContext);
  const { t } = useTranslation();

  if (!context) {
    throw new Error(t("toaster.form.useContextFieldNeedWrapper"));
  }
  return context;
};

export { BuyProvider, useBuyContext };
