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
        Casino.connect(otherAccount).setRedBlack(playerBet, betAmount)
      ).to.be.revertedWithPanic("0x21");
    });

    it("Should set correct player game values", async function () {
      const { Casino, otherAccount } = await loadFixture(deployCasinoFixture);
      const betAmount = ethers.utils.parseEther("1.0");
      const playerBet = 1;
      const tx = await Casino.connect(otherAccount).setRedBlack(
        playerBet,
        betAmount
      );
      expect(await Casino.redBlackAmount(otherAccount.address)).to.equal(
        betAmount
      );
      expect(await Casino.redblackBet(otherAccount.address)).to.equal(
        playerBet
      );
    });

    it("Should revert when block doesnt exist yet", async function () {
      const { Casino, otherAccount } = await loadFixture(deployCasinoFixture);
      const betAmount = ethers.utils.parseEther("1.0");
      const playerBet = 1;
      const tx = await Casino.connect(otherAccount).setRedBlack(
        playerBet,
        betAmount
      );
      await expect(
        Casino.connect(otherAccount).getRedBlackPayout()
      ).to.be.revertedWith("Please make a bet first");
    });

    it("Should work after block was mined", async function () {
      const { Casino, otherAccount } = await loadFixture(deployCasinoFixture);
      const betAmount = ethers.utils.parseEther("1.0");
      const playerBet = 1;
      const tx = await Casino.connect(otherAccount).setRedBlack(
        playerBet,
        betAmount
      );
      mine(1);
      await expect(Casino.connect(otherAccount).getRedBlackPayout()).to.not.be
        .reverted;
    });

    it("Should reset player blockheight", async function () {
      const { Casino, otherAccount } = await loadFixture(deployCasinoFixture);
      const betAmount = ethers.utils.parseEther("1.0");
      const playerBet = 1;
      const tx = await Casino.connect(otherAccount).setRedBlack(
        playerBet,
        betAmount
      );
      mine(1);
      await Casino.connect(otherAccount).getRedBlackPayout();
      const blockHeight = await Casino.connect(
        otherAccount
      ).redBlackBlockHeight(otherAccount.address);
      await expect(blockHeight).to.equal(0);
      await expect(
        await Casino.connect(otherAccount).setRedBlack(playerBet, betAmount)
      ).to.not.be.reverted;
    });

    // it("Should have correct game results", async function () {
    //   const { Casino, otherAccount } = await loadFixture(deployCasinoFixture);
    //   const betAmount = ethers.utils.parseEther("0.01");
    //   const playerBet = 1;
    //   const gameResults = [];
    //   for (let index = 0; index < 1000; index++) {
    //     const tx = await Casino.connect(otherAccount).setRedBlack(
    //       playerBet,
    //       betAmount
    //     );
    //     mine(2);
    //     let result = await Casino.connect(otherAccount).getGameResult(0);
    //     gameResults.push(result.toString());
    //     await Casino.connect(otherAccount).getRedBlackPayout();
    //   }

    //   const gameDistribution = {};
    //   gameResults.forEach(result => {
    //     if (gameDistribution[result]) {
    //       gameDistribution[result] += 1;
    //     } else {
    //       gameDistribution[result] = 1;
    //     }
    //   })
    //   console.log(gameDistribution)

    // });

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

  describe("Plein game", function () {
    it("Should set correct player plein values", async function () {
      const { Casino, otherAccount } = await loadFixture(deployCasinoFixture);
      const betAmount = ethers.utils.parseEther("0.1");
      const playerBet = 25;
      const tx = await Casino.connect(otherAccount).setPleinBet(
        playerBet,
        betAmount
      );
      expect(await Casino.pleinBetAmount(otherAccount.address)).to.equal(
        betAmount
      );
      expect(await Casino.pleinBet(otherAccount.address)).to.equal(playerBet);
    });

    // it("Should revert if contract balance is too low", async function () {
    //   const { Casino, otherAccount } = await loadFixture(deployCasinoFixture);
    //   const betAmount = ethers.utils.parseEther("1");
    //   const playerBet = 25;

    //   await expect(
    //     Casino.connect(otherAccount).setPleinBet(playerBet, betAmount)
    //   ).to.be.revertedWith("Bet amount is too high");

    //   await expect(
    //     Casino.connect(otherAccount).setRedBlack(playerBet, betAmount)
    //   ).to.be.revertedWith("Bet amount is too high");
    // });
  });
});
