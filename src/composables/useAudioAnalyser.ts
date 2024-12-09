import { ref } from "vue";

export const useAudioAnalyser = () => {
  const source = ref();
  const analyser = ref();
  const timer = ref();
  const originAudioData = ref([]);
  const analyserData = ref([]);

  const getUserMediaStream = () => {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => resolve(stream))
        .catch(err => reject(err));
    });
  }

  const _startCaptureLoop = () => {
    source.value.connect(analyser.value);
    const uint8Array = new Uint8Array(24);
    let maxValue = 0
    let maxIndex = 0;
    analyserData.value = [];

    const audioCaptureLoop = () => {
      maxValue = 0;
      analyser.value.getByteFrequencyData(uint8Array);
      originAudioData.value = Array.from(uint8Array);

      for (let i = 0; i < originAudioData.value.length; i++) {
        if (originAudioData.value[i] >= maxValue) {
          maxValue = originAudioData.value[i];
          maxIndex = i;
        }
      }
      if (maxValue > 150) analyserData.value.push(maxIndex);
      timer.value = requestAnimationFrame(audioCaptureLoop);
    }

    audioCaptureLoop();
  }

  const startAudioCapture = async () => {
    try {
      const stream = await getUserMediaStream();
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      source.value = audioContext.createMediaStreamSource(stream);
      analyser.value = audioContext.createAnalyser();
    } catch (err) {
      throw err;
    }

    _startCaptureLoop();
  }

  const stopAudioCapture = () => {
    cancelAnimationFrame(timer.value);
    source.value.disconnect(analyser.value);
    if (analyserData.value.length === 0) throw new Error('No audio data captured');

    const indexCount = {};
    analyserData.value.forEach(index => {
      if (indexCount[index]) {
        indexCount[index]++;
      } else {
        indexCount[index] = 1;
      }
    });

    const entries = Object.entries(indexCount);
    const sum = analyserData.value.length;
    const parsedData = entries.map(([index, count]) => {
      return {
        index,
        count,
        percent: `${Math.round(count / sum * 100)}%`
      }
    });

    return {
      analyserData,
      parsedData,
    }
  }

  const indexToFrequency = (index) => {

  }

  return {
    startAudioCapture,
    stopAudioCapture,
    indexToFrequency,
    originAudioData
  }
}