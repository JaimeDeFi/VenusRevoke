import { createConfig, http } from 'wagmi'
import { mainnet, bsc, opBNB, arbitrum } from 'wagmi/chains'
import { getDefaultConfig } from "connectkit";

const walletConnectProjectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

export const config = createConfig(
  getDefaultConfig({
    appName: "Venus Revoke",
    chains: [mainnet, bsc, arbitrum, opBNB],
    transports: {
      [mainnet.id]: http(),
      [bsc.id]: http(),
      [arbitrum.id]: http(),
      [opBNB.id]: http(),
    },
    walletConnectProjectId,
    appDescription: "Revoke token approvals easily",
    appUrl: "https://revoke.venuscommunity.io",
    appIcon: "https://revoke.venuscommunity.io/icon.png",
  })
);