require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337 // Hardhat's default network ID
    }
  },
  solidity: {
    version: "0.8.24", // Specify your Solidity compiler version
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts", // Adjust this to your actual directory structure
  },
};
