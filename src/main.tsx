import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { WagmiProvider } from "wagmi";
import { NuqsAdapter } from "nuqs/adapters/react";
import { Loader2 } from "lucide-react";
import "./i18n";
// import "unfonts.css";
import "./index.css";
import { routeTree } from "./routeTree.gen";
import { wagmiConfig } from "./wagmi";
import { ErudaProvider } from "./components/providers/eruda-provider";
import MiniKitProvider from "./components/providers/minikit-provider";
import "@worldcoin/mini-apps-ui-kit-react/styles.css";
import { UserProvider } from "./components/providers/user-provider";
import AppProvider from "@/components/providers/app-provider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const router = createRouter({
  routeTree,
  defaultPendingComponent: () => (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="text-primary h-8 w-8 animate-spin" />
    </div>
  ),
  defaultPendingMinMs: 0,
  defaultPendingMs: 0,
});

const rootElement = document.getElementById("root") as HTMLElement;
createRoot(rootElement).render(
  // <StrictMode>
  <ErudaProvider>
    <UserProvider>
      <MiniKitProvider>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <NuqsAdapter>
              <AppProvider>
                <RouterProvider router={router} />
              </AppProvider>
            </NuqsAdapter>
          </QueryClientProvider>
        </WagmiProvider>
      </MiniKitProvider>
    </UserProvider>
  </ErudaProvider>
  // </StrictMode>
);
