import React, { useEffect, useCallback } from 'react';
import { Button, useToast } from '@chakra-ui/react';
import { useAccount, useDisconnect, useConnect } from 'wagmi'
import { injected } from '@wagmi/connectors'

function WalletButton({ setSearchBarText, clearAll, selectedChainId }) {
  const { isConnected, address } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const toast = useToast();

  const showConnectionError = useCallback((message = "Unable to connect. Make sure you have a wallet app installed in your browser.") => {
    toast({
      title: "Connection Error",
      description: message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "top",
      containerStyle: {
        maxWidth: '300px',
      }
    });
  }, [toast]);

  useEffect(() => {
    if (address) {
      setSearchBarText(address);
    }
  }, [address, setSearchBarText]);

  const handleWalletButtonClick = async () => {
    if (isConnected) {
      await disconnect();
      clearAll();
      localStorage.removeItem('walletConnected');
    } else {
      if (connectors.length === 0) {
        showConnectionError();
        return;
      }
      try {
        await connect({ connector: injected(), chainId: selectedChainId });
        localStorage.setItem('walletConnected', 'true');
        localStorage.setItem('lastConnectedChainId', selectedChainId.toString());
      } catch (error) {
        showConnectionError(error.message || "Failed to connect wallet.");
      }
    }
  }

  useEffect(() => {
    const wasConnected = localStorage.getItem('walletConnected');
    if (wasConnected === 'true' && !isConnected) {
      const attemptReconnect = async () => {
        try {
          await connect({ connector: injected() });
        } catch (error) {
          showConnectionError("Failed to automatically reconnect wallet.");
        }
      };
      attemptReconnect();
    }
  }, [connect, isConnected, showConnectionError]);

  return (
    <Button variant="simple" flexShrink="0" onClick={handleWalletButtonClick}>
      {isConnected ? (address.slice(0, 4) + "..." + address.slice(-4)) : "Connect"}
    </Button>
  );
}

export default WalletButton;