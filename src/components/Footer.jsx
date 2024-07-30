import { Box, Button, Link, HStack, Icon, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { FaTwitter, FaGithub, FaInfoCircle } from 'react-icons/fa';

function Footer() {
  const footerBg = useColorModeValue('footer.light', 'footer.dark');
  const textColor = useColorModeValue('text.light', 'text.dark');

  return (
    <Box
      bg={footerBg}
      color={textColor}
      p="4"
      height="100px"
      position="fixed"
      width="100%"
      paddingBottom="95px"
      bottom="0"
      left="0"
    >
      <HStack spacing="12px" justify="center">
        <Button as="a" href="https://github.com/JaimeDeFi/VenusRevoke" target="_blank" variant="icon">
          <Icon as={FaGithub} className="white" />
        </Button>
        <Button as="a" href="https://twitter.com/VanguardVantage" target="_blank" variant="icon">
          <Icon as={FaTwitter} className="twitter" />
        </Button>
      </HStack>
      <Flex justifyContent="center" mt={4}>
        <Text fontSize="sm">
          Made with <Text as="span" color="red.500">❤️</Text> by
          <Link href="https://vanguardvantage.io" target="_blank" variant="gradientText"> VanguardVantage</Link>
        </Text>
      </Flex>
    </Box>
  );
}

export default Footer;
