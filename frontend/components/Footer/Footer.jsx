import { Flex, Box, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Flex h="5vh" p="0rem" justifyContent="space-between" alignItems="center">
      <Box w="100%" h="10px" bgGradient="linear(to-t, #9Face6, #FFF)">
        <Flex
          h="10vh"
          p="2rem"
          justifyContent="space-between"
          alignItems="center"
        >
          <Flex h="15vh" p="2rem" justifyContent="center" alignItems="center">
            <Text>&copy; Victor {new Date().getFullYear()}</Text>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
}
