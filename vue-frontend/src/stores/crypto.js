//Balance verwaltung, ich möchte hinkriegen dass deposit & withdraw reibungslos funktioniert & korrekt updated

import { ethers } from "ethers";
import { abi } from "../../../artifacts/contracts/Casino.sol/Casino.json";
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
import { defineStore } from "pinia";
import { ref } from "vue";
import enumHelper from "../helpers/enumHelper";

//GAMEMODES: Plein; Red & Black; Even & Odd; Low or High;

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
  }),
  actions: {
    setField(field) {
      this.activeField = field;
      this.setGameMode(field);
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

        console.log("Connected: ", myAccounts[0]);
        this.account = myAccounts[0];
        this.getBalance();
      } catch (error) {
        console.log(error);
      }
    },

    async placeRedBlackBet() {
      try {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const rouletteContract = new ethers.Contract(
          contractAddress,
          abi,
          signer
        );
        const betAmount = ethers.utils.parseEther(this.betAmount.toString());
        console.log("value;", enumHelper.getRedBlackValue(this.activeField));
        const tx = await rouletteContract.setRougeNoir(
          enumHelper.getRedBlackValue(this.activeField),
          {
            value: betAmount,
          }
        );
      } catch (error) {
        console.log(error);
      }
    },

    async placePleinBet() {
      console.log("Plein");
    },

    async getBalance() {
      try {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const rouletteContract = new ethers.Contract(
          contractAddress,
          abi,
          signer
        );
        this.playerBalance = await rouletteContract.playerBalance(this.account);
        console.log(this.playerBalance.toString());
      } catch (error) {
        console.log(error);
      }
    },

    async withdraw(amount) {
      console.log(ethers.utils.parseEther(amount));
      try {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const rouletteContract = new ethers.Contract(
          contractAddress,
          abi,
          signer
        );
        await rouletteContract.withdraw(ethers.utils.parseEther(amount));
      } catch (error) {
        console.log(error);
      }
    },

    async deposit(amount) {
      try {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const rouletteContract = new ethers.Contract(
          contractAddress,
          abi,
          signer
        );
        return await signer.sendTransaction({
          to: contractAddress,
          value: ethers.utils.parseEther(amount),
        });
      } catch (error) {
        return error;
      }
    },

    async placeBet() {
      switch (this.gameMode) {
        case gameModes.PLEIN:
          this.placePleinBet();
          break;
        case gameModes.REDNOIR:
          this.placeRedBlackBet();
          break;
        default:
          break;
      }
    },
  },
});
