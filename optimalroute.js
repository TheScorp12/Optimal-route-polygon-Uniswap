const { AlphaRouter, SwapType} = require('@uniswap/smart-order-router')
const { Token, CurrencyAmount, TradeType, Percent } = require('@uniswap/sdk-core')
const { ethers, BigNumber } = require('ethers')
const {JSBI , BigInt} = require('jsbi')

const WALLET_ADDRESS = ''
const WALLET_SECRET = ''
//for polygon local fork
const Provider = new ethers.providers.WebSocketProvider('http://127.0.0.1:8545/')
const chainId = 137 //for polygon
const router = new AlphaRouter({ chainId: chainId, provider: Provider})
const nameUSDC = 'USD Coin'
const symbolUSDC = 'USDC'
const decimalsUSDC = 18
const addressUSDC = '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359'

const nameUSDT = 'Tether USD'
const symbolUSDT = 'USDT'
const decimalsUSDT = 6
const addressUSDT = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F' 

const USDC = new Token(chainId, addressUSDC,decimalsUSDC, symbolUSDC, nameUSDC)
const USDT = new Token(chainId, addressUSDT, decimalsUSDT, symbolUSDT, nameUSDT)

const wei = ethers.utils.parseUnits('5', 6)
const outputAmount = CurrencyAmount.fromRawAmount(USDT, BigInt(wei))
const V3_SWAP_ROUTER_ADDRESS = '0xE592427A0AEce92De3Edee1F18E0157C05861564'
async function main() {
  var route = await router.route(
    outputAmount,
    USDC,
    TradeType.EXACT_OUTPUT,
    {
      type: SwapType.SWAP_ROUTER_02,
      recipient: WALLET_ADDRESS,
      slippageTolerance: new Percent(50, 100),
      deadline: Math.floor(Date.now()/1000 + 1800),
      gasLimit:150000000,
    }
  )
  console.log(`amount is: ${route.quote.toFixed(6)}`)

  const transaction = {
    data: route.methodParameters.calldata,
    to: V3_SWAP_ROUTER_ADDRESS,
    value: BigNumber.from(route.methodParameters.value),
    from: WALLET_ADDRESS,
    gasPrice: BigNumber.from(route.gasPriceWei),
    gasLimit: ethers.utils.hexlify(15000000)
  }

  const wallet = new ethers.Wallet(WALLET_SECRET)
  const connectedWallet = wallet.connect(Provider)

  const approvalAmount = ethers.utils.parseUnits('1', 18).toString()
  const ERC20ABI = require('./abi.json')
  const contract0 = new ethers.Contract(addressUSDC, ERC20ABI, Provider)
  await contract0.connect(connectedWallet).approve(
    V3_SWAP_ROUTER_ADDRESS,
    approvalAmount
  )

  const tradeTransaction = await connectedWallet.sendTransaction(transaction)
  console.log(tradeTransaction);
}

main()