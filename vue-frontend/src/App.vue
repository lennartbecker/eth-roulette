<template>
  <Navbar v-if="account"/>
  <Home v-if="account"/>
  <Login v-if="!account"/>
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
import { useCryptoStore } from "./stores/crypto";
import { storeToRefs } from "pinia";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";

const { account } = storeToRefs(useCryptoStore());
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;600&display=swap");
html,
body {
  background-color: #1e293b;
  background-color: #1f2937;
  height: 100%;
}
#app {
  height: 100%;
  font-family: "Inter Tight", sans-serif;
}
</style>
