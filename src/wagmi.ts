import { createConfig, http } from "wagmi";
import { worldchain } from "@wagmi/core/chains";

export const wagmiConfig = createConfig({
  chains: [worldchain],
  multiInjectedProviderDiscovery: false,
  transports: {
    [worldchain.id]: http(),
  },
});
