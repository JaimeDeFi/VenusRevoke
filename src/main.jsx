import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import theme from './theme.jsx'
import App from './App.jsx'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' 
import { config } from './config'

const queryClient = new QueryClient()
const rootElement = document.getElementById('root')
const root = ReactDOM.createRoot(rootElement)

root.render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}> 
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </QueryClientProvider> 
    </WagmiProvider>
  </React.StrictMode>,
)
