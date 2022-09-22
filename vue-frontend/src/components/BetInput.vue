<!-- Loading indicator einbauen wenn gerade transaktion gesendet wird, sobald da, fenster schliessen & dann toast anzeigen wenn event eintritt -->

<template>
  <div class="flex gap-2">
    <input
      type="text"
      placeholder="Enter amount"
      class="input input-bordered input-md w-full max-w-xs w-2/3"
      v-model="betAmount"
    />
    <button
      :class="betAvailable"
      class="btn"
      @click="modalOpen = true"
      :title="toolTipMsg"
    >
      Place bet
    </button>
  </div>

  <div class="modal" :class="{ 'modal-open': modalOpen }">
    <div class="modal-box" :class="{ loading: confirmLoading }">
      <span class="spinner" v-if="confirmLoading"></span>
      <h3 class="font-bold text-lg">Confirm bet</h3>
      <p>Amount: {{ betAmount }}ETH</p>
      <p>Gamemode: {{ gameMode }}</p>
      <p>Field: {{ activeField }}</p>
      <div class="modal-action">
        <button class="btn" @click="closeModal">Abort</button>
        <button class="btn" @click="placeBetHandler">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useCryptoStore } from "../stores/crypto";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { ethers } from "ethers";

export default {
  setup() {
    const { betAmount, activeField, gameMode, gameFinished, playerBalance } =
      storeToRefs(useCryptoStore());
    const { placeBet } = useCryptoStore();

    const modalOpen = ref(false);
    const confirmLoading = ref(false);

    const betAvailable = computed(() => {
      return betAmount.value > 0 &&
        activeField.value != "" &&
        gameFinished &&
        playerBalance.value.toString() != "0"
        ? ""
        : "btn-disabled";
    });

    const toolTipMsg = computed(() => {
      if (!gameFinished) {
        return "Please reset your running game first!";
      } else {
        return "Please enter a bet amount & select a field!";
      }
    });

    function closeModal() {
      modalOpen.value = false;
      confirmLoading.value = false;
    }

    async function placeBetHandler() {
      try {
        confirmLoading.value = true;
        let bet = await placeBet();
        modalOpen.value = false;
        confirmLoading.value = false;
      } catch (error) {
        console.log("err", error.code);
        confirmLoading.value = false;
      }
    }

    return {
      betAmount,
      placeBetHandler,
      activeField,
      gameMode,
      betAvailable,
      modalOpen,
      confirmLoading,
      closeModal,
      toolTipMsg,
    };
  },
};
</script>
<style lang="scss">
.modal {
  &.modal-open {
    visibility: visible;
    opacity: 1;
    .loading {
      &::before {
        content: "";
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        background-color: black;
        opacity: 0.5;
      }
      .spinner {
        position: absolute;
        transform: translate(-50%, -50%);
        left: 50%;
        top: 50%;
        display: flex;
        &::after {
          content: "";
          border-radius: 50%;
          width: 32px;
          height: 32px;
          border: 3px solid rgba(0, 0, 0, 0.1);
          border-top: 3px solid #555;
          animation: 1s rotation infinite linear;
        }
      }
    }
  }
}
@keyframes rotation {
  100% {
    transform: rotate(360deg);
  }
}
</style>
