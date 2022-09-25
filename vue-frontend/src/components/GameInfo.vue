<template>
  <!-- <div class="stat p-0">
    <div class="stat-title">Latest block</div>
    <div class="stat-value">{{ latestBlock }}</div>
  </div>
  <div class="stat p-0" v-if="resultBlock">
    <div class="stat-title">Result available on block</div>
    <div class="stat-value">{{ blockToWaitFor.toString() }}</div>
  </div> -->
  <div
    class="gamestatus flex"
    v-if="gameRunning"
  >
    <Spinner />
    <span>Waiting for next block, please be patient!</span>
  </div>
  <button class="btn relative" @click="resetGame" v-if="gameFinished"     :class="{ resetting: resettingGame }">
    {{ resetOrClaim }}
    <div v-if="resettingGame" class="reset-spinner text-white">
      <Spinner />
    </div>
  </button>
</template>

<script>
import { useCryptoStore } from "../stores/crypto";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import Spinner from "./Spinner.vue";

export default {
  setup() {
    const { latestBlock, blockToWaitFor, gameWon, gameRunning, resettingGame } =
      storeToRefs(useCryptoStore());
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
      resettingGame,
      resetGame,
      getGameResult,
    };
  },
  components: { Spinner, Spinner },
};
</script>
<style lang="scss">
.resetting {
  &::before {
    position: absolute;
    left: 0px;
    top: 0px;
    height: 100%;
    width: 100%;
    content: "";
    background-color: rgba(0, 0, 0, 0.6);
  }
  .reset-spinner {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
