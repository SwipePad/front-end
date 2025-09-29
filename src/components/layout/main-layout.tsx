import { Suspense, useLayoutEffect } from "react";
import NiceModal from "@ebay/nice-modal-react";
import { Outlet } from "@tanstack/react-router";
import { Toaster } from "@/components/shared/toast";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeaderMarquee } from "@/components/layout/header-marquee";
import { Loader2 } from "lucide-react";

export function MainLayout() {
  useLayoutEffect(() => {
    const iframes = document.querySelectorAll("iframe");
    for (const iframe of iframes) {
      iframe.remove();
    }
  }, []);

  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      }
    >
      <NiceModal.Provider>
        <main className="bg-background relative min-h-screen w-full overflow-hidden">
          <HeaderMarquee />
          <Header />
          <div className="relative">
            <div className="relative isolate">
              <Outlet />
            </div>
          </div>
          <Footer />
        </main>
        <Toaster />
      </NiceModal.Provider>
    </Suspense>
  );
}
