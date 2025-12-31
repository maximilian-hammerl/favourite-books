<script setup lang="ts">
import FormattedBook from '@/components/formatted/FormattedBook.vue'
import type { PaginatedBookSeries } from '@/views/AllBookSeries.vue'
import FormattedBookSeries from '@/components/formatted/FormattedBookSeries.vue'

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
      <div><FormattedBookSeries :book-series="props.bookSeries" /></div>
    </template>
    <template #content>
      <VoltFieldset legend="Bücher">
        <ol>
          <li v-for="{ book } in props.bookSeries.book_is_part_of_book_series" :key="book.id">
            <FormattedBook :book="book" />
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
