import React, { useReducer, useEffect, useCallback } from 'react';
import { keyframes } from '@emotion/react';
import { SimpleGrid, Box } from '@chakra-ui/react';
import CardSkeleton from './CardSkeleton';
import Card from './Card';

function cardsReducer(state, action) {
  switch (action.type) {
    case 'SET_CARDS':
      return action.payload;
    case 'REMOVE_CARD':
      const newState = state.filter(
        item => !(item.token.address === action.payload.tokenAddress && item.spender === action.payload.spenderAddress)
      );
      return newState;
    default:
      return state;
  }
}

function CardList({ marginTop, data, isLoading, searchedAddress, chainId }) {
  const [cardsData, dispatch] = useReducer(cardsReducer, []);
  
  useEffect(() => {
    dispatch({ type: 'SET_CARDS', payload: data });
  }, [data]);

  const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
  `;

  const handleRevokeSuccess = useCallback((revokedTokenAddress, spenderAddress) => {
    dispatch({ 
      type: 'REMOVE_CARD', 
      payload: { tokenAddress: revokedTokenAddress, spenderAddress }
    });
  }, []);

  return (
    <Box mx="4" mt={marginTop}>
      <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing="15px">
        {isLoading ? (
          Array(1).fill().map((_, index) => <CardSkeleton key={index} />)
        ) : (
          cardsData.map((dataItem, index) => (
            <Box
              key={`${dataItem.token.address}-${dataItem.spender}-${index}`}
              as="div"
              opacity={0}
              animation={`${fadeIn} 0.1s ease forwards ${index * 0.1}s`}
            >
              <Card 
                {...dataItem} 
                searchedAddress={searchedAddress} 
                chainId={chainId} 
                onRevokeSuccess={handleRevokeSuccess}
              />
            </Box>
          ))
        )}
      </SimpleGrid>
    </Box>
  );
}

export default CardList;