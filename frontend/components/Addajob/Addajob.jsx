import {
  Heading,
  Flex,
  Text,
  Input,
  InputGroup,
  InputRightAddon,
  Textarea,
  Button,
  useToast,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import Contract from "./../../../backend/artifacts/contracts/Jobs.sol/Jobs";
import { useAccount, useProvider, useSigner, useContractRead } from "wagmi";
import { ethers } from "ethers";

export default function Addajob() {
  //WAGMI
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const { data: signer } = useSigner();
  const [desc, setDesc] = useState();
  const [price, setPrice] = useState();
  const [isLoading, setIsLoading] = useState(false);

  //CHAKRA
  const toast = useToast();

  const addAJob = async () => {
    setIsLoading(true);
    try {
      let contract = await new ethers.Contract(
        contractAddress,
        Contract.abi,
        signer
      );
      let transaction = await contract.addJob(desc, {
        value: ethers.utils.parseEther(price),
      });
      await transaction.wait(1);
      toast({
        title: "Congratulations!",
        description: "Your have added a new job",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch {
      toast({
        title: "Error",
        description: "An error occured, please try again...",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };

  return (
    <>
        <Flex direction="column" alignItems="center" w="100%">
        <Heading>Add a Job</Heading>
        <Flex width="75%">
            <Flex mt="5rem" direction="column" width="100%">
            <Text textAlign={"left"}>Description</Text>
            <Textarea
                height="50px"
                mt="1rem"
                placeholder="The description of the job"
                onChange={(e) => setDesc(e.target.value)}
            ></Textarea>
            </Flex>
            <Flex ml="5rem" mt="5rem" direction="column" width="100%">
            <Text>Price</Text>
            <InputGroup>
                <Input
                mt="1rem"
                placeholder="Amount in ETH to pay the worker"
                onChange={(e) => setPrice(e.target.value)}
                ></Input>
                <InputRightAddon mt="1rem" children="ETH" />
            </InputGroup>
            </Flex>
        </Flex>
        <Flex mt="2rem" width="75%">
            {!isLoading ? (
            <Button
                rightIcon={<ArrowForwardIcon />}
                borderColor="#9Face6"
                textColor={"#9face6"}
                variant="outline"
                width="100%"
                onClick={() => addAJob()}
            >
                Add this job
            </Button>
            ) : (
            <Button
                isLoading
                loadingText="Submitting"
                borderColor="#9Face6"
                textColor={"#9face6"}
                variant="outline"
                width="100%"
            >
                Submitting
            </Button>
            )}
        </Flex>
        </Flex>
    </>
  );
}
