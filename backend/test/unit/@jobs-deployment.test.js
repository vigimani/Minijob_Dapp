const { assert, expect, expectRevert, withNamedArgs } = require("chai")
const { network, deployments, ethers } = require("hardhat");
const { developmentChains } = require("./../../helper-hardat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("Units tests of Jobs smart contract", function () {
        let accounts;
        let vote;

        before(async() => {
            accounts = await ethers.getSigners()
            deployer = accounts[0]
        })

        describe("Deployment", function() {
            beforeEach(async function () {
                await deployments.fixture(["jobs"])
                vote = await ethers.getContract("Jobs")
            })
            it("Should deploy the smart contract", async function() {
                await deployments.fixture(["jobs"])
                vote = await ethers.getContract("Jobs")
            })
        })
    })