import { ethers } from "ethers";
import { abi } from "../../../artifacts/contracts/Casino.sol/Casino.json";
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

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
