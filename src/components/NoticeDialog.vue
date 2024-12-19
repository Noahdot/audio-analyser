<template>
  <dialog-wrapper
    :title="$t('app.title')"
    :suppress="true"
    :width="dynamicWidth"
    @update:suppress-settings="updateSuppressSettings"
    v-model:show-dialog="showDialog"
  >
    <ul>
      <li>{{ $t('app.description_1') }}</li>
      <li>{{ $t('app.description_2') }}</li>
      <li>{{ $t('app.description_3') }}</li>
    </ul>
  </dialog-wrapper>
</template>

<script setup lang="ts">
import { useSuppressDialog } from '@/composables/useSuppressDialog';

const { checkSuppressTime, setSuppressTime, removeSuppressTime } = useSuppressDialog();
const showDialog = ref<boolean>(false);
const dynamicWidth = ref<string>('800')

const dialogInit = () => {
  showDialog.value = checkSuppressTime('notice');
  dynamicWidth.value = window.innerWidth > 800 ? '800' : '90%';
}

const updateSuppressSettings = ({ suppress, suppressSwitch }) => {
  if (suppress.value && suppressSwitch.value) {
    setSuppressTime('notice');
  }
}

const showDialogFromParent = () => {
  removeSuppressTime('notice');
  dialogInit();
}

defineExpose({
  showDialogFromParent
});

onBeforeMount(() => {
  dialogInit();
})
</script>

<style lang="scss" scoped>

</style>