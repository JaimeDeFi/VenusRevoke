import React, { useState, useImperativeHandle } from 'react';
import { Input, Button, Icon, Text, Flex, InputGroup, InputLeftElement, InputRightElement, useColorModeValue, useTheme, useToast } from '@chakra-ui/react';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';
import { useChainId } from 'wagmi';
import { scanAddress, transformDataForCard } from './searchHelpers';
import LogoVenus from './LogoVenus.jsx';

const Search = React.forwardRef(({ onSearchButtonClick, isSearchBarInitPosition, onResults, onLoading, clearAll, setSearchBarText, SearchBarText, selectedChainId }, ref) => {
  const chainId = useChainId();
  const [isLogoVisible, setIsLogoVisible] = useState(true);
  const theme = useTheme();
  const textColor = useColorModeValue(theme.colors.customGray[400], 'white');
  const toast = useToast();

  const handleSearch = async () => {
    if (!SearchBarText || !SearchBarText.startsWith("0x") || SearchBarText.length !== 42) {
      onResults([]);
      return;
    }
    if (chainId !== selectedChainId) {
      console.warn("Chain mismatch, not performing search");
      return;
    }
    setIsLogoVisible(false);
    onLoading(true);
    onSearchButtonClick();
    try {
      const rawResults = await scanAddress(SearchBarText, selectedChainId);
      const transformedPromises = rawResults.map(txData => transformDataForCard(txData, selectedChainId));
      const transformedResults = await Promise.all(transformedPromises);
      onResults(transformedResults);
    } catch (error) {
      console.error("Error fetching data:", error);
      onResults([]);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      onLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    handleSearch,
  }));

  const handleClearSearch = () => {
    clearAll();
  };

  const handleInputChange = (e) => {
    setSearchBarText(e.target.value);
  };

  const handleSearchClick = () => {
    handleSearch();
  };

  return (
    <Flex
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
      width="full"
      position="absolute"
      top={isSearchBarInitPosition ? "clamp(200px, 20vh, 220px)" : "90px"}
      left="50%"
      transform={isSearchBarInitPosition ? "translate(-50%, -50%)" : "translate(-50%, 0)"}
      transition='all 0.5s ease-in-out'
      direction="column"
      align="center"
    >
      <Flex
        align="center"
        justifyContent="center"
        mb="1"
        overflow='hidden'
        opacity={isLogoVisible ? 1 : 0}
        visibility={isLogoVisible ? 'visible' : 'hidden'}
        height={isLogoVisible ? "clamp(60px, 12vw, 80px)" : "0"}
        transition="opacity 0.5s ease-in-out, visibility 0.5s ease-in-out, height 0.5s ease-in-out"
      >
        <LogoVenus />
        <Flex align="stretch" ml="clamp(5px, 2vw, 10px)">
          <Flex direction="column" justifyContent="center">
            <Text fontSize={`clamp(42px, 8vw, 58px)`} fontWeight="bold" color={textColor}>
              REVOKE!
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex width="90vw" maxW="580px" justifyContent="space-between">
        <InputGroup flex="1" marginRight="1">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="customGray.600" />
          </InputLeftElement>
          <Input
            placeholder="Enter a Wallet Address or Click Connect"
            value={SearchBarText || ''}
            onChange={handleInputChange}
            flex="1"
            marginRight="2"
            fontSize="clamp(6px, 2vw, 15px)"
            id="searchInput"
          />
          {SearchBarText && (
            <InputRightElement>
              <Button
                onClick={handleClearSearch}
                variant="iconxs"
                size="xs"
                mr="4"
              >
                <Icon as={CloseIcon} className="white" />
              </Button>
            </InputRightElement>
          )}
        </InputGroup>
        <Button flexShrink="0" onClick={handleSearchClick} variant="simple">
          Search
        </Button>
      </Flex>
    </Flex>
  );
});

export default Search;