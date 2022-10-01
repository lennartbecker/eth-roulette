<template>
  <img src="@/assets/wheel.png" alt="" srcset="" class="wheel" />
  <div class="h-full flex flex-col justify-center items-center">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">ETH Roulette</h2>
        <p>Please connect your Metamask Wallet</p>
        <div class="card-actions justify-end">
          <button class="btn btn-primary" @click="connectWallet">Connect Metamask</button>
        </div>
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
