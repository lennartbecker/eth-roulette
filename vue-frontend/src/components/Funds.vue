<template>
  <div class="stat pl-0">
    <div class="stat-title">Current balance</div>
    <div class="stat-value">{{ ETHbalance }} ETH</div>
    <div class="stat-actions flex gap-2">
      <label for="withdraw" class="btn btn-sm">Withdrawal</label>
      <label for="deposit" class="btn btn-sm">Deposit</label>
    </div>

    <!-- Put this part before </body> tag -->
    <input type="checkbox" id="deposit" class="modal-toggle" />
    <div class="modal">
      <div class="modal-box relative">
        <label
          for="deposit"
          class="btn btn-sm btn-circle absolute right-2 top-2"
          >✕</label
        >
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

    <input type="checkbox" id="withdraw" class="modal-toggle" />
    <div class="modal">
      <div class="modal-box relative">
        <label
          for="withdraw"
          class="btn btn-sm btn-circle absolute right-2 top-2"
          >✕</label
        >
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
import { computed, ref } from "vue";

export default {
  setup() {
    const { playerBalance } = storeToRefs(useCryptoStore());
    const { deposit, withdraw } = useCryptoStore();

    const depositAmount = ref(0);
    const withdrawalAmount = ref(0);

    function initiateDeposit() {
      const depositTx = deposit(String(depositAmount.value));
      depositTx
        .then((tx) => {
          console.log(tx);
        })
        .catch((err) => {
          console.error(err);
        });
    }

    function initiateWithdrawal() {
      withdraw(String(withdrawalAmount.value));
    }

    const ETHbalance = computed(() => {
      const remainder = playerBalance.value.mod(1e14);
      return ethers.utils.formatEther(playerBalance.value.sub(remainder));
    });

    return {
      ETHbalance,
      initiateDeposit,
      initiateWithdrawal,
      depositAmount,
      withdrawalAmount,
    };
  },
};
</script>
