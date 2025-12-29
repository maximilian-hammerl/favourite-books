<script setup lang="ts">
import { pluralize } from '@/lib/util/text.ts'
import FormattedBookTitle from '@/components/formatted/FormattedBookTitle.vue'
import type { PaginatedBookSeries } from '@/views/AllBookSeries.vue'
import FormattedBookSeriesTitle from '@/components/formatted/FormattedBookSeriesTitle.vue'

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
      <div>Buchreihe: <FormattedBookSeriesTitle :book-series="props.bookSeries" /></div>
    </template>
    <template #content>
      <div>
        <strong>
          {{ pluralize(bookSeries.book_is_part_of_book_series.length, 'Buch', 'Bücher') }}:
        </strong>
        <ol>
          <li v-for="{ book } in props.bookSeries.book_is_part_of_book_series" :key="book.id">
            <FormattedBookTitle :book="book" />
          </li>
        </ol>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end">
        <VoltButton
          label="Buchserie aktualisieren"
          text
          size="small"
          @click="emit('updateBookSeries')"
        />
      </div>
    </template>
  </VoltCard>
</template>
