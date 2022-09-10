import { ethers } from "hardhat";


async function main() {
    const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
    const provider = new ethers.providers.JsonRpcProvider();
    const signer = new ethers.Wallet(privateKey, provider);

    const network = provider.getNetwork();
    const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3';
    const casino = await ethers.getContractFactory('Casino');
    const contract = casino.attach(contractAddress);
    
    const txReceipt = await contract.connect(signer).setRougeNoir(false, {value: ethers.utils.parseEther("2"),   gasLimit: 50000})
    console.log(txReceipt)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  