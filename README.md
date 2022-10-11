# ETH Roulette

This is a simple Roulette dApp where you can bet on either Red / Black or a specific number.
<p align="center">
  <img src="./demo.gif" height="80%" width="80%">
</p>

Test out the live version [here](https://roulette.lennart.cc)

Check out a demo video [here](https://vimeo.com/759245429)

🚨 Notice: The random number generation is done using the hash of the next block, so it isn't very secure and should not be used with real funds!


## Technologies used
- Hardhat
- Ethers.js
- Vue 3

## Installation


Clone the repository

`npm install`

In another terminal run 

`npx hardhat node` 

and leave it running

Then run

`npx hardhat run scripts/deployCasino.ts --network localhost`

change into the frontend

`cd vue-frontend`

and run

`npm install`

After that simply run

`npm run dev`

And verify Metamask is connected to your local hardhat node


## Licensing
ETH Roulette is released under the terms of the MIT license. For more information, see https://opensource.org/licenses/MIT.

