import { ethers } from "ethers";
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
import { defineStore } from "pinia";
import enumHelper from "../helpers/enumHelper";
import { contractService } from "../service/contractService";
import { useToast } from "vue-toastification";
import confetti from "canvas-confetti";
const toast = useToast();

const gameModes = Object.freeze({
  PLEIN: "Plein",
  REDNOIR: "RedNoir",
});

export const useCryptoStore = defineStore("crypto", {
  state: () => ({
    account: null,
    activeField: "",
    betAmount: 0,
    gameMode: null,
    playerBalance: ethers.BigNumber.from("0"),
    gameFinished: false,
    gameWon: false,
    blockToWaitFor: false,
    latestBlock: 0,
    latestNumber: 0,
  }),
  actions: {
    setField(field) {
      this.activeField = field;
      this.setGameMode(field);
    },

    setNumber(number) {
      this.latestNumber = number;
    },

    setGameMode(field) {
      if (typeof field == "number") {
        this.gameMode = gameModes.PLEIN;
      } else {
        this.gameMode = gameModes.REDNOIR;
      }
    },

    async connectWallet() {
      try {
        const { ethereum } = window;
        if (!ethereum) {
          alert("Must connect to MetaMask!");
          return;
        }
        const myAccounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        this.account = myAccounts[0];
        await this.getBalance();
        await this.addEventListeners();
        await this.getGameState();
        await this.checkRunningGame();
      } catch (error) {
        this.handleError(error);
      }
    },

    async placeRedBlackBet() {
      try {
        const { rouletteContract } = contractService.getContract();
        const betAmount = ethers.utils.parseEther(this.betAmount);
        const tx = await rouletteContract.setRougeNoir(
          enumHelper.getRedBlackValue(this.activeField),
          betAmount
        );
        return tx;
      } catch (error) {
        this.handleError(error);
      }
    },

    async placePleinBet() {
      console.log("Plein");
    },

    async addEventListeners() {
      const { rouletteContract, provider } = contractService.getContract();

      rouletteContract.on("FundsAdded", (player, amount) => {
        this.getBalance();
        const amountAsNumber = ethers.utils.formatEther(amount);
        toast.success(`Deposit of ${amountAsNumber} ETH successful!`);
      });

      rouletteContract.on("FundsWithdrawn", (player, amount) => {
        this.getBalance();
        const amountAsNumber = ethers.utils.formatEther(amount);
        toast.success(`Withdrawal of ${amountAsNumber} ETH successful!`);
      });

      rouletteContract.on("BetMade", (player, amount, bet, blockToWaitFor) => {
        console.log("bet made: wait for block", blockToWaitFor);
        this.blockToWaitFor = blockToWaitFor;
      });

      provider.on("block", async (blockNumber) => {
        console.log("new block:", blockNumber);

        if (blockNumber == this.blockToWaitFor) {
          this.getGameResult();
        }
      });
    },

    async getGameResult() {
      const { rouletteContract } = contractService.getContract();
      let result = await rouletteContract.getRougeNoirResult();
      if (result) {
        toast.success(
          `Congratulations, you won! Click the button below to claim your prize!`
        );
        confetti();
        this.gameWon = true;
      } else {
        toast.error(`You lost! :(`);
      }
      this.getBalance();
      this.gameFinished = true;
    },

    async resetGame() {
      const { rouletteContract } = contractService.getContract();
      const tx = await rouletteContract.getRougeNoirPayout();
      this.getGameState();
      this.gameFinished = false;
    },

    async getBalance() {
      try {
        const { rouletteContract } = contractService.getContract();
        this.playerBalance = await rouletteContract.playerBalance(this.account);
      } catch (error) {
        console.log(error);
      }
    },

    async getGameState() {
      try {
        const { rouletteContract, provider } = contractService.getContract();
        this.blockToWaitFor = await rouletteContract.gameBlockHeight(
          this.account
        );
        const currentBlock = await provider.getBlock();
        this.latestBlock = currentBlock.number;
      } catch (error) {
        this.handleError(error);
      }
    },

    checkRunningGame() {
      if (
        this.blockToWaitFor.toNumber() <= this.latestBlock &&
        this.blockToWaitFor.toNumber() != 0
      ) {
        console.log("Should check running game");
        this.getGameResult();
      }
    },

    async withdraw(amount) {
      try {
        const { rouletteContract } = contractService.getContract();
        await rouletteContract.withdraw(ethers.utils.parseEther(amount));
      } catch (error) {
        this.handleError(error);
      }
    },

    async deposit(amount) {
      try {
        const { signer } = contractService.getContract();
        await signer.sendTransaction({
          to: contractAddress,
          value: ethers.utils.parseEther(amount),
        });
      } catch (error) {
        this.handleError(error);
      }
    },

    async placeBet() {
      switch (this.gameMode) {
        case gameModes.PLEIN:
          return this.placePleinBet();
        case gameModes.REDNOIR:
          return this.placeRedBlackBet();
        default:
          return false;
      }
    },

    handleError(error) {
      if (error.reason) {
        toast.error(error.reason);
      } else {
        toast.error("Something went wrong, please try again!");
      }
    },
  },
});
