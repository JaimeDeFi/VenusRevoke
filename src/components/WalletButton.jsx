import React, { useEffect } from 'react';
import { Button } from '@chakra-ui/react';
import { useAccount } from 'wagmi'
import { ConnectKitButton } from 'connectkit'

function WalletButton({ setSearchBarText, clearAll }) {
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (address) {
      setSearchBarText(address);
    }
  }, [address, setSearchBarText]);

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, show, truncatedAddress, ensName }) => {
        return (
          <Button 
            variant="simple" 
            flexShrink="0" 
            onClick={show}
          >
            {isConnected ? (ensName ?? truncatedAddress) : "Connect"}
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  );
}

export default WalletButton;