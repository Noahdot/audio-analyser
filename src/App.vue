<template>
  <div>
    <button @click="start">Audio analyzer</button>
  </div>
</template>
<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue'
import { ref } from 'vue';
const source = ref<MediaStreamAudioSourceNode>();
const analyzer = ref<AnalyserNode>();

const start  = () => {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      const audioContext = new AudioContext();
      source.value = audioContext.createMediaStreamSource(stream);
      analyzer.value = audioContext.createAnalyser();

      run();
    })
    .catch((err) => {
      console.log(err)
    })
}

const run = () => {
  const dataArray = new Uint8Array(analyzer.value.frequencyBinCount);
  const update = () => {
    analyzer.value.getByteFrequencyData(dataArray);
    console.log(dataArray);
    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

</script>
<style lang="scss" scoped>
</style>
