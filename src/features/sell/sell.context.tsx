import { createContext, useContext, useState } from "react";
import { useTranslation } from "react-i18next";

type SellContextType = {
  data: { amount: string; slippage: string; amountToken: string; isSellMax: boolean };
  saveData: (data: {
    amount: string;
    slippage: string;
    amountToken: string;
    isSellMax: boolean;
  }) => void;
};

const SellContext = createContext<SellContextType | null>(null);

const SellProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState({
    amount: "0",
    slippage: "0.5%",
    amountToken: "0",
    isSellMax: false,
  });

  const saveData = (data: {
    amount: string;
    slippage: string;
    amountToken: string;
    isSellMax: boolean;
  }) => {
    setData(data);
  };

  return <SellContext.Provider value={{ data, saveData }}>{children}</SellContext.Provider>;
};

const useSellContext = () => {
  const context = useContext(SellContext);
  const { t } = useTranslation();

  if (!context) {
    throw new Error(t("toaster.form.useSellContextNeedWrapper"));
  }
  return context;
};

export { SellProvider, useSellContext };
