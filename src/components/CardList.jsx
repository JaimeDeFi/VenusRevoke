import React, { useState, useEffect } from 'react';
import { keyframes } from '@emotion/react';
import { SimpleGrid, Box } from '@chakra-ui/react';
import CardSkeleton from './CardSkeleton';
import Card from './Card';

function CardList({ marginTop, data, isLoading, searchedAddress, chainId }) {
  const [cardsData, setCardsData] = useState([]);
  useEffect(() => {
    setCardsData(data);
  }, [data]);

  const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
  `;

  const handleRevokeSuccess = (revokedTokenAddress, spenderAddress) => {
    const updatedData = cardsData.filter(item => !(item.token.address === revokedTokenAddress && item.spender === spenderAddress));
    setCardsData(updatedData);
  };  

  return (
    <Box mx="4" mt={marginTop}>
      <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing="15px">
        {isLoading ? (
          Array(1).fill().map((_, index) => <CardSkeleton key={index} />)
        ) : (
          cardsData.map((dataItem, index) => (
            <Box
              key={index}
              as="div"
              opacity={0}
              animation={`${fadeIn} 0.1s ease forwards ${index * 0.1}s`}
            >
              <Card {...dataItem} searchedAddress={searchedAddress} chainId={chainId} onRevokeSuccess={handleRevokeSuccess} />
            </Box>
          ))
        )}
      </SimpleGrid>
    </Box>
  );
}

export default CardList;
