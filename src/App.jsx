import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useColorModeValue, Box, useToast } from '@chakra-ui/react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import Header from './components/Header.jsx';
import Search from './components/Search.jsx';
import CardList from './components/CardList.jsx';
import Footer from './components/Footer.jsx';

function App() {
  const Bodybg = useColorModeValue('body.light', 'body.dark');
  const textColor = useColorModeValue('text.light', 'text.dark');
  const [cardListMarginTop, setCardListMarginTop] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCardList, setShowCardList] = useState(false);
  const [searchBarInitPosition, setSearchBarInitPosition] = useState(true);
  const [results, setResults] = useState([]);
  const [SearchBarText, setSearchBarText] = useState("");
  const searchRef = useRef(null);
  const [selectedChainId, setSelectedChainId] = useState(null);
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { isConnected } = useAccount();
  const toast = useToast();

  const handleSearchBarPosition = () => {
    setTimeout(() => {
      setShowCardList(true);
    }, 500);
    setSearchBarInitPosition(false);
    setCardListMarginTop("100px");
  };

  const handleResults = (newResults) => {
    setResults(newResults);
  };

  const handleLoadingState = (loadingState) => {
    setIsLoading(loadingState);
  };

  const handleNetworkChange = useCallback(async (newChainId) => {
    if (newChainId === selectedChainId) return;

    try {
      await switchChain({ chainId: newChainId });
      setSelectedChainId(newChainId);
      toast({
        title: "Network Changed",
        description: `Switched to chain ID: ${newChainId}`,
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error switching chains:', error);
      toast({
        title: "Network switch failed",
        description: "Please try again or switch manually in your wallet.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [selectedChainId, switchChain, toast]);

  const clearAll = () => {
    setResults([]);
    setSearchBarText("");
  };

  useEffect(() => {
    setSearchBarText("");
  }, []);

  useEffect(() => {
    if (chainId) {
      setSelectedChainId(chainId);
    }
  }, [chainId]);

  useEffect(() => {
    if (SearchBarText && searchRef.current && isConnected && chainId === selectedChainId) {
      searchRef.current.handleSearch();
    }
  }, [selectedChainId, SearchBarText, chainId, isConnected]);

  return (
    <>
      <Box
        color={textColor}
        bg={Bodybg}
        minH="100vh"
        paddingBottom="140px"
        position="relative"
      >
        <Header
          showLogo={!searchBarInitPosition}
          setSearchBarText={setSearchBarText}
          clearAll={clearAll}
          onNetworkChange={handleNetworkChange}
          selectedChainId={selectedChainId}
          isConnected={isConnected}
          chainId={chainId}
        />
        <Search
          onSearchButtonClick={handleSearchBarPosition}
          isSearchBarInitPosition={searchBarInitPosition}
          onResults={handleResults}
          onLoading={handleLoadingState}
          clearAll={clearAll}
          setSearchBarText={setSearchBarText}
          SearchBarText={SearchBarText}
          ref={searchRef}
          selectedChainId={selectedChainId}
        />
        {showCardList && 
        <CardList
          data={results}
          isLoading={isLoading}
          marginTop={cardListMarginTop}
          searchedAddress={SearchBarText}
          chainId={selectedChainId}
        />}
      </Box>
      <Footer />
    </>
  );
}

export default App;