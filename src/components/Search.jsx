import React, { useState, useImperativeHandle, useEffect } from 'react';
import { Input, Button, Icon, Text, Flex, InputGroup, InputLeftElement, InputRightElement, useColorModeValue, useTheme } from '@chakra-ui/react';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';
import { scanAddress, transformDataForCard } from './searchHelpers';
import LogoVenus from './LogoVenus.jsx';

const Search = React.forwardRef(({ onSearchButtonClick, isSearchBarInitPosition, onResults, onLoading, clearAll, setSearchBarText, SearchBarText }, ref) => {
  const [isLogoVisible, setIsLogoVisible] = useState(true);
  const theme = useTheme();
  const textColor = useColorModeValue(theme.colors.customGray[400], 'white');

  const handleSearch = async () => {
    if (SearchBarText && !SearchBarText.startsWith("0x") || SearchBarText.length !== 42) return;
    setIsLogoVisible(false);
    onLoading(true);
    onSearchButtonClick();
    try {
      const rawResults = await scanAddress(SearchBarText);
      const transformedPromises = rawResults.map(transformDataForCard);
      const transformedResults = await Promise.all(transformedPromises);
      onResults(transformedResults);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      onLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    handleSearch,
  }));

  useEffect(() => {
    if (SearchBarText) {
      handleSearch();
    }
  }, [SearchBarText]);

  const handleClearSearch = () => {
    clearAll();
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
            placeholder="Enter a BNBChain Wallet Address or Click Connect"
            value={SearchBarText || ''}
            onChange={(e) => setSearchBarText(e.target.value)}
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
        <Button flexShrink="0" onClick={handleSearch} variant="simple">
          Search
        </Button>
      </Flex>
    </Flex>
  );
});

export default Search;
