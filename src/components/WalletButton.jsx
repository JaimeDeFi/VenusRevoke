import React, { useEffect } from 'react';
import { Button } from '@chakra-ui/react';
import { useAccount, useDisconnect, useConnect } from 'wagmi'
import { injected } from '@wagmi/connectors'

function WalletButton({ setSearchBarText, clearAll, selectedChainId }) {
  const { isConnected, address } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

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
      await connect({ connector: injected() });
      localStorage.setItem('walletConnected', 'true');
      if (selectedChainId) {
        localStorage.setItem('lastConnectedChainId', selectedChainId);
      }
    }
  }

  useEffect(() => {
    const wasConnected = localStorage.getItem('walletConnected');
    if (wasConnected === 'true' && !isConnected) {
      connect({ connector: injected() });
    }
  }, [connect, isConnected]);

  return (
    <Button variant="simple" onClick={handleWalletButtonClick}>
      {isConnected ? (address.slice(0, 4) + "..." + address.slice(-4)) : "Connect"}
    </Button>
  );
}

export default WalletButton;