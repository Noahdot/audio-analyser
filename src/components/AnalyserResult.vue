<template>
  <div class="canvas-wrapper">
    <FrequencyRatio :data="props.finalResult" />
  </div>
  <br><br>
  <div class="canvas-wrapper">
    <OriginalAudio :data="props.data" />
  </div>
</template>

<script setup lang="ts">
import Chart from 'chart.js/auto';
Chart.defaults.color = '#ffffff';

const props = defineProps([
  'data',
  'finalResult'
]);
</script>

<style lang="scss" scoped>
.canvas-wrapper {
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>