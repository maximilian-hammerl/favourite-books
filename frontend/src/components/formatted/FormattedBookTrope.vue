<script setup lang="ts">
import type { Tables } from '@/gen/database'
import { sumOfArray } from '@/lib/util/array.ts'

export type BookTropeToFormat = Tables<'book_trope'> & {
  book_has_book_trope: Array<{ count: number }>
}

const props = defineProps<{
  bookTrope: BookTropeToFormat
}>()
</script>

<template>
  <span class="inline-flex">
    <span
      class="rounded-s-full bg-primary text-primary-contrast px-2 flex items-center justify-center"
    >
      {{ props.bookTrope.title }}
    </span>
    <span
      class="rounded-e-full bg-primary-contrast text-primary px-2 flex items-center justify-center"
    >
      {{ sumOfArray(props.bookTrope.book_has_book_trope.map((x) => x.count)) }}
    </span>
  </span>
</template>
