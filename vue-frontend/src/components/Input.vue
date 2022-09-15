<template>
  <input
    type="number"
    placeholder="Your set amount"
    class="input w-full max-w-xs mt-2"
    v-model="amount"
  />
</template>

<script>
import { ref } from "vue";
// import { storeToRefs } from "pinia";
import { useCryptoStore } from "../stores/crypto";

export default {
  setup() {
    const { makeRedBlackBet } = useCryptoStore();
    const amount = ref(null)

    return {
      makeRedBlackBet,
      amount
    };
  },
};
</script>

<style scoped>
.btn-red {
  background-color: red;
}
.btn-black {
  background-color: black;
}
</style>
