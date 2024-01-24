require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks:{
    hardhat:{
      chainId: 137,
      blockGasLimit:150_000_000,
      forking: {
        url:'https://polygon-mainnet.infura.io/v3/bcf6db5c958846aebf5c48528757ee80',
      }
    },
    localnetwork: {
      url: 'http://127.0.0.1:8545/',
      chainId: 137,
    }
  }
};
