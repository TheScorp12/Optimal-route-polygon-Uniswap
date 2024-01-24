require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks:{
    hardhat:{
      chainId: 137,
      blockGasLimit:150_000_000,
      forking: {
        url:'Url',
      }
    },
    localnetwork: {
      url: 'http://127.0.0.1:8545/',
      chainId: 137,
    }
  }
};
