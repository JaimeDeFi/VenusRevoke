import React from 'react';
import { Box, VStack, HStack, Grid, Skeleton } from '@chakra-ui/react';

function CardSkeleton() {
  return (
    <Box p="3" shadow="md" borderWidth="1px" borderRadius="md" maxW="250px" mx="auto">
      <VStack align="start" spacing="3">
        <HStack justify="space-between" width="100%">
          <HStack spacing="3">
            <Skeleton boxSize="8" borderRadius="full" />
            <Skeleton height="20px" width="80px" />
          </HStack>
          <Skeleton height="20px" width="20px" />
        </HStack>

        <HStack align="start" width="100%">
          <Grid templateColumns="auto auto" alignItems="start" gap="1">
            <Skeleton height="clamp(11px, 1.5vw, 15px)" width="50px" />
            <Skeleton height="clamp(11px, 1.5vw, 15px)" width="70px" />
            <Skeleton height="clamp(11px, 1.5vw, 15px)" width="70px" />
            <Skeleton height="clamp(11px, 1.5vw, 15px)" width="70px" />
            <Skeleton height="clamp(11px, 1.5vw, 15px)" width="70px" />
            <Skeleton height="clamp(11px, 1.5vw, 15px)" width="100px" />
            <Skeleton height="clamp(11px, 1.5vw, 15px)" width="45px" />
            <Skeleton height="clamp(11px, 1.5vw, 15px)" width="70px" />
            <Skeleton height="clamp(11px, 1.5vw, 15px)" width="90px" />
            <Skeleton height="clamp(11px, 1.5vw, 15px)" width="100px" />
          </Grid>
        </HStack>
      </VStack>
    </Box>
  );
}

export default CardSkeleton;
