<template>
  <div class="cylinder-wrapper">
    <div class="wheel-indicator"></div>
    <img
      src="@/assets/wheel.png"
      alt=""
      srcset=""
      class="wheel"
      :class="isRunning"
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
    const timeOut = ref(false);
    const isTurning = ref(false);
    const numbers = [
      0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
      24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
    ];

    watch(latestNumber, (value) => {
      rotationValue.value = getDegreeOfNumber(value) + 10 * 360;
      isTurning.value = true;
      timeOut.value = setTimeout(() => {
        isTurning.value = false;
        rotationValue.value = getDegreeOfNumber(value);
      }, 12000);
    });

    function getDegreeOfNumber(number) {
      return numbers.indexOf(parseInt(number)) * 9.7;
    }

    const rotationStyle = computed(() => {
      if (rotationValue.value == 0) {
        return "";
      }
      return `transform: rotate(-${rotationValue.value}deg)`;
    });

    const isRunning = computed(() => {
      if (isTurning.value) {
        return "running";
      }
      return;
    });

    return {
      rotationStyle,
      isRunning,
    };
  },
};
</script>
<style lang="scss">
.cylinder-wrapper {
  position: relative;
  .wheel {
    &.running {
      transition: all 5s ease 0s;
      animation: blur 5s;
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

@keyframes blur {
  0% {
    filter: blur(1px);
  }
  25% {
    filter: blur(3px);
  }
  70% {
    filter: blur(2px);
  }
  90% {
    filter: blur(1px);
  }
  100% {
    filter: blur(0%);
  }
}
</style>
