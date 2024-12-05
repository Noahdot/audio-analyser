<template>
  <canvas ref="chart"></canvas>
</template>

<script setup lang="ts">
import Chart from 'chart.js/auto';
import { ref, onMounted } from 'vue';
import { indexToAudio } from '@/utils/audioConfig';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const props = defineProps(['data']);
const chart = ref()

const chartInit = () => {
  const ctx = chart.value.getContext('2d');
  const labels = props.data.map((_, index) => index.toString());
  const datapoints = props.data.map((item) => {
    /* 
      The raw data represents a range, so when converting it to the chart,
      a random number within the range will be used.
    */
    const segment = indexToAudio(item.toString());
    const [ min, max ] = segment.split('~').map(Number);
    return Math.round(Math.random() * (max - min) + min);
  });

  const data = {
    labels: labels,
    datasets: [
      {
        label: t('chart.frequency'),
        data: datapoints,
        borderColor: '#73BF00',
        fill: false,
        cubicInterpolationMode: 'monotone',
        tension: 0.4,
        borderWidth: 2,
        radius: 0,
      }
    ]
  }

  new Chart(ctx, {
    type: 'line',
    data: data,
      options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: t('chart.original_data')
        }
      },
      interaction: {
        intersect: false,
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: t('chart.time')
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: t('chart.frequency')
          },
          suggestedMin: 0,
          suggestedMax: 400
        }
      }
    },
  });
}

onMounted(() => {
  chartInit();
});
</script>

<style scoped>

</style>