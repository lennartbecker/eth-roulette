<template>
  <div class="flex gap-2">
    <input
      type="text"
      placeholder="Enter amount"
      class="input input-bordered input-md w-full max-w-xs w-2/3"
      v-model="betAmount"
    />
    <button class="btn w-1/3" @click="makeRedBlackBet">Place bet</button>
  </div>
</template>

<script>
import { useCryptoStore } from "../stores/crypto";
import { storeToRefs } from "pinia";

export default {
  setup() {
    const { betAmount } = storeToRefs(useCryptoStore());
    const { makeRedBlackBet } = useCryptoStore();
    return {
      betAmount,
      makeRedBlackBet
    };
  },
};
</script>
