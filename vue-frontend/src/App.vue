<template>
  <Navbar />

  <div class="flex flex-row p-4">
    <!-- <Input /> -->
    <div class="cylinder w-1/3"></div>
    <div class="game-wrapper w-1/3 flex justify-center">
      <Board />
    </div>
    <div class="player-funding w-1/3 flex justify-end">
      <div class="card w-96 bg-base-100 shadow-xl">
        <div class="card-body">
          <BetInput />
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
import Board from "./components/Board.vue";
import BetInput from "./components/BetInput.vue";
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
</style>
