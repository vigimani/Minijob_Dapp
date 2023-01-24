import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image'
import { Flex, Box, Text, HStack, Button, useColorModeValue } from '@chakra-ui/react';

export const MetamaskButton = ({bgcolormetamask})=> {
  //  const activeBg = useColorModeValue("white", "gray.700");
    return (
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            const ready = mounted && authenticationStatus !== 'loading';
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === 'authenticated');
            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  'style': {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <Button boxShadow="dark-lg" bg={bgcolormetamask} onClick={openConnectModal} >

                        <Flex direction="column" p="2" alignItems="center" width="100%">
                        <HStack p="0.5">
                            <Image
                                src="/metamask-fox.svg"
                                width={30}
                                height={31}
                                alt="metamask"
                            />
                            <Text>Connect</Text>
                            </HStack>
                        </Flex>
                        </Button>
                    );

                  }
    
                  if (chain.unsupported) {
                    return (
                      <button onClick={openChainModal} type="button">
                        Wrong network
                      </button>
                    );
                  }
    
                  return (
                    <Button boxShadow="dark-lg" bg={bgcolormetamask}>
                  <button
                    onClick={openChainModal}
                    style={{ display: 'flex', alignItems: 'center' }}
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,             
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>
                  <button onClick={openAccountModal} type="button">
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ''}
                  </button>
                </Button>

              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

// export const MetamaskButton = ()=> {
//     return(
//         <ConnectButton />
//     )
// }