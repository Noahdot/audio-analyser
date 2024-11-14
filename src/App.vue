<template>
  <div class="wrapper">
    {{ showNumber + ` - maxNumbr: ${maxNumber} - maxIndex: ${maxIndex}` }}
    <div class="controll-bar">
      <button @click="start">start</button>
      <button @click="add">+</button>
      <button @click="min">-</button>
      <input type="range" min="0" max="400" step="10" v-model="showNumber" />
      <button @click="procAnalyser">Audio analyser</button>
    </div>
    <div class="audio-wrapper">
      <div v-for="(item, index) in dataArray" :key="index" :style="{ height: `${item}px` }"></div>
    </div>
    <br>
    {{ dataArray }}
  </div>
</template>
<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue'
import { ref, watch } from 'vue';
const source = ref<MediaStreamAudioSourceNode>();
const analyser = ref<AnalyserNode>();
const oscillator = ref<OscillatorNode>();
// const dataArray = ref<Uint8Array>();
const dataArray = ref<number[]>();
const showNumber = ref(0);

const start  = () => {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      const audioContext = new AudioContext();
      source.value = audioContext.createMediaStreamSource(stream);
      analyser.value = audioContext.createAnalyser();
      oscillator.value = audioContext.createOscillator();

      setupOscillator();
      run();
    })
    .catch((err) => {
      console.log(err)
    })
}

const maxNumber = ref(0);
const maxIndex = ref(0);

const run = () => {
  // analyser.value.smoothingTimeConstant = 0;
  // const uint8Array = new Uint8Array(analyser.value.frequencyBinCount);
  const uint8Array = new Uint8Array(24);

  source.value?.connect(analyser.value);
  // oscillator.value?.connect(analyser.value);

  oscillator.value.start();
  analyserData.value.length = 0;

  const update = () => {
    maxNumber.value = 0;
    analyser.value.getByteFrequencyData(uint8Array);
    dataArray.value = Array.from(uint8Array);
    // dataArray.value = Array.from(uint8Array).filter(item => item > 100);

    
    for (let i = 0; i < dataArray.value.length; i++) {
      if (dataArray.value[i] > maxNumber.value) {
        maxNumber.value = dataArray.value[i];
        maxIndex.value = i;
      }
    }
    if (maxNumber.value > 150) analyserData.value.push(maxIndex.value);
    // 3 開始是有效資料，5-7 男生 8以上女生
    // 整段錄音過程要把這個 maxIndex 記錄到一個陣列，然後把陣列中50%相似的值取出來依個數做平均，這就是平均音頻


    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const add = () => {
  showNumber.value = oscillator.value.frequency.value ++;
}

const min = () => {
  showNumber.value = oscillator.value.frequency.value --;
}

watch(showNumber, (v) => {
  oscillator.value.frequency.value = v;
});

const setupOscillator = () => {
  if (!oscillator.value) return;

  oscillator.value.type = 'sine';
  oscillator.value.frequency.value = 80;
}

const analyserData = ref([]);
const procAnalyser = () => {
  // analyserData.value.length = 0;
  source.value?.disconnect(analyser.value);
  console.log(analyserData.value);
}

// oscillator.stop();

</script>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;

  .control-bar {

  }

  .audio-wrapper {
    display: flex;
    align-items: flex-end;
    width: 1024px;
    height: 255px;
    background-color: #333;

    & > div {
      width: 42px;
      background-color: #599fdb;
    }
  }
}
</style>
