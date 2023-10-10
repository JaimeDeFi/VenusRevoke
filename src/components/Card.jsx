import React, { useState, useEffect } from 'react';
import { Box, Text, Image, Button, Icon, VStack, HStack, Grid, Link, Spinner } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useAccount, useWaitForTransaction } from 'wagmi'
import { writeContract, erc20ABI } from '@wagmi/core';

function Card({ token, spender, date, txid, allowance, chainId, onRevokeSuccess, searchedAddress }) {
  const { address } = useAccount();
  const shortenAddress = (address) => `${address.substring(0, 5)}...${address.substring(address.length - 3)}`;
  const [isRevoking, setIsRevoking] = useState(false);
  const [transactionHash, setTransactionHash] = useState(null);
  const { isSuccess } = useWaitForTransaction({ hash: transactionHash });
  useEffect(() => {
    if (isSuccess) {
      onRevokeSuccess(token.address, spender);
      setIsRevoking(false);
    }
  }, [isSuccess]);

  const handleRevoke = async (tokenAddress, spender) => {
    try {
      setIsRevoking(true);
      const { hash } = await writeContract({
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'approve',
        args: [spender, "0x0"],
        chainId: chainId
      });
      setTransactionHash(hash);
    } catch (error) {
      console.error("Error revoking token:", error);
      setIsRevoking(false);
    }
  };

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


          {address && address.toLowerCase() === searchedAddress.toLowerCase() && (
            <Button
              onClick={() => handleRevoke(token.address, spender)}
              variant="iconxs"
              size="xs"
            >
              {isRevoking ? <Spinner size="xs" /> : <Icon as={DeleteIcon} className="white" />}
            </Button>
          )}
        </HStack>
        <HStack align="start" width="100%">
          <Grid templateColumns="auto auto" alignItems="start" gap="1">
            <Text fontSize="clamp(11px, 1.5vw, 15px)" textAlign="right">Token:</Text>
            <Link fontSize="clamp(11px, 1.5vw, 15px)" href={`https://bscscan.com/token/${token.address}`} isExternal>{shortenAddress(token.address)}</Link>
            <Text fontSize="clamp(11px, 1.5vw, 15px)" textAlign="right">Spender:</Text>
            <Link fontSize="clamp(11px, 1.5vw, 15px)" href={`https://bscscan.com/address/${spender}`} isExternal>{shortenAddress(spender)}</Link>
            <Text fontSize="clamp(11px, 1.5vw, 15px)" textAlign="right">Updated:</Text>
            <Text fontSize="clamp(11px, 1.5vw, 15px)" textAlign="left">{date}</Text>
            <Text fontSize="clamp(11px, 1.5vw, 15px)" textAlign="right">TXid:</Text>
            <Link fontSize="clamp(11px, 1.5vw, 15px)" href={`https://bscscan.com/tx/${txid}`} isExternal>{shortenAddress(txid)}</Link>
            <Text fontSize="clamp(11px, 1.5vw, 15px)" textAlign="right">Allowance:</Text>
            <Text fontSize="clamp(11px, 1.5vw, 15px)" textAlign="left">{allowance}</Text>
          </Grid>
        </HStack>
      </VStack>
    </Box>
  );
}

export default Card;
