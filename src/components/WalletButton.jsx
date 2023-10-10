import React, { useEffect } from 'react';
import { Button } from '@chakra-ui/react';
import { useAccount } from 'wagmi'
import { disconnect } from '@wagmi/core';

function WalletButton({ connect, isConnected, setSearchBarText, clearAll }) {
  const { address } = useAccount();

  useEffect(() => {
    if (address) {
      setSearchBarText(address);
    }
  }, [address]);

  const handleWalletButtonClick = async () => {
    if (isConnected) {
      await disconnect();
      clearAll();
    } else {
      await connect();
    }
  }

  return (
    <Button variant="simple" onClick={handleWalletButtonClick}>
      {isConnected ? (address.slice(0, 4) + "..." + address.slice(38)) : "Connect"}
    </Button>
  );
}

export default WalletButton;
