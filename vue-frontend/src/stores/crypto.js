import { ethers } from "ethers";
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
import { defineStore } from "pinia";
import rouletteHelper from "../helpers/rouletteHelper";
import { contractService } from "../service/contractService";
import { useToast } from "vue-toastification";
import confetti from "canvas-confetti";
const toast = useToast();

const gameModes = Object.freeze({
  REDBLACK: 0,
  PLEIN: 1,
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
        await this.checkRunningGame();
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
      if (!this.gameRunning) {
        if (typeof field == "number") {
          this.gameMode = gameModes.PLEIN;
        } else {
          this.gameMode = gameModes.REDBLACK;
        }
      }
    },

    // async getActiveField() {
    //   const { rouletteContract } = contractService.getContract();
    //   let playerBet = await rouletteContract.rougenoirBet(this.account);
    //   this.activeField = rouletteHelper.enumToColor(playerBet);
    // },

    setLatestBlockNumber(block) {
      this.latestBlock = block;
    },

    async placeBet() {
      console.log(this.gameMode, ":gamemode");
      switch (this.gameMode) {
        case gameModes.PLEIN:
          return this.placePleinBet();
        case gameModes.REDBLACK:
          return this.placeRedBlackBet();
        default:
          console.log("none");
          return false;
      }
    },

    async placeRedBlackBet() {
      try {
        if (this.bankBalance.gte(ethers.utils.parseEther(this.betAmount))) {
          const { rouletteContract } = contractService.getContract();
          const betAmount = ethers.utils.parseEther(this.betAmount);
          const tx = await rouletteContract.setRedBlack(
            rouletteHelper.getRedBlackValue(this.activeField),
            betAmount
          );
          this.gameRunning = true;
          return tx;
        } else {
          toast.error(`Bet is too large`);
        }
      } catch (error) {
        this.handleError(error);
      }
    },

    async placePleinBet() {
      console.log(
        this.bankBalance.gte(ethers.utils.parseEther(this.betAmount).mul(35))
      );
      try {
        if (
          this.bankBalance.gte(ethers.utils.parseEther(this.betAmount).mul(35))
        ) {
          const { rouletteContract } = contractService.getContract();
          const betAmount = ethers.utils.parseEther(this.betAmount);
          const tx = await rouletteContract.setPleinBet(
            this.activeField,
            betAmount
          );
          this.gameRunning = true;
        } else {
          toast.error(`Bet is too large`);
        }
      } catch (error) {
        this.handleError(error);
      }
    },

    async fetchGameResult() {
      try {
        this.fetchingGameResult = true;
        const { rouletteContract } = contractService.getContract();
        let result = await rouletteContract.getGameResult(this.gameMode);
        this.setNumber(result.toString());
        setTimeout(() => {
          this.handleGameResult(result);
        }, 5000);
      } catch (error) {
        this.handleError(error);
      }
    },

    async handleGameResult(result) {
      switch (this.gameMode) {
        case 0:
          this.handleRedBlackResult(result);
          break;
        case 1:
          this.handlePleinResult(result);
        default:
          break;
      }
      this.gameRunning = false;
      this.fetchingGameResult = false;
    },

    async handlePleinResult(result) {
      if (result.toString() == this.activeField) {
        this.handleWin();
      } else {
        this.handleLoss();
      }
    },

    async handleRedBlackResult(result) {
      if (rouletteHelper.getFieldColor(result.toString()) == this.activeField) {
        this.handleWin();
      } else {
        this.handleLoss();
      }
    },

    async handleLoss() {
      toast.error(`You lost! :( Dont forget to reset your game!`);
      this.fetchBalance();
    },

    async handleWin() {
      toast.success(
        `Congratulations, you won! Click the button below to claim your prize!`
      );
      confetti();
      this.gameWon = true;
    },

    async resetGame() {
      const { rouletteContract } = contractService.getContract();
      console.log("Resetting game")
      if (this.gameMode == 0) {
        await rouletteContract.getRedBlackPayout();
      } else if (this.gameMode == 1) {
        await rouletteContract.getPleinPayout();
      }
      this.resettingGame = true;
    },

    async fetchBalance() {
      try {
        const { rouletteContract } = contractService.getContract();
        this.playerBalance = await rouletteContract.playerBalance(this.account);
        this.bankBalance = await rouletteContract.getContractFunds();
      } catch (error) {
        console.log(error);
      }
    },

    async fetchGameState() {
      try {
        const { rouletteContract, provider } = contractService.getContract();
        const currentBlock = await provider.getBlock();
        this.setLatestBlockNumber(currentBlock.number);        
      } catch (error) {
        this.handleError(error);
      }
    },

    checkRunningGame() {
      // if (
      //   this.blockToWaitFor.toNumber() >= this.latestBlock &&
      //   this.blockToWaitFor.toNumber() != 0
      // ) {
      //   this.getActiveField();
      //   this.fetchGameResult();
      // }
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

      const fundsAddedEvent = rouletteContract.filters.FundsAdded(
        this.account,
        null
      );

      const fundsWithdrawnEvent = rouletteContract.filters.FundsWithdrawn(
        this.account,
        null
      );

      const betMadeEvent = rouletteContract.filters.BetMade(
        this.account,
        null,
        null,
        null
      );

      const gameResetEvent = rouletteContract.filters.GameReset(this.account);

      rouletteContract.on(fundsAddedEvent, async (player, amount) => {
        await this.fetchBalance();
        const amountAsNumber = ethers.utils.formatEther(amount);
        toast.success(`Deposit of ${amountAsNumber} ETH successful!`);
        this.balancePending = false;
      });

      rouletteContract.on(fundsWithdrawnEvent, (player, amount) => {
        this.fetchBalance();
        const amountAsNumber = ethers.utils.formatEther(amount);
        toast.success(`Withdrawal of ${amountAsNumber} ETH successful!`);
        this.balancePending = false;
      });

      rouletteContract.on(
        betMadeEvent,
        (player, amount, blockToWaitFor, gamemode) => {
          console.log("bet event: wait for block ", blockToWaitFor.toString());
          toast.success("Bet transaction has been processed.");
          this.blockToWaitFor = blockToWaitFor;
          this.fetchBalance();
        }
      );

      rouletteContract.on(gameResetEvent, (player) => {
        toast.success("Game has been reset");
        this.resettingGame = false;
        this.gameWon = false;
        this.gameRunning = false;
        this.blockToWaitFor = ethers.BigNumber.from("0");
        this.fetchBalance();
      });

      provider.on("block", async (blockNumber) => {
        this.setLatestBlockNumber(blockNumber);
        console.log("new block:", blockNumber);

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
          await this.fetchGameResult();
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
