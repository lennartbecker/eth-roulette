<template>
  <div class="navbar bg-base-100 rounded-box shadow-xl">
    <div class="flex-1">
      <a class="btn btn-ghost normal-case text-xl">Roulette</a>
      <p>Bank balance: {{ contractBalance }}ETH</p>
    </div>
    <div class="navbar-end">
      <a class="btn" @click="connectWallet">Connect Metamask</a>
      {{ account }}
    </div>
  </div>
</template>

<script>
import { ethers } from "ethers";
import { storeToRefs } from "pinia";
import { useCryptoStore } from "../stores/crypto";
import { computed } from "vue";
export default {
  setup() {
    const store = useCryptoStore();
    const { account, bankBalance } = storeToRefs(store);
    const { connectWallet } = store;

    const contractBalance = computed(() => {
      const remainder = bankBalance.value.mod(1e14);
      return ethers.utils.formatEther(bankBalance.value.sub(remainder));
    });

    return {
      connectWallet,
      account,
      contractBalance,
    };
  },
};
</script>

<style scoped></style>
