import { ethers } from "ethers";
import { abi } from "../../../artifacts/contracts/Casino.sol/Casino.json";
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
import { defineStore } from "pinia";
import { ref } from "vue";
import enumHelper  from "../helpers/enumHelper";

export const useCryptoStore = defineStore("crypto", () => {
  const account = ref(null);
  async function connectWallet() {
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
      account.value = myAccounts[0];
    } catch (error) {
      console.log(error);
    }
  }

  async function makeRedBlackBet(color, amount) {
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const rouletteContract = new ethers.Contract(
        contractAddress,
        abi,
        signer
      );
      const betAmount = ethers.utils.parseEther(amount.toString());
      console.log("value;", enumHelper.getRedBlackValue(color));
      const tx = await rouletteContract.setRougeNoir(enumHelper.getRedBlackValue(color), {
        value: betAmount,
      });
    } catch (error) {
      console.log(error);
    }
  }

  return { account, connectWallet, makeRedBlackBet };
});
