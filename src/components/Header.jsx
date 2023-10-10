import { Box, Flex, Spacer, Button, Icon, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa';
import WalletButton from './WalletButton.jsx';
import LogoVenusCommunity from './LogoVenusCommunity.jsx';

function Header({ showLogo, connect, isConnected, setSearchBarText, clearAll }) {
  const { toggleColorMode } = useColorMode();

  return (
    <Box p="4">
      <Flex>
        <Box
          style={{
            transition: 'opacity 1.5s ease-in-out',
            opacity: showLogo ? 1 : 0
          }}
        >
          {showLogo && <LogoVenusCommunity />}
        </Box>
        <Spacer />
        <Button
          onClick={toggleColorMode}
          variant="icon"
          mr="2"
        >
          <Icon as={useColorModeValue(FaMoon, FaSun)} className="white" />
        </Button>
        <WalletButton
          connect={connect}
          isConnected={isConnected}
          setSearchBarText={setSearchBarText}
          clearAll={clearAll}
        />
      </Flex>
    </Box>
  );
}

export default Header;
