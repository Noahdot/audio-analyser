<template>
  <div class="wrapper">
    <div class="info">
      <div class="title">{{ $t('home.app_title') }}</div>
      <ul>
        <li>{{ $t('home.app_description_1') }}</li>
        <li>{{ $t('home.app_description_2') }}</li>
        <li>{{ $t('home.app_description_3') }}</li>
      </ul>
    </div>
    <div class="control-bar">
      <button @click="start">{{ $t('button.start') }}</button>
      <button @click="procAnalyser">{{ $t('button.analyser') }}</button>
    </div>
    <div class="audio-wrapper" :class="{ active }">
      <template v-if="active">
        <div
          v-for="(item, index) in showDataArray"
          :key="index"
          :style="{ 
            height: `${255 - item * 10}px`
          }"
          class="audio-item"
        ></div>
      </template>
      <template v-else>
        <div class="result-wrapper">
          <ul>
            <li v-for="(item, index) in finalResult">
              {{ `頻率: ${indexToAudio(item.index)}，次數: ${item.count}，佔比: ${item.persent}` }}
            </li>
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const source = ref<MediaStreamAudioSourceNode>();
const analyser = ref<AnalyserNode>();
const oscillator = ref<OscillatorNode>();
const dataArray = ref<number[]>();
const showDataArray = ref<number[]>();
const active = ref(false);
const sex = ref('');
const useOsci = ref(false);


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

const run = () => {
  active.value = true;
  sex.value = '';
  finalResult.value = [];
  // const uint8Array = new Uint8Array(analyser.value.frequencyBinCount);
  const uint8Array = new Uint8Array(24);

  if (useOsci.value) {
    oscillator.value?.connect(analyser.value);
    oscillator.value?.start();
  } else {
    source.value?.connect(analyser.value);
  }

  analyserData.value.length = 0;

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


    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const result = ref({});
const analyserData = ref([]);
const finalResult = ref([]);
const procAnalyser = () => {
  result.value = {};
  active.value = false;

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
  entries.sort((a, b) => b[1] - a[1]);
  finalResult.value = entries.map((item) => {
    return {
      index: item[0],
      count: item[1],
      persent: Math.round(item[1] / sum * 100) + '%'
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

const indexToAudio = (index) => {
  switch (index) {
    case '0': return "< 10";
    case '1': return "< 10";
    case '2': return "10~30";
    case '3': return "30~60";
    case '4': return "60~80";
    case '5': return "80~100";
    case '6': return "100~130";
    case '7': return "130~150";
    case '8': return "150~170";
    case '9': return "170~200";
    case '10': return "200~220";
    case '11': return "220~240";
    case '12': return "240~270";
    case '13': return "270~290";
    case '14': return "290~310";
    case '15': return "310~340";
    case '16': return "340~360";
    case '17': return "360~380";
    case '18': return "380~400";
    default: return "> 400";
  }
}

</script>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;

  .info {
    ul {
      li {
        text-align: left;
      }
    }
  }

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
}
</style>
