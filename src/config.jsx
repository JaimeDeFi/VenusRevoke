import { http, createConfig } from 'wagmi'
import { mainnet, bsc, opBNB, arbitrum } from 'wagmi/chains'

export const config = createConfig({
  chains: [mainnet, bsc, arbitrum, opBNB],
  transports: {
    [mainnet.id]: http(),
    [bsc.id]: http(),
    [arbitrum.id]: http(),
    [opBNB.id]: http(),
  },
  autoConnect: false,
})