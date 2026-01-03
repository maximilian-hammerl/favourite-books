<script setup lang="ts">
import type { Tables } from '@/gen/database'
import { sumOfArray } from '@/lib/util/array.ts'

export type BookGenreToFormat = Tables<'book_genre'> & {
  book_has_book_genre: Array<{ count: number }>
}

const props = defineProps<{
  bookGenre: BookGenreToFormat
}>()
</script>

<template>
  <span class="inline-flex">
    <span
      class="rounded-s-full bg-primary text-primary-contrast px-2 flex items-center justify-center"
    >
      {{ props.bookGenre.title }}
    </span>
    <span
      class="rounded-e-full bg-primary-contrast text-primary px-2 flex items-center justify-center"
    >
      {{ sumOfArray(props.bookGenre.book_has_book_genre.map((x) => x.count)) }}
    </span>
  </span>
</template>
