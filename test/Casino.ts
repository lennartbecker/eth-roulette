import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { mine } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Casino", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployCasinoFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();
    const initialFunds = ethers.utils.parseEther("10");
    const initialPlayerFunds = ethers.utils.parseEther("10");

    const CasinoFactory = await ethers.getContractFactory("Casino");
    const Casino = await CasinoFactory.deploy({ value: initialFunds });

    await otherAccount.sendTransaction({
      to: Casino.address,
      value: initialPlayerFunds,
    });

    return { Casino, initialFunds, owner, otherAccount, initialPlayerFunds };
  }

  describe("Deployment", function () {
    it("Contract should have correct funding", async function () {
      const { Casino, initialFunds, otherAccount, initialPlayerFunds } =
        await loadFixture(deployCasinoFixture);

      expect(await Casino.contractFunds()).to.equal(initialFunds);
      expect(await Casino.playerBalance(otherAccount.address)).to.equal(
        initialPlayerFunds
      );
    });
  });

  describe("Interaction", function () {
    it("Should revert when setting wrong enum", async function () {
      const { Casino, otherAccount } = await loadFixture(deployCasinoFixture);
      const betAmount = ethers.utils.parseEther("1.0");
      const playerBet = 2;
      await expect(
        Casino.connect(otherAccount).setRougeNoir(playerBet, betAmount)
      ).to.be.revertedWithPanic("0x21");
    });

    it("Should set correct player game values", async function () {
      const { Casino, otherAccount } = await loadFixture(deployCasinoFixture);
      const betAmount = ethers.utils.parseEther("1.0");
      const playerBet = 1;
      const tx = await Casino.connect(otherAccount).setRougeNoir(
        playerBet,
        betAmount
      );
      expect(await Casino.gameAmount(otherAccount.address)).to.equal(betAmount);
      expect(await Casino.rougenoirBet(otherAccount.address)).to.equal(
        playerBet
      );
    });

    it("Should revert when block doesnt exist yet", async function () {
      const { Casino, otherAccount } = await loadFixture(deployCasinoFixture);
      const betAmount = ethers.utils.parseEther("1.0");
      const playerBet = 1;
      const tx = await Casino.connect(otherAccount).setRougeNoir(
        playerBet,
        betAmount
      );
      await expect(
        Casino.connect(otherAccount).getRougeNoirPayout()
      ).to.be.revertedWith("Please make a bet first");
    });

    it("Should work after block was mined", async function () {
      const { Casino, otherAccount } = await loadFixture(deployCasinoFixture);
      const betAmount = ethers.utils.parseEther("1.0");
      const playerBet = 1;
      const tx = await Casino.connect(otherAccount).setRougeNoir(
        playerBet,
        betAmount
      );
      mine(1);
      await expect(Casino.connect(otherAccount).getRougeNoirPayout()).to.not.be
        .reverted;
    });

    it("Should reset player blockheight", async function () {
      const { Casino, otherAccount } = await loadFixture(deployCasinoFixture);
      const betAmount = ethers.utils.parseEther("1.0");
      const playerBet = 1;
      const tx = await Casino.connect(otherAccount).setRougeNoir(
        playerBet,
        betAmount
      );
      mine(1);
      await Casino.connect(otherAccount).getRougeNoirPayout();
      const blockHeight = await Casino.connect(otherAccount).gameBlockHeight(
        otherAccount.address
      );
      await expect(blockHeight).to.equal(0);
      await expect(
        await Casino.connect(otherAccount).setRougeNoir(playerBet, betAmount)
      ).to.not.be.reverted;
    });

    // it("Should return correct color values", async function () {
    //   const { Casino, otherAccount } = await loadFixture(deployCasinoFixture);
    //   const betAmount = ethers.utils.parseEther("1.0");
    //   const playerBet = 1;
    //   const numColors = [];
    //   for (let index = 0; index < 37; index++) {
    //     const numColor = await Casino.connect(otherAccount).colorValues(index);
    //     numColors.push({
    //       number: index,
    //       color: numColor ? "RED" : "BLACK",
    //     });
    //   }
    //   console.log(numColors);
    // });
  });
});
