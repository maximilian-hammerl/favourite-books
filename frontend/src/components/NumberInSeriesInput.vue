<script setup lang="ts">
import type { VoltInputNumberProps } from '@/volt/InputNumber.vue'

const numberInSeries = defineModel<number | null>({ required: true })

const props = defineProps<VoltInputNumberProps>()
</script>

<template>
  <VoltInputNumber
    v-bind="props"
    v-model="numberInSeries"
    :min="1"
    locale="de-DE"
    prefix="Nummer "
  />
</template>
