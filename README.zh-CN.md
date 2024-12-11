# vue-audio-analyser

[English](https://github.com/Noahdot/audio-analyser/blob/master/README.md) | [繁體中文](https://github.com/Noahdot/audio-analyser/blob/master/README.zh-TW.md) | 简体中文

`vue-audio-analyser` 是一个 Vue 3 的组合式函式，利用了 Web Audio API，方便地从使用者的麦克风获取音讯数据并进行分析。它提供了开始和停止音讯捕获的方法，以及实时的音讯数据，以供可视化或其他处理。

线上体验: [vue-audio-analyser](https://noahdot.github.io/audio-analyser/)

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
 // 在这里处理捕获的音讯数据，例如显示结果
 } catch (e) {
 console.error(e);
 }
}

watch(originAudioData, (value) => {
 // 每当音讯数据有更新时触发，您可以在这里进行可视化或其他处理
}, { deep: true });
```

### About `indexToFrequency(index)`
由于它所返回的是一个区间值，所以要将其转换为图表时，请利用该范围内的随机数。
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
- `startAudioCapture()`: 开始音讯捕获，请求使用者的麦克风访问权限，并开始实时收集音讯数据。
- `stopAudioCapture()`: 停止音讯捕获，断开音讯源，并返回捕获的数据。
 - 返回值:
 - `analyserData`: 包含音讯分析的索引数据。
 - `parsedData`: 经解析的数据，包含每个频率区间的计数和百分比。
- `indexToFrequency(index)`: 将 `analyserData` 的内容索引值转化为频率的函式。
- `originAudioData`: 实时的原始音讯数据，可用于可视化或其他实时处理。

## Notice
- 确保您的应用程式在 HTTPS 协议下运行，因为浏览器仅允许在安全环境下访问使用者的麦克风。
- 使用该套件时，请注意处理使用者拒绝授权的情况。