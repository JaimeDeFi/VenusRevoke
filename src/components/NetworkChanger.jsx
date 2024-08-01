import React, { useEffect, useState } from 'react';
import { useConfig, useAccount } from 'wagmi';
import { Menu, MenuButton, MenuList, MenuItem, Button, Image, Flex } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

import EthereumIconPath from '../assets/eth.svg';
import BNBIconPath from '../assets/bnb.svg';
import ArbitrumIconPath from '../assets/arbitrum.svg';
import OpBNBIconPath from '../assets/opbnb.svg';

function NetworkChanger({ onNetworkChange, chainId }) {
  const { chains } = useConfig();
  const { isConnected: wagmiIsConnected } = useAccount();
  const [displayChainId, setDisplayChainId] = useState(null);

  useEffect(() => {
    const storedChainId = localStorage.getItem('lastSelectedChainId');
    if (wagmiIsConnected && chainId) {
      setDisplayChainId(chainId);
      localStorage.setItem('lastSelectedChainId', chainId);
    } else if (storedChainId && chains.some(chain => chain.id === Number(storedChainId))) {
      setDisplayChainId(Number(storedChainId));
    } else {
      setDisplayChainId(chains[0].id);
    }
  }, [wagmiIsConnected, chainId, chains]);

  const chainNameDisplayMap = { 'BNB Smart Chain': 'BNB', 'Arbitrum One': 'Arbitrum' };
  const getDisplayName = (chainName) => chainNameDisplayMap[chainName] || chainName;

  const handleNetworkChange = (network) => {
    setDisplayChainId(network.id);
    localStorage.setItem('lastSelectedChainId', network.id);
    onNetworkChange(network.id);
  };

  const networkIcon = (networkName) => {
    const icons = {
      'Ethereum': EthereumIconPath,
      'BNB Smart Chain': BNBIconPath,
      'Arbitrum One': ArbitrumIconPath,
      'opBNB': OpBNBIconPath
    };
    return icons[networkName] || null;
  };

  if (!displayChainId) return null;

  const currentChain = chains.find(c => c.id === displayChainId) || chains[0];

  return (
    <Menu>
      <MenuButton as={Button} variant="networkSelector" rightIcon={<ChevronDownIcon />} minWidth="80px" height="40px" mr={2}>
        <Flex align="center" width="full">
          <Image src={networkIcon(currentChain.name)} boxSize="20px" />          
        </Flex>
      </MenuButton>
      <MenuList zIndex={2}>
        {chains.map((network) => (
          <MenuItem
            key={network.id}
            icon={<Image src={networkIcon(network.name)} boxSize="20px" />}
            onClick={() => handleNetworkChange(network)}
          >
            <Flex align="center" justify="space-between" width="full">
              {getDisplayName(network.name)}
              {displayChainId === network.id && <ChevronDownIcon color="green.500" />}
            </Flex>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}

export default NetworkChanger;