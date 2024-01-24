# Sample Hardhat Project

Hosts a local chain, Gets USDC from a random whale address. Finds and trades the optimal route for USDC to USDT
Update Url in hardhat configs, configured for polygon mainnet fork

To run:

```shell
npx hardhat node
npx hardhat run .\scripts\fundUSDC.js --network localnetwork
npx hardhat run .\scripts\optimalroute.js
```
