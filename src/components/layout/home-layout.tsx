import { Outlet } from "@tanstack/react-router";
import { useLayoutEffect } from "react";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { BottomNav } from "./bottom-nav";
import NiceModal from "@ebay/nice-modal-react";
import { Toaster } from "sonner";
import { useAtom } from "jotai";
import { store } from "@/store";

export function HomeLayout() {
  useLayoutEffect(() => {
    const iframes = document.querySelectorAll("iframe");
    for (const iframe of iframes) {
      iframe.remove();
    }
  }, []);

  const [appProvider, _] = useAtom(store.appProviderAtom);

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      }
    >
      <NiceModal.Provider>
        <main
          className={`min-h-screen w-full overflow-hidden bg-white`}
          style={{ paddingBottom: appProvider.hiddenBottomNav ? "0px" : "98px" }}
        >
          <Outlet />

          <BottomNav />
        </main>
        <Toaster position="top-center" richColors />
      </NiceModal.Provider>
    </Suspense>
  );
}
