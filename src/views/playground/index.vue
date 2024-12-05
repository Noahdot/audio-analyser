<template>
  <div class="wrapper">
    <div class="control-bar">
      <button @click="start" :disabled="active">{{ $t('button.start') }}</button>
      <button @click="stop" :disabled="!active">{{ $t('button.stop') }}</button>
    </div>
    <div class="result-wrapper" v-if="showResult">
      <AnalyserResult :data="analyserData" :final-result="finalResult" />
    </div>
    <div class="audio-wrapper" v-else :class="{ active }">
      <div
        v-for="(item, index) in showDataArray"
        :key="index"
        :style="{ 
          height: `${255 - item * 10}px`
        }"
        class="audio-item"
      ></div>
    </div>
    
  </div>
  <NoticeDialog />
</template>
<script setup lang="ts">
import { ref } from 'vue';
import NoticeDialog from '@/components/NoticeDialog.vue';
import AnalyserResult from '@/components/AnalyserResult.vue';
const source = ref<MediaStreamAudioSourceNode>();
const analyser = ref<AnalyserNode>();
const oscillator = ref<OscillatorNode>();
const dataArray = ref<number[]>();
const showDataArray = ref<number[]>();
const active = ref(false);
const useOsci = ref(false);

const showResult = ref(false);


const start  = () => {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      const audioContext = new AudioContext();
      source.value = audioContext.createMediaStreamSource(stream);
      analyser.value = audioContext.createAnalyser();
      oscillator.value = audioContext.createOscillator();

      if (useOsci.value) {
        setupOscillator();
        setFrequency(400);
      }
      run();
    })
    .catch((err) => {
      console.log(err)
    })
}

const maxNumber = ref(0);
const maxIndex = ref(0);

let timer = null;

const run = () => {
  active.value = true;
  finalResult.value = [];
  showResult.value = false;
  // const uint8Array = new Uint8Array(analyser.value.frequencyBinCount);
  const uint8Array = new Uint8Array(24);

  if (useOsci.value) {
    oscillator.value?.connect(analyser.value);
    oscillator.value?.start();
  } else {
    source.value?.connect(analyser.value);
  }

  analyserData.value.length = 0; //沒清空?

  const update = () => {
    maxNumber.value = 0;
    analyser.value.getByteFrequencyData(uint8Array);
    dataArray.value = Array.from(uint8Array);
    showDataArray.value = dataArray.value.map(item => Math.round(item / 10));
    // dataArray.value = Array.from(uint8Array).filter(item => item > 100);

    
    for (let i = 0; i < dataArray.value.length; i++) {
      if (dataArray.value[i] >= maxNumber.value) {
        maxNumber.value = dataArray.value[i];
        maxIndex.value = i;
      }
    }
    if (maxNumber.value > 150) analyserData.value.push(maxIndex.value);

    timer = requestAnimationFrame(update);
  }

  const startAnimation = () => {
    timer = requestAnimationFrame(update);
  }

  

  startAnimation();
}

const result = ref({});
const analyserData = ref([]);
const finalResult = ref([]);
const stop = () => {
  cancelAnimationFrame(timer);
  result.value = {};
  active.value = false;
  showResult.value = true;

  if (useOsci.value) {
    oscillator.value?.stop();
  } else {
    source.value?.disconnect(analyser.value);
  }

  analyserData.value.forEach((item) => {
    if (result.value[item]) {
      result.value[item] ++;
    } else {
      result.value[item] = 1;
    }
  });
  const keys = Object.keys(result.value);
  if (keys.length === 0) return console.log('no voice data');
  
  const entries = Object.entries(result.value);
  const sum = analyserData.value.length;
  console.log('sum: ', sum);
  // entries.sort((a, b) => b[1] - a[1]);
  finalResult.value = entries.map((item) => {
    return {
      index: item[0],
      count: item[1],
      percent: Math.round(item[1] / sum * 100) + '%'
    }
  });

  console.log(finalResult.value);
}

const setupOscillator = () => {
  oscillator.value.type = 'sine';
}

const setFrequency = (frequency) => {
  oscillator.value.frequency.value = frequency;
}

</script>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;

  .control-bar {
    & button {
      margin: 1rem;
    }
  }

  .audio-wrapper {
    display: flex;
    align-items: flex-start;
    width: 90%;
    max-width: 1024px;
    height: 255px;
    background-color: #333;
    
    &.active {
      background: linear-gradient(to top, rgb(175, 255, 175) 0%, rgb(255, 255, 157) 30%, rgb(253, 128, 128) 100%);
    }

    & > .audio-item {
      width: calc(100% / 24);
      height: 255px;
      background-color: #333;
    }

    .result-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;

      ul {
        list-style: none;

        li {
          text-align: left;
        }
      }
    }
  }

  .result-wrapper {
    width: 1024px;
    background-color: #333;
  }
}

.notice-dialog {
  ul {
    li {
      text-align: left;
    }
  }
}
</style>
