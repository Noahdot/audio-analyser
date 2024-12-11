# vue-audio-analyser

[English](https://github.com/Noahdot/audio-analyser/blob/master/README.md) | 繁體中文 | [简体中文](https://github.com/Noahdot/audio-analyser/blob/master/README.zh-CN.md)

`vue-audio-analyser` 是一個 Vue 3 的組合式函式，利用了 Web Audio API，方便地從使用者的麥克風獲取音訊數據並進行分析。它提供了開始和停止音訊捕獲的方法，以及實時的音訊數據，以供可視化或其他處理。

線上體驗: [vue-audio-analyser](https://noahdot.github.io/audio-analyser/)

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
    // 在這裡處理捕獲的音訊數據，例如顯示結果
  } catch (e) {
    console.error(e);
  }
}

watch(originAudioData, (value) => {
  // 每當音訊數據有更新時觸發，您可以在這裡進行可視化或其他處理
}, { deep: true });
```

### About `indexToFrequency(index)`
由於它所返回的是一個區間值，所以要將其轉換為圖表時，請利用該範圍內的隨機數。
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
- `startAudioCapture()`: 開始音訊捕獲，請求使用者的麥克風訪問權限，並開始實時收集音訊數據。
- `stopAudioCapture()`: 停止音訊捕獲，斷開音訊源，並返回捕獲的數據。
  - 返回值: 
    - `analyserData`: 包含音訊分析的索引數據。
    - `parsedData`: 經解析的數據，包含每個頻率區間的計數和百分比。
- `indexToFrequency(index)`: 將 `analyserData` 的內容索引值轉化為頻率的函式。
- `originAudioData`: 實時的原始音訊數據，可用於可視化或其他實時處理。

## Notice
- 確保您的應用程式在 HTTPS 協議下運行，因為瀏覽器僅允許在安全環境下訪問使用者的麥克風。
- 使用該套件時，請注意處理使用者拒絕授權的情況。