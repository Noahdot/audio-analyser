# vue-audio-analyser

English | [繁體中文](https://github.com/Noahdot/audio-analyser/blob/master/README.zh-TW.md) | [简体中文](https://github.com/Noahdot/audio-analyser/blob/master/README.zh-CN.md)

`vue-audio-analyser` is a Vue 3 composable function that leverages the Web Audio API to easily capture and analyze audio data from the user's microphone. It provides methods to start and stop audio capture, as well as real-time audio data for visualization or other processing.

Live Demo: [vue-audio-analyser](https://noahdot.github.io/audio-analyser/)

## Installation
```bash
# npm
$ npm install vue-audio-analyser

# yarn
$ yarn add vue-audio-analyser
```

## Usage
```js
import { ref, watch } from 'vue';
import { useAudioAnalyser } from 'vue-audio-analyser';

const { startAudioCapture, stopAudioCapture, originAudioData, indexToFrequency } = useAudioAnalyser();

const yourStartEvent = () => {
  startAudioCapture();
}

const yourStopEvent = () => {
  try {
    const { analyserData, parsedData } = stopAudioCapture();
    // Process the captured audio data here, such as displaying results
  } catch (e) {
    console.error(e);
  }
}

watch(originAudioData, (value) => {
  // Triggered whenever the audio data updates, useful for visualization or other processing
}, { deep: true });
```

### About `indexToFrequency(index)`
Since the function returns a range value, you can use a random number within that range when converting it for charts.
```js
const freq = indexToFrequency('5');
console.log(freq); // '80~100' frequency

const yourChartData = analyserData.map((item) => {
  const segment = indexToFrequency(item.toString());
  const [ min, max ] = segment.split('~').map(Number);
  return Math.round(Math.random() * (max - min) + min);
});
```

## API
- `startAudioCapture()`: Starts audio capture, requests the user's microphone access permission, and begins real-time audio data collection.
- `stopAudioCapture()`: Stops audio capture, disconnects the audio source, and returns the captured data.
  - Returns: 
    - `analyserData`: Contains the index data from the audio analysis.
    - `parsedData`: Parsed data that includes the count and percentage of each frequency range.
- `indexToFrequency(index)`: A function to convert the `analyserData` index values into frequency ranges.
- `originAudioData`: Real-time raw audio data, useful for visualization or other real-time processing.

## Notice
- Ensure your application runs under the HTTPS protocol, as browsers only allow microphone access in secure environments.
- When using this package, make sure to handle cases where the user denies microphone access.