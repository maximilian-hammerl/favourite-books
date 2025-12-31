<script setup lang="ts">
import type { PaginatedBookSeries } from '@/views/AllBookSeries.vue'
import BookLink from '@/components/link/BookLink.vue'
import BookSeriesLink from '@/components/link/BookSeriesLink.vue'

const props = defineProps<{
  bookSeries: PaginatedBookSeries
}>()

const emit = defineEmits<{
  updateBookSeries: []
}>()
</script>

<template>
  <VoltCard>
    <template #title>
      <div><BookSeriesLink :book-series="props.bookSeries" /></div>
    </template>
    <template #content>
      <VoltFieldset legend="Bücher">
        <ol>
          <li v-for="{ book } in props.bookSeries.book_is_part_of_book_series" :key="book.id">
            <BookLink :book="book" />
          </li>
        </ol>
      </VoltFieldset>
    </template>
    <template #footer>
      <div class="flex justify-end">
        <VoltButton
          label="Buchreihe aktualisieren"
          text
          size="small"
          @click="emit('updateBookSeries')"
        />
      </div>
    </template>
  </VoltCard>
</template>
