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

    const CasinoFactory = await ethers.getContractFactory("Casino");
    const Casino = await CasinoFactory.deploy({ value: initialFunds });

    return { Casino, initialFunds, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Contract should have correct funding", async function () {
      const { Casino, initialFunds } = await loadFixture(deployCasinoFixture);

      expect(await Casino.getContractFunds()).to.equal(initialFunds)
    });
  });

  describe("Interaction", function() {
    it("Should revert when setting wrong enum", async function() {
        const { Casino, otherAccount } = await loadFixture(deployCasinoFixture);
        const betAmount = ethers.utils.parseEther("1.0");
        const playerBet = 2;
        // expect(await Casino.connect(otherAccount).setRougeNoir(playerBet, {value: betAmount})).to.be.reverted;
        await expect(Casino.connect(otherAccount).setRougeNoir(playerBet, {value: betAmount})).to.be.revertedWithPanic('0x21');
    })

    it("Should set correct player game values", async function() {
        const { Casino, otherAccount } = await loadFixture(deployCasinoFixture);
        const betAmount = ethers.utils.parseEther("1.0");
        const playerBet = 1;
        const tx = await Casino.connect(otherAccount).setRougeNoir(playerBet, {value: betAmount});
        expect(await Casino.rougenoirAmount(otherAccount.address)).to.equal(betAmount);
        expect(await Casino.rougenoirBet(otherAccount.address)).to.equal(playerBet);
    })

    it("Should revert when block doesnt exist yet", async function() {
        const { Casino, otherAccount } = await loadFixture(deployCasinoFixture);
        const betAmount = ethers.utils.parseEther("1.0");
        const playerBet = 1;
        const tx = await Casino.connect(otherAccount).setRougeNoir(playerBet, {value: betAmount});
        await expect( Casino.connect(otherAccount).getRougeNoirResult()).to.be.revertedWith('Please make a bet first');
    })

    it("Should work after block was mined", async function() {
        const { Casino, otherAccount } = await loadFixture(deployCasinoFixture);
        const betAmount = ethers.utils.parseEther("1.0");
        const playerBet = 1;
        const tx = await Casino.connect(otherAccount).setRougeNoir(playerBet, {value: betAmount});
        mine(2);
        console.log(await Casino.connect(otherAccount).getRougeNoirResult());
        console.log(await Casino.getContractFunds());
        // await expect( Casino.connect(otherAccount).getRougeNoirResult()).to.be.revertedWith('Please make a bet first');
    })


  })
});
