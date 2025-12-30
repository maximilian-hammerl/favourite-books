<script setup lang="ts">
import type { VoltRatingProps } from '@/volt/Rating.vue'

const rating = defineModel<number>({
  required: true,
  set(value) {
    return value ? value : 0
  },
})

const props = defineProps<
  VoltRatingProps & {
    onIcon?: string
    offIcon?: string
  }
>()
</script>

<template>
  <VoltRating v-bind="props" v-model="rating">
    <template #onicon>
      <i :class="props.onIcon ?? 'pi pi-star-fill'"></i>
    </template>
    <template #officon>
      <i :class="props.offIcon ?? 'pi pi-star'"></i>
    </template>
  </VoltRating>
</template>
