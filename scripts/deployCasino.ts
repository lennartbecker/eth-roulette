import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const initialFunding = ethers.utils.parseEther("1");

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Casino = await ethers.getContractFactory("Casino");
  const deployedCasino = await Casino.deploy({ value: initialFunding });


  console.log("Casino address:", deployedCasino.address);
  await deployedCasino.deployed();

  console.log(`Casino with 0.01 ETH deployed to ${deployedCasino.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
