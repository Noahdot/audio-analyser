<template>
  <canvas ref="chart"></canvas>
</template>

<script setup lang="ts">
import Chart from 'chart.js/auto';
import { FREQ_SEGMENT_COUNT } from '@/utils/audioConfig';
import { useI18n } from 'vue-i18n';
import { useAudioAnalyser } from 'vue-audio-analyser';

const { t } = useI18n();
const { indexToFrequency } = useAudioAnalyser();
const props = defineProps(['data']);
const chart = ref()

const chartInit = () => {
  const ctx = chart.value.getContext('2d');
  const labels = [];
  const datapoints = Array.from({ length: FREQ_SEGMENT_COUNT }, () => 0);

  for (let i = 0; i < FREQ_SEGMENT_COUNT; i++) {
    if (i === (FREQ_SEGMENT_COUNT - 1)) {
      labels.push('>400');
    } else {
      labels.push(indexToFrequency(i.toString()));
    }
  }

  props.data.forEach((item) => {
    datapoints[item.index] = parseInt(item.percent);
  });

  const data = {
    labels: labels,
    datasets: [
      {
        label: t('chart.ratio'),
        data: datapoints,
        borderColor: '#7373B9',
        backgorundColor: '#7373B9',
        fill: false,
        cubicInterpolationMode: 'monotone',
        tension: 0.4,
        borderWidth: 2,
        radius: 0,
      }
    ]
  }

  new Chart(ctx, {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: t('chart.frequency_ratio')
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: t('chart.frequency_segment')
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: t('chart.ratio')
          },
          suggestedMin: 0,
          suggestedMax: 100
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