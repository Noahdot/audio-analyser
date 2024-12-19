<template>
  <el-dialog
    v-model="showDialog"
    :width="props.width"
    center
  >
    <template #header>
      {{ props.title }}
    </template>

    <slot></slot>

    <template #footer>
      <el-checkbox
        v-if="props.suppress"
        v-model="suppressSwitch"
        :label="$t('dialog.dont_show_again')"
      />
      <br>
      <el-button @click="closeDialog">{{ $t('button.confirm') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
const props = defineProps({
  title: String,
  width: {
    type: String,
    default: '500'
  },
  suppress: {
    type: Boolean,
    default: false
  },
});

const emits = defineEmits([
  'update:suppressSettings'
]);

const showDialog = defineModel('showDialog');
const suppress = ref(props.suppress);
const suppressSwitch = ref(false);

const closeDialog = () => {
  showDialog.value = false;
  emits('update:suppressSettings', { suppress, suppressSwitch });
}

</script>

<style lang="scss" scoped>

</style>