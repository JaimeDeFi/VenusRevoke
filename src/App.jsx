import React, { useState, useRef } from 'react';
import { useColorModeValue, Box } from '@chakra-ui/react';
import Header from './components/Header.jsx';
import Search from './components/Search.jsx';
import CardList from './components/CardList.jsx';
import Footer from './components/Footer.jsx';
import { useConnect, useAccount } from "wagmi";
import { InjectedConnector } from 'wagmi/connectors/injected';

function App({ chainId }) {
  const Bodybg = useColorModeValue('body.light', 'body.dark');
  const textColor = useColorModeValue('text.light', 'text.dark');
  const [cardListMarginTop, setCardListMarginTop] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCardList, setShowCardList] = useState(false);
  const [searchBarInitPosition, setSearchBarInitPosition] = useState(true);
  const [results, setResults] = useState([]);
  const [SearchBarText, setSearchBarText] = useState("");
  const searchRef = useRef(null);
  const { isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

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

  const clearAll = () => {
    setResults([]);
    setSearchBarText("");
  };

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
          connect={connect}
          isConnected={isConnected}
          setSearchBarText={setSearchBarText}
          clearAll={clearAll}
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
        />
        {showCardList && <CardList data={results} isLoading={isLoading} marginTop={cardListMarginTop} searchedAddress={SearchBarText} chainId={chainId} />}
      </Box>
      <Footer />
    </>
  );
}

export default App;
