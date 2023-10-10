import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme.jsx';
import App from './App.jsx'
import { WagmiConfig, createConfig } from 'wagmi'
import { configureChains } from '@wagmi/core'
import { bsc, bscTestnet } from '@wagmi/core/chains'
import { publicProvider } from "wagmi/providers/public"

const USE_TESTNET = false;
const chainsToUse = USE_TESTNET ? [bscTestnet] : [bsc];
const {
  publicClient,
  webSocketPublicClient
} = configureChains(
  chainsToUse,
  [publicProvider()],
)
const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient
})

const rootElement = document.getElementById('root')
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <ChakraProvider theme={theme}>
        <App chainId={chainsToUse[0].chainId} />
      </ChakraProvider>
    </WagmiConfig>
  </React.StrictMode>,
)