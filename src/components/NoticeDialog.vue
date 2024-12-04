<template>
  <dialog-wrapper
    :title="$t('app.title')"
    :suppress="true"
    width="800"
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
import { onBeforeMount, ref } from 'vue';
import DialogWrapper from '@/components/DialogWrapper.vue';
import { useSuppressDialog } from '@/composables/useSuppressDialog';

const { checkSuppressTime, setSuppressTime } = useSuppressDialog();
const showDialog = ref(false);

const dialogInit = () => {
  showDialog.value = checkSuppressTime('notice');
}

const updateSuppressSettings = ({ suppress, suppressSwitch }) => {
  if (suppress.value && suppressSwitch.value) {
    setSuppressTime('notice');
  }
}

onBeforeMount(() => {
  dialogInit();
})
</script>

<style lang="scss" scoped>

</style>