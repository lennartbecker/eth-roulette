<template>
  <!-- <div class="stat p-0">
    <div class="stat-title">Latest block</div>
    <div class="stat-value">{{ latestBlock }}</div>
  </div>
  <div class="stat p-0" v-if="resultBlock">
    <div class="stat-title">Result available on block</div>
    <div class="stat-value">{{ blockToWaitFor.toString() }}</div>
  </div> -->
  <div class="gamestatus flex" v-if="gameRunning">
    <Spinner />
    <span>Waiting for result</span>
  </div>
  <button class="btn" @click="resetGame" v-if="gameFinished">
    {{ resetOrClaim }}
  </button>
</template>

<script>
import { useCryptoStore } from "../stores/crypto";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import Spinner from "./Spinner.vue";

export default {
  setup() {
    const { latestBlock, blockToWaitFor, gameWon, gameRunning } = storeToRefs(
      useCryptoStore()
    );
    const { resetGame, getGameResult } = useCryptoStore();
    const resultBlock = computed(() => {
      return blockToWaitFor.value.toString != "0" && gameRunning.value;
    });
    const resetOrClaim = computed(() => {
      return gameWon.value ? "Claim win" : "Reset game";
    });
    const gameFinished = computed(() => {
      return blockToWaitFor.value.toString() != "0" && !gameRunning.value;
    });
    return {
      latestBlock,
      blockToWaitFor,
      resultBlock,
      gameFinished,
      gameRunning,
      resetOrClaim,
      resetGame,
      getGameResult,
    };
  },
  components: { Spinner },
};
</script>
