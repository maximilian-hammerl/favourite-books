<script setup lang="ts">
import { ref, watch } from 'vue'
import type { VoltInplaceProps } from '@/volt/Inplace.vue'

const modelValue = defineModel<string>({ required: true })

const props = defineProps<VoltInplaceProps>()

const emit = defineEmits<{
  save: [string]
}>()

const clonedModelValue = ref<string>('')

watch(
  modelValue,
  (newValue) => {
    clonedModelValue.value = newValue
  },
  { immediate: true },
)

function onCancel(closeCallback: () => void) {
  clonedModelValue.value = modelValue.value
  closeCallback()
}

function onSave(closeCallback: () => void) {
  emit('save', clonedModelValue.value)
  modelValue.value = clonedModelValue.value
  closeCallback()
}
</script>

<template>
  <VoltInplace v-bind="props">
    <template #display>
      {{ modelValue }}
    </template>
    <template #content="{ closeCallback }">
      <VoltInputText v-model="clonedModelValue" fluid />
      <div class="mt-2 flex flex-wrap gap-2 justify-end">
        <VoltButton label="Abbrechen" size="small" outlined @click="onCancel(closeCallback)" />
        <VoltButton label="Speichern" size="small" @click="onSave(closeCallback)" />
      </div>
    </template>
  </VoltInplace>
</template>
