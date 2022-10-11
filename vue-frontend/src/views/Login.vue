<template>
  <img src="@/assets/wheel.png" alt="" srcset="" class="wheel" />
  <div class="h-full flex flex-col justify-center items-center">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">ETH Roulette</h2>
        <p>Please connect your Metamask Wallet</p>
        <div class="card-actions justify-end flex-nowrap">
          <label for="game-explanation" class="btn btn-ghost">How do I play?</label>
          <button class="btn btn-primary" @click="connectWallet">
            Connect Metamask
          </button>
        </div>
      </div>
    </div>
  </div>

  <input type="checkbox" id="game-explanation" class="modal-toggle" />
  <div class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">How to play</h3>
      <div class="font-bold">Make sure you're connected to the Goerli Testnet!</div>
      <p class="py-4">
        <ol class="list-decimal">
          <li>Login with your metamask account (verify you're on the correct network)</li>
          <li>Click deposit to deposit some funds into the contract</li>
          <li>After the deposit has been confirmed your balance should update</li>
          <li>Now you can select a field, enter the amount you would like to bet & click on "Place bet"</li>
          <li>After you confirmed the transaction it takes some time until the next block is availalbe, your result should be fetched automatically</li>
          <li>If you've won it's very important to book your winning funds back to your account by clicking the claim win button. Because the way Ethereum works it is only possible to access the last 256 block hashes, which means that after that it is not possible to verify if you've won or lost and in that case you're funds will be gone </li>
          <li>Even if you've lost you should reset the game state or you won't be able to play again until 256 blocks have passed</li>
        </ol>
      </p>
      <div class="modal-action">
        <label for="game-explanation" class="btn">Close</label>
      </div>
    </div>
  </div>
</template>
<script>
import { useCryptoStore } from "../stores/crypto";
export default {
  setup() {
    const store = useCryptoStore();
    const { connectWallet } = store;

    return {
      connectWallet,
    };
  },
};
</script>
<style scoped>
.wheel {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  filter: blur(10px);
  animation: rotate 30s linear infinite;
}

@keyframes rotate {
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>
