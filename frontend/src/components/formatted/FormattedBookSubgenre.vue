<script setup lang="ts">
import type { Tables } from '@/gen/database'
import { sumOfArray } from '@/lib/util/array.ts'

type BookSubgenreToFormat = Tables<'book_subgenre'> & {
  book_has_book_subgenre: Array<{ count: number }>
}

const props = defineProps<{
  bookSubgenre: BookSubgenreToFormat
}>()
</script>

<template>
  <span class="inline-flex">
    <span
      class="rounded-s-full bg-primary text-primary-contrast px-2 flex items-center justify-center"
    >
      {{ props.bookSubgenre.title }}
    </span>
    <span
      class="rounded-e-full bg-primary-contrast text-primary px-2 flex items-center justify-center"
    >
      {{ sumOfArray(props.bookSubgenre.book_has_book_subgenre.map((x) => x.count)) }}
    </span>
  </span>
</template>
