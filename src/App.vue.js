import { ref } from 'vue';
const { defineProps, defineSlots, defineEmits, defineExpose, defineModel, defineOptions, withDefaults, } = await import('vue');
const source = ref();
const analyser = ref();
const oscillator = ref();
const dataArray = ref();
const showDataArray = ref();
const active = ref(false);
const sex = ref('');
const useOsci = ref(false);
const start = () => {
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
        console.log(err);
    });
};
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
    }
    else {
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
        if (maxNumber.value > 150)
            analyserData.value.push(maxIndex.value);
        requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
};
const result = ref({});
const analyserData = ref([]);
const finalResult = ref([]);
const procAnalyser = () => {
    result.value = {};
    active.value = false;
    if (useOsci.value) {
        oscillator.value?.stop();
    }
    else {
        source.value?.disconnect(analyser.value);
    }
    analyserData.value.forEach((item) => {
        if (result.value[item]) {
            result.value[item]++;
        }
        else {
            result.value[item] = 1;
        }
    });
    const keys = Object.keys(result.value);
    if (keys.length === 0)
        return console.log('no voice data');
    const entries = Object.entries(result.value);
    const sum = analyserData.value.length;
    console.log('sum: ', sum);
    entries.sort((a, b) => b[1] - a[1]);
    finalResult.value = entries.map((item) => {
        return {
            index: item[0],
            count: item[1],
            persent: Math.round(item[1] / sum * 100) + '%'
        };
    });
    console.log(finalResult.value);
};
const setupOscillator = () => {
    oscillator.value.type = 'sine';
};
const setFrequency = (frequency) => {
    oscillator.value.frequency.value = frequency;
};
const indexToAudio = (index) => {
    switch (index) {
        case '0': return "~10";
        case '1': return "~10";
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
        default: return "Invalid index";
    }
}; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_fnComponent = (await import('vue')).defineComponent({});
;
let __VLS_functionalComponentProps;
function __VLS_template() {
    const __VLS_ctx = {};
    const __VLS_localComponents = {
        ...{},
        ...{},
        ...__VLS_ctx,
    };
    let __VLS_components;
    const __VLS_localDirectives = {
        ...{},
        ...__VLS_ctx,
    };
    let __VLS_directives;
    let __VLS_styleScopedClasses;
    // CSS variable injection 
    // CSS variable injection end 
    let __VLS_resolvedLocalAndGlobalComponents;
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("wrapper") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("info") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("title") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("control-bar") }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({ ...{ onClick: (__VLS_ctx.start) }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({ ...{ onClick: (__VLS_ctx.procAnalyser) }, });
    __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("audio-wrapper") }, ...{ class: (({ active: __VLS_ctx.active })) }, });
    if (__VLS_ctx.active) {
        for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.showDataArray))) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ key: ((index)), ...{ style: (({
                        height: `${255 - item * 10}px`
                    })) }, ...{ class: ("audio-item") }, });
        }
    }
    else {
        __VLS_elementAsFunction(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({ ...{ class: ("result-wrapper") }, });
        __VLS_elementAsFunction(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({});
        for (const [item, index] of __VLS_getVForSourceType((__VLS_ctx.finalResult))) {
            __VLS_elementAsFunction(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({});
            (`頻率: ${__VLS_ctx.indexToAudio(item.index)}，次數: ${item.count}，佔比: ${item.persent}`);
        }
    }
    __VLS_styleScopedClasses['wrapper'];
    __VLS_styleScopedClasses['info'];
    __VLS_styleScopedClasses['title'];
    __VLS_styleScopedClasses['control-bar'];
    __VLS_styleScopedClasses['audio-wrapper'];
    __VLS_styleScopedClasses['active'];
    __VLS_styleScopedClasses['audio-item'];
    __VLS_styleScopedClasses['result-wrapper'];
    var __VLS_slots;
    var __VLS_inheritedAttrs;
    const __VLS_refs = {};
    var $refs;
    var $el;
    return {
        attrs: {},
        slots: __VLS_slots,
        refs: $refs,
        rootEl: $el,
    };
}
;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            showDataArray: showDataArray,
            active: active,
            start: start,
            finalResult: finalResult,
            procAnalyser: procAnalyser,
            indexToAudio: indexToAudio,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEl: {},
});
; /* PartiallyEnd: #4569/main.vue */
