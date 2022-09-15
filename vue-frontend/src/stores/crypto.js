import { ethers } from "ethers";
import { abi } from "../../../artifacts/contracts/Casino.sol/Casino.json";
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
import { defineStore } from "pinia";
import { ref } from "vue";
import enumHelper from "../helpers/enumHelper";

export const useCryptoStore = defineStore("crypto", {
  state: () => ({ account: null, activeField: "", betAmount: 0 }),
  actions: {
    setField(field) {
      this.activeField = field;
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
      } catch (error) {
        console.log(error);
      }
    },

    async makeRedBlackBet() {
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
  },

  // return { account, connectWallet, makeRedBlackBet, setField, activeField };
});
