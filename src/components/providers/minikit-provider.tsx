import { Onboard } from "@/features/onboard";
import { MiniKit } from "@worldcoin/minikit-js";
import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [isNotMiniapp, setIsNotMiniapp] = useState<boolean>(false);
  const { t } = useTranslation();
  useEffect(() => {
    MiniKit.install();
    if (!MiniKit.isInstalled()) {
      console.warn(t("minikit.notInstalled"));
      setIsLogged(false);
      setIsNotMiniapp(true);
    }
  }, [t]);

  if (isNotMiniapp) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="mb-4 text-2xl font-bold">{t("minikit.notInstalled")}</h1>
        <p className="mb-4 text-lg">{t("minikit.description")}</p>
        <a
          href="https://worldcoin.org/minikit"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {t("minikit.install")}
        </a>
      </div>
    );
  }
  if (!isLogged) {
    return <Onboard isLogged={isLogged} setIsLogged={setIsLogged} />;
  }

  return <>{children}</>;
}
