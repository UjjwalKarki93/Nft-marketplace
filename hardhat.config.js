require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("hardhat-deploy");
require("dotenv").config({ path: ".env" });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",

  networks: {
    bscTestnet: {
      chainId: 97,
      url: "https://bsc-testnet.public.blastapi.io",
      accounts: {
        mnemonic: process.env.mnemonic,
        initialIndex: 0,
        count: 4,
      },
    },
  },
};
