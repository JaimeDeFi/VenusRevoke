import React, { useEffect } from 'react';
import { Button } from '@chakra-ui/react';
import { useAccount, useDisconnect, useConnect } from 'wagmi'
import { injected } from '@wagmi/connectors'

function WalletButton({ setSearchBarText, clearAll }) {
  const { isConnected, address } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

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
      await connect({ connector: injected() })
    }
  }

  return (
    <Button variant="simple" onClick={handleWalletButtonClick}>
      {isConnected ? (address.slice(0, 4) + "..." + address.slice(-4)) : "Connect"}
    </Button>
  );
}

export default WalletButton;
