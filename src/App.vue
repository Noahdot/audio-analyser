<template>
  <div class="wrapper">
      {{ sex }}
    <div class="controll-bar">
      <button @click="start">start</button>
      <button @click="procAnalyser">Audio analyser</button>
    </div>
    <div class="audio-wrapper" :class="{ active }">
      <div
        v-for="(item, index) in showDataArray"
        :key="index"
        :style="{ 
          height: `${255 - item * 10}px`
        }"
      ></div>
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


const start  = () => {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      const audioContext = new AudioContext();
      source.value = audioContext.createMediaStreamSource(stream);
      analyser.value = audioContext.createAnalyser();
      oscillator.value = audioContext.createOscillator();

      setupOscillator();
      setFrequency(400);
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
  // const uint8Array = new Uint8Array(analyser.value.frequencyBinCount);
  const uint8Array = new Uint8Array(24);

  // source.value?.connect(analyser.value);
  oscillator.value?.connect(analyser.value);
  oscillator.value?.start();

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
    // 5-7 男生 8以上女生
    // 整段錄音過程要把這個 maxIndex 記錄到一個陣列，然後把陣列中50%相似的值取出來依個數做平均，這就是平均音頻


    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const result = ref({});
const analyserData = ref([]);
const procAnalyser = () => {
  result.value = {};
  active.value = false;


  oscillator.value?.stop();
  // source.value?.disconnect(analyser.value);

  analyserData.value.forEach((item) => {
    // 紀錄每項的次數
    if (result.value[item]) {
      result.value[item] ++;
    } else {
      result.value[item] = 1;
    }
  });

  // console.log(result.value);
  // const max = Math.max(...Object.values(result.value));
  // console.log(max);
  const keys = Object.keys(result.value);
  if (keys.length === 0) return console.log('no voice data');
  
  const entries = Object.entries(result.value);
  const sum = analyserData.value.length;
  console.log('sum: ', sum);
  entries.sort((a, b) => b[1] - a[1]);
  const n = entries.map((item) => {
    return {
      index: item[0],
      count: item[1],
      persent: Math.round(item[1] / sum * 100) + '%'
    }
  });

  console.log(n);



  // const sortKey = entries.map(item => item[0]);
  // console.log(sortKey);
  // let showObj = {};
  // entries.forEach((item) => {
  //   showObj[item[0]] = Number(item[1]) / Number(sum) + '%';
  // });
  // console.log(showObj);
  // console.log(entries);
  // sex.value = sortKey[0] < 8? 'Man': 'Woman';
  // const maxKey = Object.keys(result.value).reduce((preKey, curKey) => {
  //   return result.value[preKey] > result.value[curKey]? preKey: curKey;
  // });
  // console.log(maxKey);
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

    & > div {
      width: calc(100% / 24);
      height: 255px;
      background-color: #333;
    }
  }
}
</style>
