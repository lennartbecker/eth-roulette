<template>
  <Navbar />

  <div class="flex flex-row p-4" v-if="account">
    <div class="cylinder w-1/3">
      <Wheel />
    </div>
    <div class="game-wrapper w-1/3 flex justify-center">
      <Board />
    </div>
    <div class="player-funding w-1/3 flex justify-end">
      <div class="card w-96 bg-base-100 shadow-xl">
        <div class="card-body">
          <BetInput />
          <Funds />
          <GameInfo />

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
import Board from "./components/Board.vue";
import BetInput from "./components/BetInput.vue";
import { useCryptoStore } from "./stores/crypto";
import { storeToRefs } from "pinia";
import Funds from "./components/Funds.vue";
import { computed } from "vue";
import Wheel from "./components/Wheel.vue";
import GameInfo from "./components/GameInfo.vue";

const { account, gameWon, gameRunning, blockToWaitFor } = storeToRefs(useCryptoStore());
const { resetGame } = useCryptoStore();

console.log(blockToWaitFor.value);

const resetOrClaim = computed(() => {
  return gameWon.value ? "Claim win" : "Reset game";
});

const gameFinished = computed(() => {
  return blockToWaitFor.value.toNumber() != 0 && !gameRunning.value;
})
</script>

<style>
#app {
  background-color: green;
  height: 100vh;
}
.roulette-board {
  max-width: 300px;
  border: 1px solid #dad100;
}
.roulette-number {
  font-size: 2rem;
  border: 1px solid #dad100;
  font-weight: bold;
  font-family: "Times New Roman", Times, serif;
}
.roulette-number:nth-child(even) {
  color: black;
}
.roulette-number:nth-child(odd) {
  color: red;
}

.color-bet {
  border: 2px solid #dad100;
}
.diamond {
  width: 85px;
  height: 85px;
  transform: rotate(45deg);
}

.cylinder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
}
</style>
