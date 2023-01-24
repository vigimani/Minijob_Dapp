import Contract from "./../../../backend/artifacts/contracts/Jobs.sol/Jobs";
import { useAccount, useProvider, useSigner, useContractRead } from "wagmi";
import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Flex,
  Text,
  CardFooter,
  Button,
  useToast,
  Alert,
  AlertIcon,
  HStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CheckCircleIcon, LockIcon, StarIcon } from "@chakra-ui/icons";
import Link from "next/link";

export default function Listjobs() {
  const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
  const { address, isConnected } = useAccount();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    updatejoblist();
  }, []);

  useEffect(() => {
    updatejoblist();
  }, [isLoading]);

  const updatejoblist = async () => {
    const contract = await new ethers.Contract(
      contractAddress,
      Contract.abi,
      provider
    );
    const filter = { address: contractAddress };
    let events = await contract.queryFilter(filter, 0);
    let allTheEvents = [],
      jobAddedEvents = [],
      jobTakenEvents = [],
      jobPaidEvents = [];
    for await (const event of events) {
      const txnReceipt = await event.getTransactionReceipt();
      let eventLog = txnReceipt.logs[0]; // could be any index
      let log = contract.interface.parseLog(eventLog); // Use the contracts interface
      allTheEvents.push(log);
      if (log.eventFragment.name === "jobAdded") {
        jobAddedEvents.push(log.args);
      } else if (log.eventFragment.name === "jobTaken") {
        jobTakenEvents.push(log.args);
      } else {
        jobPaidEvents.push(log.args);
      }
      let jobs = [];
      jobAddedEvents.forEach((jobAdded) => {
        let id = parseInt(jobAdded.id);
        //Job object
        let thisJob = {
          id: id,
          author: jobAdded.author,
          description: jobAdded.description,
          price: ethers.utils.formatEther(jobAdded.price.toString()),
          isTaken: false,
          isFinished: false,
        };
        //Is the job taken ?
        jobTakenEvents.forEach((jobTaken) => {
          if (id === parseInt(jobTaken.id)) {
            thisJob.isTaken = true;
          }
        });
        //Is the job finished ?
        jobPaidEvents.forEach((jobPaid) => {
          if (id === parseInt(jobPaid.id)) {
            thisJob.isFinished = true;
          }
        });
        jobs.push(thisJob);
      });
      setEvents(jobs);
    }
    // console.log(events[2].args.author)
  };
  const takethejob = async (id) => {
    setIsLoading(true)
    try {
    let contract = await new ethers.Contract(
      contractAddress,
      Contract.abi,
      signer
    );
    let x = await contract.takeJob(id);
    await x.wait(1)
    toast({
      title: "Congratulations!",
      description: "Your taken the job",
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
    updatejoblist
    setIsLoading(false)
  };
  const paythejob = async(id) => {
    setIsLoading(true)
    try {
      let contract = await new ethers.Contract(
        contractAddress,
        Contract.abi,
        signer
      );
      let x = await contract.setIsFinishedAndPay(id);
      await x.wait(1)
      toast({
        title: "Transaction completed!",
        description: "Your have paid for the job",
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
    updatejoblist
    setIsLoading(false)
  }

  return (
    <Flex w="100%" justifyContent="space-between" alignItems="center">
      <Flex
        width="100%"
        direction={["column", "column", "row", "row"]}
        alignItems={["center", "center", "flex-start", "flex-start"]}
        justifyContent={[]}
        flexWrap="wrap"
      >
        {events.length !== 0 ? (
          events.map((event, index) => {
            return (
              <>
                <Card
                  key={event.id}
                  minWidth={["100%", "100%", "30%", "30%"]}
                  mt="1rem"
                  ml="1%"
                  mr="1%"
                >
                  <CardBody>
                    <Flex justifyContent={"space-between"}>
                      <Flex direction="column">
                        <HStack>
                          <Text fontWeight="extrabold" fontSize="l">
                            Description :
                          </Text>
                          <Text>{event.description}</Text>
                        </HStack>
                        <HStack>
                          <Text fontWeight="extrabold" fontSize="l">
                            Author :
                          </Text>
                          <Text>
                            {event.author.substring(0, 5)}...
                            {event.author.substring(event.author.length - 4)}
                          </Text>
                        </HStack>
                        <HStack>
                          <Text fontWeight="extrabold" fontSize="l">
                            Price :
                          </Text>
                          <Text>{event.price} ETH</Text>
                        </HStack>
                      </Flex>
                      <Flex>
                        {event.author == address ? (
                          <StarIcon color="green" />
                        ) : (
                          <></>
                        )}
                      </Flex>
                    </Flex>
                  </CardBody>
                  <CardFooter>
                    {event.isFinished ? (
                      <Text color="blue" fontWeight="extrabold" fontSize="l">
                        Job is finished and paid <CheckCircleIcon/>
                      </Text>
                    ) : event.isTaken ? (
                      event.author == address ? (
                        isLoading ? (
                          <Button
                            isLoading
                            color="white"
                            bg="red.300"
                          >
                            Click me
                          </Button>
                        ) :(
                        <Button
                          color="white"
                          bg="red.300"
                          onClick={() => paythejob(event.id)}
                        >
                          Pay
                        </Button>)
                      ) : (
                        <Text
                          color="green"
                          fontWeight="extrabold"
                          fontSize="l"
                        >
                          Job is taken <LockIcon/>
                        </Text>
                      )
                    ) : event.author == address ? (
                      <Text>Job posted, not taken yet</Text>
                    ) : (
                      isLoading ? (
                      <Button
                        isLoading
                        color="white"
                        bg="green.300"
                      >
                        Work
                      </Button>) :(                      
                      <Button
                        color="white"
                        bg="green.300"
                        onClick={() => takethejob(event.id)}
                      >
                        Work
                      </Button>)
                    )}
                  </CardFooter>
                </Card>
              </>
            );
          })
        ) : (
          <Flex
          height="100%"
          width="100%"
          alignItems="center"
          justifyContent="center"
        >
          <Alert w="auto" status="warning">
            <AlertIcon />
            There is no jobs on our Dapp.
            <Link fontWeight="extrabold" href="/addajob">
              Create the first job:
            </Link>
          </Alert>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
