<script setup lang="ts">
import type { Tables } from '@/gen/database'
import { computed } from 'vue'
import { computeInitialsForTitle } from '@/lib/util/text.ts'

export type BookSeriesToFormat = Tables<'book_series'>

const props = defineProps<{
  bookSeries: BookSeriesToFormat
}>()

const initials = computed<string>(() => computeInitialsForTitle(props.bookSeries.title))
</script>

<template>
  <span class="inline-flex">
    <span
      class="rounded-s-full bg-primary text-primary-contrast px-2 flex items-center justify-center"
    >
      <i class="pi pi-list"></i>
    </span>
    <span
      class="border-y-2 border-primary bg-primary-contrast text-primary px-2 flex items-center justify-center"
    >
      {{ initials }}
    </span>
    <span
      class="rounded-e-full bg-primary text-primary-contrast px-2 flex items-center justify-center"
    >
      {{ props.bookSeries.title }}
    </span>
  </span>
</template>
