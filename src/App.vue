<template>
  <div class="wrapper">
    {{ showNumber }}
    <div class="controll-bar">
      <button @click="start">Audio analyzer</button>
      <button @click="add">+</button>
      <button @click="min">-</button>
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
import { ref } from 'vue';
const source = ref<MediaStreamAudioSourceNode>();
const analyzer = ref<AnalyserNode>();
const oscillator = ref<OscillatorNode>();
// const dataArray = ref<Uint8Array>();
const dataArray = ref<number[]>();
const showNumber = ref(0);

const start  = () => {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      const audioContext = new AudioContext();
      source.value = audioContext.createMediaStreamSource(stream);
      analyzer.value = audioContext.createAnalyser();
      oscillator.value = audioContext.createOscillator();

      setupOscillator();
      run();
    })
    .catch((err) => {
      console.log(err)
    })
}

const run = () => {
  analyser.smoothingTimeConstant
  const uint8Array = new Uint8Array(analyzer.value.frequencyBinCount);

  // source.value?.connect(analyzer.value);

  oscillator.value.start();
  oscillator.value?.connect(analyzer.value);
  const update = () => {
    analyzer.value.getByteFrequencyData(uint8Array);
    dataArray.value = Array.from(uint8Array);
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

const setupOscillator = () => {
  if (!oscillator.value) return;

  oscillator.value.type = 'sine';
  oscillator.value.frequency.value = 20;
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
      width: 1px;
      background-color: #fff;
    }
  }
}
</style>
