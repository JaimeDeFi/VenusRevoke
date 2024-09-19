import React, { useState, useEffect, useCallback } from 'react';
import { Box, Text, Image, Button, Icon, VStack, HStack, Grid, Link, Spinner } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useAccount, useChainId, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { erc20Abi } from 'viem'

const getExplorerUrl = (chainId) => {
  switch (Number(chainId)) {
    case 1: return 'https://etherscan.io';
    case 56: return 'https://bscscan.com';
    case 42161: return 'https://arbiscan.io';
    case 324: return 'https://explorer.zksync.io';
    case 204: return 'https://opbnb.bscscan.com';
    default: return 'https://bscscan.com';
  }
};

function Card({ token, spender, date, txid, allowance, chainId, onRevokeSuccess, searchedAddress }) {
  const { address, isConnected } = useAccount();
  const currentChainId = useChainId();
  const { writeContract, isLoading: isWritePending, data: writeData } = useWriteContract();
  const [isRevoking, setIsRevoking] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const { data: transactionReceipt, isLoading: isWaiting } = useWaitForTransactionReceipt({
    hash: transactionHash,
  })
  const [error, setError] = useState(null);

  const shortenAddress = (address) => `${address.substring(0, 5)}...${address.substring(address.length - 3)}`;

  const resetRevokingState = useCallback(() => {
    setIsRevoking(false);
    setError(null);
    setTransactionHash(null);
  }, []);

  useEffect(() => {
    if (writeData) {
      setTransactionHash(writeData);
    }
  }, [writeData]);

  useEffect(() => {
    if (transactionReceipt && !isWaiting) {
      onRevokeSuccess(token.address, spender);
      resetRevokingState();
    }
  }, [transactionReceipt, isWaiting, token.address, spender, onRevokeSuccess, resetRevokingState]);

  const handleRevoke = async (tokenAddress, spender) => {
    setError(null);
    if (!isConnected) {
      setError("Wallet not connected");
      return;
    }

    if (currentChainId !== Number(chainId)) {
      setError("Wrong network selected");
      return;
    }

    try {
      setIsRevoking(true);

      await writeContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'approve',
        args: [spender, BigInt(0)],
      });

    } catch (error) {
      setError("Failed to revoke. Please try again.");
      resetRevokingState();
    }
  };

  const isButtonDisabled = currentChainId !== Number(chainId) || isRevoking || isWritePending;
  const showSpinner = isRevoking || isWritePending;
  return (
    <Box p="3" shadow="md" borderWidth="1px" borderRadius="md" maxW="250px" mx="auto">
      <VStack align="start" spacing="3">
        <HStack justify="space-between" width="100%">
          <HStack spacing="3" align="center">
            <Image
              boxSize="clamp(24px, 4vw, 32px)"
              objectFit="cover"
              src={token.icon}
              borderRadius="full"
            />
            <Box overflow="hidden" display="flex" alignItems="center" height="clamp(32px, 4vw, 42px)">
              <Text
                fontSize="clamp(13px, 2vw, 18px)"
                fontWeight="bold"
                overflow="hidden"
              >
                {token.name}
              </Text>
            </Box>
          </HStack>

          {isConnected && address?.toLowerCase() === searchedAddress.toLowerCase() && (
            <Button
              onClick={() => handleRevoke(token.address, spender)}
              variant="iconxs"
              size="xs"
              isDisabled={isButtonDisabled}
            >
              {showSpinner ? <Spinner size="xs" /> : <Icon as={DeleteIcon} className="white" />}
            </Button>
          )}
        </HStack>

        {error && <Text color="red.500" fontSize="sm">{error}</Text>}

        <HStack align="start" width="100%">
          <Grid templateColumns="auto auto" alignItems="start" gap="1">
            <Text fontSize="clamp(11px, 1.5vw, 15px)" textAlign="right">Token:</Text>
            <Link fontSize="clamp(11px, 1.5vw, 15px)" href={`${getExplorerUrl(chainId)}/token/${token.address}`} isExternal>{shortenAddress(token.address)}</Link>
            <Text fontSize="clamp(11px, 1.5vw, 15px)" textAlign="right">Spender:</Text>
            <Link fontSize="clamp(11px, 1.5vw, 15px)" href={`${getExplorerUrl(chainId)}/address/${spender}`} isExternal>{shortenAddress(spender)}</Link>
            <Text fontSize="clamp(11px, 1.5vw, 15px)" textAlign="right">Updated:</Text>
            <Text fontSize="clamp(11px, 1.5vw, 15px)" textAlign="left">{date}</Text>
            <Text fontSize="clamp(11px, 1.5vw, 15px)" textAlign="right">TXid:</Text>
            <Link fontSize="clamp(11px, 1.5vw, 15px)" href={`${getExplorerUrl(chainId)}/tx/${txid}`} isExternal>{shortenAddress(txid)}</Link>
            <Text fontSize="clamp(11px, 1.5vw, 15px)" textAlign="right">Allowance:</Text>
            <Text fontSize="clamp(11px, 1.5vw, 15px)" textAlign="left">{allowance}</Text>
          </Grid>
        </HStack>
      </VStack>
    </Box>
  );
}

export default Card;