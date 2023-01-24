import {
  Image,
  Flex,
  Text,
  Box,
  HStack,
  Stack,
  Switch,
  Button,
  useColorModeValue,
  useColorMode,
  IconButton,
  colorMode,
} from "@chakra-ui/react";
import { MetamaskButton } from "../Utils/MetamaskButton";
import Link from "next/link";
import { useRouter } from "next/router";
import { PhoneIcon, SunIcon, MoonIcon } from "@chakra-ui/icons";

export default function Header() {
  const router = useRouter();

  const { colorMode, toggleColorMode } = useColorMode();
  const activeBg = useColorModeValue("white", "gray.700");
  const inactiveBg = useColorModeValue("red", "gray.700");
  // const activeColor = useColorModeValue("gray.700", "white");
  // const inactiveColor = useColorModeValue("gray.400", "gray.400");

  const isActive = (routeName) => {
    return router.pathname === routeName;
  };
  return (
    <Flex minH="100px" justifyContent="space-between" bg="#e2e6f7">
      <Box w="350px">
        <HStack ml="20px" minH="100px">
          <Image src="/Logo_vote.svg" boxSize="30px" alt="logo" />
          <Text as="b" fontSize="xl" color="594B7E" noOfLines={1}>
            MiniJob Dapp
          </Text>
        </HStack>
      </Box>

      <Box>
        <HStack minH="100px">
          <Flex>
            <Button
              bg={isActive("/") ? "white" : "#e2e6f7"}
              justifyContent="flex-start"
              alignItems="center"
              borderRadius="15px"
              _hover={{
                color: "white",
                bg: "#9face6",
              }}
              w="100%"
              _active={{
                bg: "inherit",
                transform: "none",
                borderColor: "transparent",
              }}
              _focus={{
                boxShadow: "none",
              }}
              mr="2rem"
            >
              <Link href="/">
                <Flex>
                  <Box
                    h="30px"
                    w="30px"
                    me="12px"
                    borderRadius="10px"
                    bgColor={"#9face6"}
                  >
                    <SunIcon mt="5px" />
                  </Box>
                  <Text my="auto">Home</Text>
                </Flex>
              </Link>
            </Button>
            <Button
              justifyContent="flex-start"
              alignItems="center"
              borderRadius="15px"
              bg={isActive("/addajob") ? "white" : "#e2e6f7"}
              _hover={{
                color: "white",
                bg: "#9face6",
              }}
              w="100%"
              // _active={{
              //   bg: "inherit",
              //   transform: "none",
              //   borderColor: "transparent",
              // }}
              // _focus={{
              //   boxShadow: "none",
              // }}
              mr="2rem"
            >
              <Link href="/addajob">
                <Flex mr="2rem">
                  <Box
                    h="30px"
                    w="30px"
                    me="12px"
                    borderRadius="10px"
                    bgColor={"#9face6"}
                  >
                    <SunIcon mt="5px" />
                  </Box>
                  <Text my="auto">Add a Job</Text>
                </Flex>
              </Link>
            </Button>
          </Flex>
        </HStack>
      </Box>
      <Flex>
        <Flex h="100%" p="2" alignItems="center">
          {/* <Button
            boxShadow="dark-lg"
            onClick={toggleColorMode}
            bg={activeBg}
            // _hover={{bg:"green"}}
          >
            <HStack p="0.5">
              <MoonIcon />
              <Text></Text>
            </HStack>
          </Button> */}
          <IconButton
            aria-label="toggle theme"
            boxShadow="dark-lg"
            rounded="full"
            size="lg"
            bg={activeBg}
            onClick={toggleColorMode}
            icon={colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
          />
        </Flex>
        <Flex h="100%" p="2" alignItems="center">
          <MetamaskButton bgcolormetamask={activeBg} />
        </Flex>
      </Flex>
    </Flex>
  );
}
