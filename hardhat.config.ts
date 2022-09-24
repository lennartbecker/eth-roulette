import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    hardhat: {
      chainId: 1337,
      mining: {
        auto: true,
        interval: 5000
      }
    },
    ganache: {
      url: "http://127.0.0.1:7545",
      chainId: 1337,
      accounts: [
        `bb379616056374df7eabbd3e1c137ca7c4b5ca337633383ae1094b050fdcd1be`,
      ],
    },
  }
};

export default config;
