<template>
  <div class="flex">
    <div class="left-pads flex flex-column items-end">
      <div
        class="h-1/3 w-40 color-bet flex justify-center items-center"
        @click="setField('BLACK')"
        :class="activeField == 'BLACK' ? 'selected' : ''"
      >
        <div class="diamond bg-black"></div>
      </div>
    </div>
    <div class="grid grid-cols-3 roulette-board">
      <div
        class="roulette-number py-2 px-6 cursor-pointer flex justify-center items-center"
        v-for="i in 36"
        @click="setField(i)"
        :class="activeField == i ? 'selected' : ''"
      >
        {{ i }}
      </div>
      <!-- <div class="roulette-bet-field p-4 cursor-pointer" v-for="i in 3">
            2 in 1
          </div> -->
    </div>
    <div class="right-pads flex flex-column items-end">
      <div
        class="h-1/3 color-bet w-40 flex justify-center items-center"
        @click="setField('RED')"
        :class="activeField == 'RED' ? 'selected' : ''"
      >
        <div class="diamond bg-red-700"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { useCryptoStore } from "../stores/crypto";
import { storeToRefs } from "pinia";
import { computed } from "vue";

export default {
  setup() {
    const { setField } = useCryptoStore();
    const { activeField } = storeToRefs(useCryptoStore());


    const betAvailable = computed((value) => {
      // return betAmount.value > 0 && activeField.value != "" ? '' : 'disabled'
    });

    return {
      setField,
      activeField,
      betAvailable,
    };
  },
};
</script>
<style>
.selected {
  background-color: rgba(255,255,126, .2);
}
</style>
