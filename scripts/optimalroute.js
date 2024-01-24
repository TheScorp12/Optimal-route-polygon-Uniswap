const { AlphaRouter, SwapType } = require("@uniswap/smart-order-router");
const {
  Token,
  CurrencyAmount,
  TradeType,
  Percent,
} = require("@uniswap/sdk-core");
const { ethers, BigNumber } = require("ethers");
const { JSBI, BigInt } = require("jsbi");
const ERC20ABI = require("../abi.json");


//Default hardhat addresses
const WALLET_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const WALLET_SECRET = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
//for polygon local fork
const Provider = new ethers.JsonRpcProvider(
  "http://127.0.0.1:8545/"
);
const chainId = 137; //for polygon
const router = new AlphaRouter({ chainId: chainId, provider: Provider });

//Token info on polygon
const nameUSDC = "USD Coin";
const symbolUSDC = "USDC";
const decimalsUSDC = 6;
const addressUSDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";

const nameUSDT = "Tether USD";
const symbolUSDT = "USDT";
const decimalsUSDT = 6;
const addressUSDT = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";

const USDC = new Token(
  chainId,
  addressUSDC,
  decimalsUSDC,
  symbolUSDC,
  nameUSDC
);
const USDT = new Token(
  chainId,
  addressUSDT,
  decimalsUSDT,
  symbolUSDT,
  nameUSDT
);

const wei = ethers.utils.parseUnits("10", 6);
const outputAmount = CurrencyAmount.fromRawAmount(USDC, BigInt(wei));
const V3_SWAP_ROUTER_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";
async function main() {
    const wallet = new ethers.Wallet(WALLET_SECRET);
    const connectedWallet = wallet.connect(Provider);
    //check balances before swap
    const contract1 = new ethers.Contract(addressUSDT,ERC20ABI, Provider)
    const balanceUSDT = await contract1.connect(connectedWallet).balanceOf(WALLET_ADDRESS);
    var USDTbalance = ethers.utils.formatUnits(balanceUSDT,6)
    console.log(`balance of USDC is: ${USDTbalance}`);
    const contract0 = new ethers.Contract(addressUSDC, ERC20ABI, Provider);
    const balanceUSDC = await contract0.connect(connectedWallet).balanceOf(WALLET_ADDRESS);
    var USDCbalance = ethers.utils.formatUnits(balanceUSDC,6)
    console.log(`balance of USDC is: ${USDCbalance}`);

//getting optimal route quotes
  var route = await router.route(outputAmount, USDT, TradeType.EXACT_INPUT, {
    type: SwapType.SWAP_ROUTER_02,
    recipient: WALLET_ADDRESS,
    slippageTolerance: new Percent(50, 100),
    deadline: Math.floor(Date.now() / 1000 + 1800),
  });
  console.log(`amount is: ${route.quote.toFixed(6)}`);

  const transaction = {
    data: route.methodParameters.calldata,
    to: route.methodParameters.to,
    value: route.methodParameters.value,
    from: WALLET_ADDRESS,
    gasPrice: BigNumber.from(route.gasPriceWei),
    gasLimit: ethers.utils.hexlify(150000000),
  };
//send transaction
  const approvalAmount = ethers.utils.parseUnits("30", 6).toString();

   await contract0.connect(connectedWallet).approve(
    route.methodParameters.to, 
    approvalAmount, 
    {
    gasLimit: ethers.utils.hexlify(150000000),
    });
  const tradeTransaction = await connectedWallet.sendTransaction(transaction);
//console.log(tradeTransaction)

  // Check balances after swap
  const newbalanceUSDC = await contract0
    .connect(connectedWallet)
    .balanceOf(WALLET_ADDRESS);
  USDCbalance = ethers.utils.formatUnits(newbalanceUSDC,6)
  console.log(`New balance of USDC is: ${USDCbalance}`);
  const newbalanceUSDT = await contract1.connect(connectedWallet).balanceOf(WALLET_ADDRESS);
  USDTbalance = ethers.utils.formatUnits(newbalanceUSDT,6)
  console.log(`New balance of USDT is: ${USDTbalance}`);
}

main();
