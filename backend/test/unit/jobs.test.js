const { BN } = require('@openzeppelin/test-helpers');
const { assert, expect, expectRevert, withNamedArgs } = require("chai")
const { network, deployments, ethers } = require("hardhat");
const { developmentChains } = require("./../../helper-hardat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Units tests on addVoter and addProposal function", function () {
        let accounts;
        let contract;

        before(async() => {
            accounts = await ethers.getSigners()
            deployer = accounts[0]
        })
        
        // //Test addJob
        describe("addJob success", function() {  
            beforeEach(async function () {
                await deployments.fixture(["jobs"])
                contract = await ethers.getContract("Jobs")
            })
            it('should addJob if Description and Price', async function () {
                let jobadded = await contract.addJob("My veri first job", {value: 1 })
                await expect(jobadded).to.emit(
                contract,
                "jobAdded").withArgs(
                    accounts[0].address, 
                    "My veri first job",
                    1,
                    0,
                    false,
                )  
            })
            it('should NOT addJob if NO price', async function () {
                await expect(contract.addJob("My veri first job")).to.be.revertedWith("price input is mandatory and should be positive")
            })
            it('should NOT addJob if price negative', async function () {
                await expect(contract.addJob("My veri first job", {value: 0})).to.be.revertedWith("price input is mandatory and should be positive")
            })
            it('should NOT addJob if description empty', async function () {
                await expect(contract.addJob("", {value: 1})).to.be.revertedWith("at least 5 letters you lazy bastard")
            })
            it('should NOT addJob if description less than 5 letters', async function () {
                await expect(contract.addJob("Myver", {value: 1})).to.be.revertedWith("at least 5 letters you lazy bastard")
            })
        });
        describe("takeJob", function() {  
            beforeEach(async function () {
                await deployments.fixture(["jobs"])
                contract = await ethers.getContract("Jobs")
            })
            it('should Take job', async function () {
                let jobadded = await contract.addJob("My veri first job", {value: 1})
                await expect(contract.connect(accounts[1]).takeJob(0)).to.emit(
                    contract,
                    "jobTaken"
                ).withArgs(accounts[1].address, 0)
            })
            it('should NOT Take job if author = worker', async function () {
                await contract.addJob("My veri first job", {value: 1})
                await expect(contract.takeJob(0)).to.be.revertedWith("author cannot take its own job")
            })
            it('should NOT Take job if job already taken', async function () {
                await contract.addJob("My veri first job", {value: 1})
                await contract.connect(accounts[1]).takeJob(0)
                await expect(contract.connect(accounts[2]).takeJob(0)).to.be.revertedWith("job already taken")

            })
        });
        describe("setIsFinishedandpay", function() {  
            beforeEach(async function () {
                await deployments.fixture(["jobs"])
                contract = await ethers.getContract("Jobs")
            })
            it('should emit an event in everything went smooth', async function () {
                await contract.addJob("My veri first job", {value: 1})
                await contract.connect(accounts[1]).takeJob(0)
                await expect(contract.setIsFinishedAndPay(0)).to.emit(
                    contract,
                    "jobIsFinishedAndPaid"
                ).withArgs(accounts[0].address, accounts[1].address, 0, 1)
            })
            it('should NOT setIsFinishandPay if not Author', async function () {
                await contract.addJob("My veri first job", {value: 1})
                await contract.connect(accounts[1]).takeJob(0)
                await expect(contract.connect(accounts[1]).setIsFinishedAndPay(0)).to.be.revertedWith("only the author can close and pay")
                await expect(contract.connect(accounts[2]).setIsFinishedAndPay(0)).to.be.revertedWith("only the author can close and pay")
            })
            it('should NOT setIsFinishandPay if job not taken', async function () {
                await contract.addJob("My veri first job", {value: 1})
                await expect(contract.setIsFinishedAndPay(0)).to.be.revertedWith("job not taken by a worker")
            })
        });


        
        // })
        // describe("addVoter fail", function() {  
        //     beforeEach(async function () {
        //         await deployments.fixture(["voting"])
        //         vote = await ethers.getContract("Voting")
        //     })
        //     it('should NOT addVoter if incorrect WF status', async function () {
        //         await vote.startProposalsRegistering()
        //         await expect(vote.addVoter(accounts[0].address)).to.be.revertedWith('Voters registration is not open yet')
        //         await vote.endProposalsRegistering()
        //         await expect(vote.addVoter(accounts[0].address)).to.be.revertedWith('Voters registration is not open yet')
        //         await vote.startVotingSession()
        //         await expect(vote.addVoter(accounts[0].address)).to.be.revertedWith('Voters registration is not open yet')
        //         await vote.endVotingSession()
        //         await expect(vote.addVoter(accounts[0].address)).to.be.revertedWith('Voters registration is not open yet')
        //         await vote.tallyVotes()
        //         await expect(vote.addVoter(accounts[0].address)).to.be.revertedWith('Voters registration is not open yet')

        //     });
        //     it('should NOT addVoter if not the owner', async function () {
        //         await expect(vote.connect(accounts[1]).addVoter(accounts[0].address)).to.be.revertedWith("Ownable: caller is not the owner")  
        //     });
        // })
        // //Test addProposal
        // describe("addProposal fail", function() {  
        //     beforeEach(async function () {
        //         await deployments.fixture(["voting"])
        //         vote = await ethers.getContract("Voting")
        //     })
        //     it('should NOT addProposal if incorrect WF status', async function () {
        //         await vote.addVoter(accounts[0].address)
        //         await expect(vote.addProposal("Proposal 0")).to.be.revertedWith('Proposals are not allowed yet')  
        //         await vote.startProposalsRegistering()
        //         await vote.endProposalsRegistering()
        //         await expect(vote.addProposal("Proposal 0")).to.be.revertedWith('Proposals are not allowed yet')  
        //         await vote.startVotingSession()
        //         await expect(vote.addProposal("Proposal 0")).to.be.revertedWith('Proposals are not allowed yet')  
        //         await vote.endVotingSession()
        //         await expect(vote.addProposal("Proposal 0")).to.be.revertedWith('Proposals are not allowed yet')  
        //         await vote.tallyVotes()
        //         await expect(vote.addProposal("Proposal 0")).to.be.revertedWith('Proposals are not allowed yet')  

        //     });
        //     it('should NOT addProposal if not a Voter', async function () {
        //         await vote.startProposalsRegistering()
        //         await expect(vote.addProposal("Proposal 0")).to.be.revertedWith("You're not a voter")  
        //     });
        //     it('should NOT addProposal if number of proposals reached', async function () {
        //         await vote.addVoter(accounts[0].address)
        //         await vote.startProposalsRegistering()
        //         let i = 1
        //         do {
        //             i +=1
        //             await expect(vote.addProposal("Proposal 0")).to.emit(
        //                 vote,
        //                 "ProposalRegistered"
        //                 )
        //         } while (i<100)
        //         await expect(vote.addProposal("Proposal 0")).to.be.revertedWith('Maximum of proposals reached')  
        //     });
        // })
        // describe("addProposal success", function() {  
        //     beforeEach(async function () {
        //         await deployments.fixture(["voting"])
        //         vote = await ethers.getContract("Voting")
        //     })
        //     it('should emit event addProposal if Voter', async function () {
        //         await vote.addVoter(accounts[1].address)
        //         await vote.startProposalsRegistering()
        
        //         await expect(vote.connect(accounts[1]).addProposal("Proposal 0")).to.emit(
        //             vote,
        //             "ProposalRegistered"
        //             )
        //     });
        //     it('should addProposal if Voter', async function () {
        //         await vote.addVoter(accounts[1].address)
        //         await vote.startProposalsRegistering()
        //         await vote.connect(accounts[1]).addProposal("Proposal 0")
        //         let x = await vote.connect(accounts[1]).getOneProposal(1)
        //         await assert(x.description === "Proposal 0")
        //     });
        //     it('should add multiple Proposal if Voter', async function () {
        //         await vote.addVoter(accounts[1].address)
        //         await vote.startProposalsRegistering()
        //         await vote.connect(accounts[1]).addProposal("Proposal 0")
        //         await vote.connect(accounts[1]).addProposal("Proposal 1")
        //         let x = await vote.connect(accounts[1]).getOneProposal(1)
        //         let y = await vote.connect(accounts[1]).getOneProposal(2)
        //         await assert(x.description === "Proposal 0")
        //         await assert(y.description === "Proposal 1")
        //     });
        // })
        // //Test setVote
        // describe("setVote fail", function() {  
        //     beforeEach(async function () {
        //         await deployments.fixture(["voting"])
        //         vote = await ethers.getContract("Voting")
        //     })
        //     it('should NOT setVote if incorrect WF status', async function () {
        //         await vote.addVoter(accounts[0].address)
        //         await expect(vote.setVote(1)).to.be.revertedWith('Voting session havent started yet')  
        //         await vote.startProposalsRegistering()
        //         await expect(vote.setVote(1)).to.be.revertedWith('Voting session havent started yet')  
        //         await vote.endProposalsRegistering()
        //         await expect(vote.setVote(1)).to.be.revertedWith('Voting session havent started yet')  
        //         await vote.startVotingSession()
        //         await vote.endVotingSession()
        //         await expect(vote.setVote(1)).to.be.revertedWith('Voting session havent started yet')  
        //         await vote.tallyVotes()
        //         await expect(vote.setVote(1)).to.be.revertedWith('Voting session havent started yet')  
        //     });
        //     it('should NOT setVote if not a Voter', async function () {
        //         await vote.addVoter(accounts[1].address)
        //         await vote.startProposalsRegistering()
        //         await vote.connect(accounts[1]).addProposal("Proposal 0")
        //         await vote.endProposalsRegistering()
        //         await vote.startVotingSession()
        //         await expect(vote.connect(accounts[2]).setVote(1)).to.be.revertedWith("You're not a voter")  
        //     });
        //     it('should NOT setVote if already voted - same proposal vote', async function () {
        //         await vote.addVoter(accounts[1].address)
        //         await vote.startProposalsRegistering()
        //         await vote.connect(accounts[1]).addProposal("Proposal 0")
        //         await vote.endProposalsRegistering()
        //         await vote.startVotingSession()
        //         await vote.connect(accounts[1]).setVote(1)
        //         await expect(vote.connect(accounts[1]).setVote(1)).to.be.revertedWith('You have already voted') 
        //     });
        //     it('should NOT setVote if already voted - other proposal vote', async function () {
        //         await vote.addVoter(accounts[1].address)
        //         await vote.addVoter(accounts[2].address)
        //         await vote.startProposalsRegistering()
        //         await vote.connect(accounts[1]).addProposal("Proposal 0")
        //         await vote.connect(accounts[2]).addProposal("Proposal 1")
        //         await vote.endProposalsRegistering()
        //         await vote.startVotingSession()
        //         await vote.connect(accounts[1]).setVote(1)
        //         await expect(vote.connect(accounts[1]).setVote(2)).to.be.revertedWith('You have already voted') 
        //     });
        //     it('should NOT setVote if no proposal', async function () {
        //         await vote.addVoter(accounts[1].address)
        //         await vote.startProposalsRegistering()
        //         await vote.endProposalsRegistering()
        //         await vote.startVotingSession()
        //         await expect(vote.connect(accounts[1]).setVote(1)).to.be.revertedWith('Proposal not found') 
        //     });

        // })
        // describe("setVote success", function() {  
        //     beforeEach(async function () {
        //         await deployments.fixture(["voting"])
        //         vote = await ethers.getContract("Voting")
        //         await vote.addVoter(accounts[1].address)
        //         await vote.addVoter(accounts[2].address)
        //         await vote.addVoter(accounts[3].address)
        //         await vote.startProposalsRegistering()
        //         await vote.connect(accounts[1]).addProposal("Proposal 0")
        //         await vote.connect(accounts[1]).addProposal("Proposal 1")
        //         await vote.endProposalsRegistering()
        //         await vote.startVotingSession()
        //     })
        //     it('should setVote for a proposal done by someone else', async function () {
        //         await expect(vote.connect(accounts[3]).setVote(1)).to.emit(
        //             vote,
        //             "Voted"
        //         )  
        //     });
        //     it('should emit event setVote if Voter', async function () {
        //         await expect(vote.connect(accounts[1]).setVote(1)).to.emit(
        //             vote,
        //             "Voted"
        //         )  
        //     });
        //     it('should setVote even if no proposal done', async function () {
        //         await expect(vote.connect(accounts[3]).setVote(1)).to.emit(
        //             vote,
        //             "Voted"
        //         )  
        //     });
        // })
        // //Test tallyVotes
        // describe("tallyVotes fail", function() {
        //     beforeEach(async() => {
        //         await deployments.fixture(["voting"])
        //         vote = await ethers.getContract("Voting")
        //     })
        //     it('should NOT work if not votingSessionEnded', async function () {
        //         await expect(vote.tallyVotes()).to.be.revertedWith("Current status is not voting session ended")
        //     });
        //     it('should NOT work if not Owner', async function () {
        //         await vote.addVoter(accounts[1].address)
        //         await vote.startProposalsRegistering()
        //         await vote.endProposalsRegistering()
        //         await vote.startVotingSession()
        //         await vote.endVotingSession()
        //         await expect(vote.connect(accounts[1]).tallyVotes()).to.be.revertedWith("Ownable: caller is not the owner")
        //     });
        // })
        // describe ("tallyVotes special", function(){
        //     beforeEach(async function () {
        //         await deployments.fixture(["voting"])
        //         vote = await ethers.getContract("Voting")
        //     })
        //     it('if no Proposal', async function () {
        //         await vote.startProposalsRegistering()
        //         await vote.endProposalsRegistering()
        //         await vote.startVotingSession()
        //         await vote.endVotingSession()
        //         await vote.tallyVotes()
        //         await expect(await vote.winningProposalID.call()).to.be.equal(0)
        //     });
        // })
        // describe("tallyVotes success", function() {
        //     beforeEach(async function () {
        //         await deployments.fixture(["voting"])
        //         vote = await ethers.getContract("Voting")
        //         await vote.addVoter(accounts[1].address)
        //         await vote.addVoter(accounts[2].address)
        //         await vote.addVoter(accounts[3].address)
        //         await vote.startProposalsRegistering()
        //         await vote.connect(accounts[1]).addProposal("Proposal 0")
        //         await vote.connect(accounts[1]).addProposal("Proposal 1")
        //         await vote.connect(accounts[3]).addProposal("Proposal 2")
        //         await vote.connect(accounts[3]).addProposal("Proposal 3")
        //         await vote.endProposalsRegistering()
        //         await vote.startVotingSession()
        //         await vote.connect(accounts[1]).setVote(1)
        //         await vote.connect(accounts[2]).setVote(4)
        //         await vote.connect(accounts[3]).setVote(4)
        //         await vote.endVotingSession()
        //     })
        //     it('should emit an event', async function () {
        //         await expect(vote.tallyVotes()).to.emit(
        //             vote,
        //             "WorkflowStatusChange"
        //         )  
        //     });
        //     it('should return the correct Proposal', async function () {
        //         await vote.tallyVotes()
        //         let y = await vote.winningProposalID.call()
        //         await assert(y.toString() === "4")
        //     });
        // })
})