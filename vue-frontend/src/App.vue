<template>
  <Navbar />

  <div class="flex flex-row p-4">
    <!-- <Input /> -->
    <div class="game-wrpaper w-2/3">
      game content

      <div class="roulette-board">
        <div class="grid grid-cols-3">
          <div
            class="roulette-number p-4 cursor-pointer flex justify-center items-center rounded-full"
            v-for="i in 36"
          >
            {{ i }}
          </div>
          <div class="roulette-bet-field p-4 cursor-pointer" v-for="i in 3">
            2 in 1
          </div>
        </div>
      </div>
    </div>
    <div class="player-funding w-1/3 flex justify-end">
      <div class="card w-96 bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="stat">
            <div class="stat-title">Current balance</div>
            <div class="stat-value">0.534 ETH</div>
            <div class="stat-actions flex gap-2">
              <button class="btn btn-sm">Withdrawal</button>
              <button class="btn btn-sm">deposit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
import Input from "./components/Input.vue";
</script>

<style>
.roulette-board {
  max-width: 300px;
}
.roulette-number:nth-child(even) {
  background-color: red;
}
.roulette-number:nth-child(odd) {
  background-color: black;
  color: white;
}
</style>
