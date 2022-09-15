<template>
  <div class="navbar bg-base-100 rounded-box shadow-xl">
    <div class="flex-1">
      <a class="btn btn-ghost normal-case text-xl">Roulette</a>
    </div>
    <div class="navbar-end">
      <a class="btn" @click="connectWallet">Connect Metamask</a>
      {{ account }}
    </div>
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useCryptoStore } from "../stores/crypto";

export default {
  setup() {
    const store = useCryptoStore();
    const { account } = storeToRefs(store);
    const { connectWallet } = store;

    return {
      connectWallet,
      account,
    };
  },
};
</script>

<style scoped></style>
