import { ethers } from "hardhat";

async function main() {
  const initialFunding = ethers.utils.parseEther("10");

  const Casino = await ethers.getContractFactory("Casino");
  const deployedCasino = await Casino.deploy({ value: initialFunding });

  await deployedCasino.deployed();

  console.log(`Casino with 10 ETH deployed to ${deployedCasino.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
