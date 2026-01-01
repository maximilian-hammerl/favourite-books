<script setup lang="ts">
import type { PaginatedBookSeries } from '@/views/AllBookSeries.vue'
import BookLink from '@/components/link/BookLink.vue'
import BookSeriesLink from '@/components/link/BookSeriesLink.vue'

const props = defineProps<{
  bookSeries: PaginatedBookSeries
}>()
</script>

<template>
  <VoltCard>
    <template #title>
      <div><BookSeriesLink :book-series="props.bookSeries" /></div>
    </template>
    <template #content>
      <VoltFieldset legend="Bücher">
        <ol class="list-inside list-decimal">
          <li v-for="{ book } in props.bookSeries.book_is_part_of_book_series" :key="book.id">
            <BookLink :book="book" />
          </li>
        </ol>
      </VoltFieldset>
    </template>
  </VoltCard>
</template>
