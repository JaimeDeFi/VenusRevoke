import React, { useState, useEffect } from 'react';
import { useAccount, useConfig } from 'wagmi';
import { switchChain } from '@wagmi/core';
import { config } from '../config';
import { Menu, MenuButton, MenuList, MenuItem, Button, Image, Flex, Text, Box } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

import EthereumIconPath from '../assets/eth.svg';
import BNBIconPath from '../assets/bnb.svg';
import ArbitrumIconPath from '../assets/arbitrum.svg';
import OpBNBIconPath from '../assets/opbnb.svg';

function NetworkChanger({ onNetworkChange }) {
  const { chain } = useAccount();
  const { chains } = useConfig();
  const [selectedChain, setSelectedChain] = useState(chains.find(c => c.name === 'BNB Smart Chain') || chains[0]);
  const chainNameDisplayMap = { 'BNB Smart Chain': 'BNB', 'Arbitrum One': 'Arbitrum' };
  const getDisplayName = (chainName) => chainNameDisplayMap[chainName] || chainName;

  useEffect(() => {
    if (chain?.id !== selectedChain.id) {
      switchChain(config, { chainId: selectedChain.id }).catch((error) => {
        console.error('Error switching chains:', error);
      });
    }
  }, [chain?.id, selectedChain, chains]);

  const handleNetworkChange = async (network) => {
    setSelectedChain(network);
    onNetworkChange(network.id);
    try {
      await switchChain(config, { chainId: network.id });
    } catch (error) {
      console.error('Error switching chains:', error);
    }
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

  return (
    <Menu>
        <MenuButton as={Button} variant="networkSelector" rightIcon={<ChevronDownIcon />} minWidth="150px" height="40px" mr={2} >
    <Flex align="center" width="full">
      <Image src={networkIcon(selectedChain.name)} boxSize="20px" />
      <Text variant="networkSelector" ml="2" mr="auto" isTruncated>{getDisplayName(selectedChain.name)}</Text>
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
              {selectedChain.id === network.id && <ChevronDownIcon color="green.500" />}
            </Flex>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
}

export default NetworkChanger;
