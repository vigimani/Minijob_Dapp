import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Flex, Alert, AlertIcon } from "@chakra-ui/react";
import { useAccount } from "wagmi";

export const Layout = ({ children }) => {
  const { isConnected } = useAccount();
  return (
    <>
      <Flex direction="column" minHeight="100vh">
        <Header />
        <Flex flexGrow="1" p="2rem">
          {isConnected ? (
            <>
            {children}
            </>
          ) : (
            <Flex
              height="100%"
              width="100%"
              alignItems="center"
              justifyContent="center"
            >
              <Alert status="warning" w="auto">
                <AlertIcon />
                Connect to Metamask to use the Dapp
              </Alert>
            </Flex>
          )}
        </Flex>
        <Footer />
      </Flex>
    </>
  );
};
