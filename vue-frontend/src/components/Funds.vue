<template>
  <div class="stat pl-0">
    <div class="stat-title">Current balance</div>
    <div class="stat-value flex items-center">
      <span class="mr-2"> {{ ETHbalance }} ETH</span>
      <Spinner v-if="balancePending" />
    </div>
    <div class="stat-actions flex gap-2">
      <button class="btn btn-sm" @click="withdrawModalOpen = true">
        Withdrawal
      </button>
      <button class="btn btn-sm" @click="depositModalOpen = true">
        Deposit
      </button>
    </div>
    <div class="modal" :class="{ 'modal-open': depositModalOpen }">
      <div class="modal-box relative" :class="{ loading: depositLoading }">
        <span class="spinner" v-if="depositLoading"></span>
        <button
          class="btn btn-sm btn-circle absolute right-2 top-2"
          @click="depositModalOpen = false"
        >
          ✕
        </button>
        <h3 class="text-lg font-bold">Deposit funds</h3>
        <p class="py-4">
          <input
            type="text"
            placeholder="Amount"
            class="input input-bordered w-full max-w-xs"
            v-model="depositAmount"
          />
          <button class="btn" @click="initiateDeposit">Deposit</button>
        </p>
      </div>
    </div>

    <div class="modal" :class="{ 'modal-open': withdrawModalOpen }">
      <div class="modal-box relative" :class="{ loading: withdrawLoading }">
        <span class="spinner" v-if="withdrawLoading"></span>
        <button
          class="btn btn-sm btn-circle absolute right-2 top-2"
          @click="withdrawModalOpen = true"
        >
          ✕
        </button>
        <h3 class="text-lg font-bold">Withdraw funds</h3>
        <input
          type="text"
          placeholder="Amount"
          class="input input-bordered w-full max-w-xs"
          v-model="withdrawalAmount"
        />
        <button class="btn" @click="initiateWithdrawal">Withdraw</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useCryptoStore } from "../stores/crypto";
import { storeToRefs } from "pinia";
import { ethers } from "ethers";
import { computed, ref, watch } from "vue";
import Spinner from "./Spinner.vue";

export default {
  setup() {
    const { playerBalance, gameRunning, balancePending } = storeToRefs(
      useCryptoStore()
    );
    const { deposit, withdraw } = useCryptoStore();
    const depositAmount = ref(0);
    const withdrawalAmount = ref(0);
    const depositModalOpen = ref(false);
    const depositLoading = ref(false);
    const withdrawModalOpen = ref(false);
    const withdrawLoading = ref(false);

    watch(depositAmount, async () => {
      depositAmount.value = depositAmount.value.replace(/,/g, ".");
    });

    watch(withdrawalAmount, async () => {
      withdrawalAmount.value = withdrawalAmount.value.replace(/,/g, ".");
    });

    async function initiateDeposit() {
      depositLoading.value = true;
      await deposit(String(depositAmount.value));
      depositLoading.value = false;
      depositModalOpen.value = false;
      depositAmount.value = "0";
    }

    async function initiateWithdrawal() {
      withdrawLoading.value = true;
      await withdraw(String(withdrawalAmount.value));
      withdrawLoading.value = false;
      withdrawModalOpen.value = false;
      withdrawalAmount.value = "0";
    }

    const ETHbalance = computed(() => {
      const remainder = playerBalance.value.mod(100000000000);
      return ethers.utils.formatEther(playerBalance.value.sub(remainder));
    });

    return {
      initiateDeposit,
      initiateWithdrawal,
      ETHbalance,
      depositAmount,
      withdrawalAmount,
      gameRunning,
      depositModalOpen,
      depositLoading,
      withdrawLoading,
      withdrawModalOpen,
      balancePending,
    };
  },
  components: { Spinner },
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
