<template>
  <div class="flex flex-col board-wrapper">
    <div class="grid grid-cols-3 roulette-board border-b-0">
      <div
        class="roulette-number py-2 px-6 cursor-pointer flex justify-center items-center"
        v-for="i in 36"
        @click="setField(i)"
        :class="[activeField == i ? 'selected' : '', `number-${i}`]"
      >
        {{ i }}
      </div>
    </div>
    <div class="roulette-board flex border-t-0">
      <div
        class="w-1/2 h-16 bet-red flex text-white items-center justify-center roulette-field"
        @click="setField('RED')"
        :class="activeField == 'RED' ? 'selected' : ''"
      >
        Red
      </div>
      <div
        class="w-1/2 h-16 bet-black flex text-white items-center justify-center roulette-field"
        @click="setField('BLACK')"
        :class="activeField == 'BLACK' ? 'selected' : ''"
      >
        Black
      </div>
    </div>

<button @click="getGameResult">Result</button>
  </div>
</template>

<script>
import { useCryptoStore } from "../stores/crypto";
import { storeToRefs } from "pinia";
import { computed } from "vue";

export default {
  setup() {
    const { setField, getGameResult } = useCryptoStore();
    const { activeField } = storeToRefs(useCryptoStore());

    const betAvailable = computed((value) => {
      // return betAmount.value > 0 && activeField.value != "" ? '' : 'disabled'
    });

    return {
      setField,
      getGameResult,
      activeField,
      betAvailable,
    };
  },
};
</script>
<style lang="scss">
.board-wrapper {
  box-shadow: 0px 0px 10px 0px black;
}
.roulette-board {
  max-width: 225px;
  // border: 1px solid white;
}
.roulette-number,
.roulette-field {
  font-size: 1.5rem;
  font-family: "Inter Tight", sans-serif;
  color: white;
  cursor: pointer;
  // border: 1px solid white;

  &:hover,
  &.selected {
    box-shadow: inset 0px 0px 0px 3px white;
  }
}

$redNumbers: 1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36;
$blackNumbers: 15, 4, 2, 17, 6, 13, 11, 8, 10, 24, 33, 20, 31, 22, 29, 28, 35,
  26;

@each $redNumber in $redNumbers {
  .number-#{$redNumber} {
    background-color: #dc2626;
  }
}

@each $blackNumber in $blackNumbers {
  .number-#{$blackNumber} {
    background-color: #292524;
  }
}

.bet-red {
  background-color: #dc2626;
}

.bet-black {
  background-color: #292524;
}
</style>
