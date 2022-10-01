<template>
  <div class="flex flex-row p-4">
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
import Board from "../components/Board.vue";
import BetInput from "../components/BetInput.vue";
import Funds from "../components/Funds.vue";
import Wheel from "../components/Wheel.vue";
import GameInfo from "../components/GameInfo.vue";

</script>
<style>
.cylinder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  align-items: center;
}
</style>
