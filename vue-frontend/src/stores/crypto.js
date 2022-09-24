import { ethers } from "ethers";
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
import { defineStore } from "pinia";
import rouletteHelper from "../helpers/rouletteHelper";
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
    gameWon: false,
    blockToWaitFor: ethers.BigNumber.from("0"),
    gameRunning: false,
    latestBlock: 0,
    latestNumber: 0,
    bankBalance: ethers.BigNumber.from("0"),
    balancePending: false,
    fetchingGameResult: false,
    resettingGame: false,
  }),
  actions: {
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
        await this.fetchBalance();
        await this.addEventListeners();
        await this.fetchGameState();
        // await this.checkRunningGame();
      } catch (error) {
        this.handleError(error);
      }
    },

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

    async getActiveField() {
      const { rouletteContract } = contractService.getContract();
      let playerBet = await rouletteContract.rougenoirBet(this.account);
      this.activeField = rouletteHelper.enumToColor(playerBet);
    },

    setLatestBlockNumber(block) {
      this.latestBlock = block;
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

    async placeRedBlackBet() {
      try {
        const { rouletteContract } = contractService.getContract();
        const betAmount = ethers.utils.parseEther(this.betAmount);
        const tx = await rouletteContract.setRougeNoir(
          rouletteHelper.getRedBlackValue(this.activeField),
          betAmount
        );
        this.gameRunning = true;
        return tx;
      } catch (error) {
        this.handleError(error);
      }
    },

    async placePleinBet() {
      console.log("Plein");
    },

    async getGameResult() {
      this.fetchingGameResult = true;
      const { rouletteContract } = contractService.getContract();
      let result = await rouletteContract.getRougeNoirResult();
      this.setNumber(result.toString());
      setTimeout(() => {
        if (
          rouletteHelper.getFieldColor(result.toString()) == this.activeField
        ) {
          toast.success(
            `Congratulations, you won! Click the button below to claim your prize!`
          );
          confetti();
          this.gameWon = true;
        } else {
          toast.error(`You lost! :( Dont forget to reset your game!`);
        }
        this.gameRunning = false;
        this.fetchBalance();
        this.fetchingGameResult = false;
      }, 5000);
    },

    async resetGame() {
      const { rouletteContract } = contractService.getContract();
      this.gameRunning = false;
      this.blockToWaitFor = ethers.BigNumber.from("0");
      this.gameWon = false;
      rouletteContract.getRougeNoirPayout().then(this.fetchBalance());
    },

    async fetchBalance() {
      try {
        const { rouletteContract } = contractService.getContract();
        this.playerBalance = await rouletteContract.playerBalance(this.account);
        this.bankBalance = await rouletteContract.contractFunds();
      } catch (error) {
        console.log(error);
      }
    },

    async fetchGameState() {
      try {
        const { rouletteContract, provider } = contractService.getContract();
        this.blockToWaitFor = await rouletteContract.gameBlockHeight(
          this.account
        );
        const currentBlock = await provider.getBlock();
        this.setLatestBlockNumber(currentBlock.number);
      } catch (error) {
        this.handleError(error);
      }
    },

    checkRunningGame() {
      if (
        this.blockToWaitFor.toNumber() >= this.latestBlock &&
        this.blockToWaitFor.toNumber() != 0
      ) {
        this.getActiveField();
        this.getGameResult();
      }
    },

    async withdraw(amount) {
      try {
        this.balancePending = true;
        const { rouletteContract } = contractService.getContract();
        await rouletteContract.withdraw(ethers.utils.parseEther(amount));
      } catch (error) {
        this.handleError(error);
      }
    },

    async deposit(amount) {
      try {
        const { signer } = contractService.getContract();
        this.balancePending = true;
        await signer.sendTransaction({
          to: contractAddress,
          value: ethers.utils.parseEther(amount),
        });
      } catch (error) {
        this.handleError(error);
      }
    },

    async addEventListeners() {
      const { rouletteContract, provider } = contractService.getContract();

      rouletteContract.on("FundsAdded", async (player, amount) => {
        await this.fetchBalance();
        const amountAsNumber = ethers.utils.formatEther(amount);
        toast.success(`Deposit of ${amountAsNumber} ETH successful!`);
        this.balancePending = false;
      });

      rouletteContract.on("FundsWithdrawn", (player, amount) => {
        this.fetchBalance();
        const amountAsNumber = ethers.utils.formatEther(amount);
        toast.success(`Withdrawal of ${amountAsNumber} ETH successful!`);
        this.balancePending = false;
      });

      rouletteContract.on("BetMade", (player, amount, bet, blockToWaitFor) => {
        console.log("bet event: wait for block ", blockToWaitFor.toString());
        toast.success("Bet transaction has been processed.");
        this.blockToWaitFor = blockToWaitFor;
      });

      rouletteContract.on("GameReset", (player) => {
        toast.success("Game has been reset");
      });

      provider.on("block", (blockNumber) => {
        this.setLatestBlockNumber(blockNumber);

        if (
          blockNumber >= this.blockToWaitFor.toNumber() &&
          this.blockToWaitFor.toNumber() != 0 &&
          this.gameRunning &&
          !this.fetchingGameResult
        ) {
          console.log(
            blockNumber,
            this.blockToWaitFor.toNumber(),
            this.gameRunning,
            this.fetchingGameResult
          );
          this.getGameResult();
        }
      });
    },

    handleError(error) {
      if (error.reason) {
        toast.error(error.reason);
      } else {
        console.log(error);
        toast.error("Something went wrong, please try again!");
      }
    },
  },
});
