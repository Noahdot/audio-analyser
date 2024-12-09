<template>
  <div class="wrapper">
    <div class="control-bar">
      <button @click="start" :disabled="active">{{ $t('button.start') }}</button>
      <button @click="stop" :disabled="!active">{{ $t('button.stop') }}</button>
      <div class="settings-panel">
        <el-dropdown @command="handleCommand">
          <MaterialSymbolsLanguage class="icon-lang" />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="en">English</el-dropdown-item>
              <el-dropdown-item command="zh-CN">简中</el-dropdown-item>
              <el-dropdown-item command="zh-TW">繁中</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <MaterialSymbolsInfoOutline class="icon-info" @click="showDialog" />
      </div>
    </div>
    <div class="result-wrapper" v-if="showResult">
      <AnalyserResult :data="analyserData" :final-result="finalResult" />
    </div>
    <div class="audio-wrapper" v-else :class="{ active }">
      <div
        v-for="(item, index) in showDataArray"
        :key="index"
        :style="{ height: `${255 - item}px` }"
        class="audio-item"
      ></div>
    </div>
  </div>
  <NoticeDialog ref="noticeDialogRef" />
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import NoticeDialog from '@/components/NoticeDialog.vue';
import AnalyserResult from '@/components/AnalyserResult.vue';
import MaterialSymbolsLanguage from '~icons/material-symbols/language';
import MaterialSymbolsInfoOutline from '~icons/material-symbols/info-outline';

import { useAudioAnalyser } from '@/composables/useAudioAnalyser';
const { startAudioCapture, stopAudioCapture, originAudioData } = useAudioAnalyser();

const active = ref(false);
const showResult = ref(false);

const showDataArray = ref([]);
const analyserData = ref([]);
const finalResult = ref([]);
const noticeDialogRef = ref();
const showDialog = () => {
  noticeDialogRef.value.showDialogFromParent();
}


watch(originAudioData, (value) => {
  showDataArray.value = value;
}, { deep: true });

const start  = () => {
  showResult.value = false;
  startAudioCapture();

  setTimeout(() => {
    active.value = true;
  }, 100);
}

const stop = () => {
  try {
    const { analyserData: data, parsedData } = stopAudioCapture();
    analyserData.value = data.value;
    finalResult.value = parsedData;
  } catch (err) {
    console.log(err);
  }

  active.value = false;
  showResult.value = true;
}

import { useI18n } from 'vue-i18n';
const { locale } = useI18n();
const handleCommand = (command) => {
  locale.value = command;
  localStorage.setItem('locale', command);
}

</script>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;

  .control-bar {
    width: 1024px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    & button {
      margin: 1rem;
    }

    .settings-panel {
      position: absolute;
      top: 0px;
      right: 0px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .el-dropdown {
        margin: 0 1rem;

        & * {
          outline: none;
        }
      }

      .icon-lang, .icon-info {
        width: 24px;
        height: auto;
        color: #686868;
        cursor: pointer;
      }
    }
  }

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

    & > .audio-item {
      width: calc(100% / 24);
      height: 255px;
      background-color: #333;
    }

    .result-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .result-wrapper {
    width: 1024px;
    background-color: #333;
  }
}
</style>
