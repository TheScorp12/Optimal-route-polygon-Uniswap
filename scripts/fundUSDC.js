const { network} = require("hardhat");
const hre = require("hardhat")

const fundErc20 = async (contract, sender, recepient, amount, decimals) => {
  const FUND_AMOUNT = hre.ethers.utils.parseUnits(amount, decimals);
  // fund erc20 token to the address
  const whale = await hre.ethers.getImpersonatedSigner(sender);
  const ERC20ABI = require('../abi.json')
  const contract0 = new hre.ethers.Contract(contract, ERC20ABI, whale)
  const res = await contract0.connect(whale).transfer(recepient, FUND_AMOUNT);
};

const impersonateFundErc20 = async (
  contract,
  sender,
  recepient,
  amount,
  decimals
) => {
  
  await network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [sender],
  });

  // fund baseToken to the recepient
  await fundErc20(contract, sender, recepient, amount, decimals);
  
  await network.provider.request({
    method: "hardhat_stopImpersonatingAccount",
    params: [sender],
  });
};

async function main(){
//using a whale address to get ERC20 tokens
 await impersonateFundErc20('0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174','0x443173a5440eeCB6960D6d73FD3C3D8a87E368f3','0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266','10',6)
}

main()