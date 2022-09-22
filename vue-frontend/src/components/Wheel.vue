<template>
  <div class="cylinder-wrapper">
    <div class="wheel-indicator"></div>
    <img
      src="@/assets/wheel.png"
      alt=""
      srcset=""
      class="wheel running"
      :style="rotationStyle"
    />
  </div>
</template>

<script>
import { useCryptoStore } from "../stores/crypto";
import { storeToRefs } from "pinia";
import { watch, ref, computed } from "vue";
export default {
  setup() {
    const { latestNumber } = storeToRefs(useCryptoStore());
    const rotationValue = ref(0);
    const numbers = [
      0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
      24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
    ];

    watch(latestNumber, (value) => {
      rotationValue.value = getDegreeOfNumber(value);
      console.log("rotate to:", rotationValue.value, getDegreeOfNumber(value));
    });

    function getDegreeOfNumber(number) {
      return numbers.indexOf(parseInt(number)) * 9.7;
    }

    const rotationStyle = computed(() => {
      return `transform: rotate(-${rotationValue.value + 10 * 360}deg)`;
    });

    return {
      rotationStyle,
    };
  },
};
</script>
<style lang="scss">
.cylinder-wrapper {
  position: relative;
  .wheel {
    &.running {
      transition: all 10s ease 0s;
      animation: blur 10s;
    }
  }

  .wheel-indicator {
    height: 20px;
    width: 10px;
    position: absolute;
    top: -20px;
    background: white;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
