<template>
  <div class="navbar bg-base-100 shadow-xl rounded-t-none">
    <div class="flex-1">
      <a class="btn btn-ghost normal-case text-xl">Roulette</a>
      <p>Bank balance: {{ contractBalance }} ETH</p>
    </div>
    <div class="navbar-end">
      <div class="bg-dark btn cursor-default focus:none normal-case">
        Connected:
        {{ accountShortened }}
      </div>
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

    const accountShortened = computed(() => {
      return `${account.value.substring(0, 6)}...${account.value.substring(
        account.value.length - 4
      )}`;
    });

    return {
      connectWallet,
      account,
      accountShortened,
      contractBalance,
    };
  },
};
</script>

<style scoped></style>
