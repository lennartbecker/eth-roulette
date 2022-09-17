<template>
  <div class="flex gap-2">
    <input
      type="text"
      placeholder="Enter amount"
      class="input input-bordered input-md w-full max-w-xs w-2/3"
      v-model="betAmount"
    />
    <button class="btn w-1/3" :class="betAvailable" @click="placeBetHandler">Place bet</button>
  </div>
  <div>Selected field: {{ activeField }}</div>
  <div>Gamemode: {{ gameMode }}</div>
</template>

<script>
import { useCryptoStore } from "../stores/crypto";
import { storeToRefs } from "pinia";
import { computed } from "vue";

export default {
  setup() {
    const { betAmount, activeField, gameMode } = storeToRefs(useCryptoStore());
    const { placeBet } = useCryptoStore();

    const betAvailable = computed(() => {
      return betAmount.value > 0 && activeField.value != "" ? '' : 'btn-disabled'
    });

    function placeBetHandler() {
      placeBet();
    }

    return {
      betAmount,
      placeBetHandler,
      activeField,
      gameMode,
      betAvailable
    };
  },
};
</script>
<style></style>