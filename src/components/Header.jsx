import { Box, Flex, Spacer, Button, Icon, useColorMode, useColorModeValue, useTheme, Text } from '@chakra-ui/react';
import { FaSun, FaMoon } from 'react-icons/fa';
import WalletButton from './WalletButton.jsx';
import NetworkChanger from './NetworkChanger.jsx';
import LogoVenus from './LogoVenus.jsx';

function Header({ showLogo, setSearchBarText, clearAll, onNetworkChange, selectedChainId, isConnected, chainId }) {
  const { toggleColorMode } = useColorMode();
  const theme = useTheme();
  const textColor = useColorModeValue(theme.colors.customGray[400], 'white');

  return (
    <Box p="4">
      <Flex alignItems="center">
        <Flex
          alignItems="center"
          style={{
            transition: 'opacity 1.5s ease-in-out',
            opacity: showLogo ? 1 : 0
          }}
        >
          {showLogo && (
            <>
              <LogoVenus size="clamp(30px, 1vw, 1px)" />
              <Text
                fontSize={`clamp(24px, 3vw, 32px)`}
                fontWeight="bold"
                color={textColor}
                ml="clamp(5px, 1vw, 10px)"
              >
                REVOKE!
              </Text>
            </>
          )}
        </Flex>
        <Spacer />
        <Button
          onClick={toggleColorMode}
          variant="icon"
          mr="2"
        >
          <Icon as={useColorModeValue(FaMoon, FaSun)} className="white" />
        </Button>
        <NetworkChanger
          mr="12"
          onNetworkChange={onNetworkChange}
          selectedChainId={selectedChainId}
          isConnected={isConnected}
          chainId={chainId}
        />
        <WalletButton
          setSearchBarText={setSearchBarText}
          clearAll={clearAll}
        />
      </Flex>
    </Box>
  );
}

export default Header;