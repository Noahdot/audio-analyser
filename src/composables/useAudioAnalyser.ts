export const useAudioAnalyser = () => {
  const source = ref<MediaStreamAudioSourceNode | null>(null);
  const analyser = ref<AnalyserNode | null>(null);
  const timer = ref<number>(0);
  const originAudioData = ref<number[]>([]);
  const analyserData = ref<number[]>([]);
  const UINT_8_ARRAY_LENGTH = 20;

  const _getUserMediaStream = (): Promise<MediaStream> => {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream: MediaStream) => resolve(stream))
        .catch(err => reject(err));
    });
  }

  const _startCaptureLoop = () => {
    if (source.value && analyser.value) {
      source.value.connect(analyser.value);
      const uint8Array = new Uint8Array(UINT_8_ARRAY_LENGTH);
      let maxValue = 0
      let maxIndex = 0;
      analyserData.value = [];

      const audioCaptureLoop = () => {
        maxValue = 0;
        analyser.value!.getByteFrequencyData(uint8Array);
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
  }

  const startAudioCapture = async () => {
    try {
      const stream: MediaStream = await _getUserMediaStream();
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
    if (source.value && analyser.value) source.value.disconnect(analyser.value);
    if (analyserData.value.length === 0) throw new Error('No audio data captured');

    const indexCount: { [key: number]: number } = {};
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

  const indexToFrequency = (index: string): string => {
    switch (index) {
      case '0': return "0~10";
      case '1': return "10~20";
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
      default: return "> 400~999";
    }
  }

  return {
    startAudioCapture,
    stopAudioCapture,
    indexToFrequency,
    originAudioData
  }
}