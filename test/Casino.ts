import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
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
      const { Casino, initialFunds, owner, otherAccount, initialPlayerFunds } =
        await loadFixture(deployCasinoFixture);

      expect(await Casino.playerBalance(owner.address)).to.equal(initialFunds);
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
  });
});
