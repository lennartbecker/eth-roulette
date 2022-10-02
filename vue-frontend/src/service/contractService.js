import { ethers } from "ethers";
import { abi } from "../../../artifacts/contracts/Casino.sol/Casino.json";
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

const contractService = {
  rouletteContract: null,
  signer: null,
  getContract() {
    if (this.rouletteContract) {
      return {
        rouletteContract: this.rouletteContract,
        signer: this.signer,
        provider: this.provider,
      };
    }
    this.provider = new ethers.providers.Web3Provider(ethereum);

    this.signer = this.provider.getSigner();
    this.rouletteContract = new ethers.Contract(
      contractAddress,
      abi,
      this.signer
    );
    return {
      rouletteContract: this.rouletteContract,
      signer: this.signer,
      provider: this.provider,
    };
  },
};

export { contractService };
