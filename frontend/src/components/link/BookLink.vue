<script setup lang="ts">
import FormattedBook, { type BookToFormat } from '@/components/formatted/FormattedBook.vue'

const props = defineProps<{
  book: BookToFormat
}>()
</script>

<template>
  <RouterLink :to="{ name: 'singleBook', params: { bookId: props.book.id } }">
    <FormattedBook :book="props.book" />
  </RouterLink>
</template>
