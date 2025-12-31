<script setup lang="ts">
import { pluralize } from '@/lib/util/text.ts'
import type { PaginatedBook } from '@/views/AllBooks.vue'
import type { Tables } from '@/gen/database'
import BookSeriesLink from '@/components/link/BookSeriesLink.vue'
import AuthorLink from '@/components/link/AuthorLink.vue'
import BookLink from '@/components/link/BookLink.vue'

const props = defineProps<{
  book: PaginatedBook
}>()

const emit = defineEmits<{
  updateBook: []
  deleteBook: []
  reviewBook: []
  addBookGenreFilter: [Tables<'book_genre'>]
  addBookSubgenreFilter: [Tables<'book_subgenre'>]
  addBookTropeFilter: [Tables<'book_trope'>]
}>()
</script>

<template>
  <VoltCard>
    <template #title>
      <div class="flex flex-wrap justify-between items-center gap-2">
        <div><BookLink :book="props.book" /></div>

        <VoltButton label="Reviewen" @click="emit('reviewBook')" size="small" />
      </div>
    </template>
    <template v-if="book.subtitle" #subtitle>
      {{ props.book.subtitle }}
    </template>
    <template #content>
      <div class="flex flex-col gap-2">
        <div
          v-if="props.book.author_created_book.length > 0"
          class="flex flex-wrap items-center gap-2"
        >
          <strong>
            {{ pluralize(props.book.author_created_book.length, 'Autor', 'Autoren') }}:
          </strong>

          <AuthorLink
            v-for="{ author } in props.book.author_created_book"
            :key="author.id"
            :author="author"
          />
        </div>

        <div
          v-if="props.book.book_is_part_of_book_series.length > 0"
          class="flex flex-wrap items-center gap-2"
        >
          <strong>
            {{
              pluralize(props.book.book_is_part_of_book_series.length, 'Buchreihe', 'Buchreihen')
            }}:
          </strong>
          <span
            v-for="{ number_in_series: numberInSeries, book_series: bookSeries } in props.book
              .book_is_part_of_book_series"
            :key="bookSeries.id"
          >
            <BookSeriesLink :book-series="bookSeries" />
            ({{ numberInSeries }}. Teil)
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          <VoltFieldset legend="Genre">
            <VoltButton
              :label="props.book.book_has_book_genre.book_genre.title"
              size="small"
              text
              @click="emit('addBookGenreFilter', props.book.book_has_book_genre.book_genre)"
            />
          </VoltFieldset>

          <VoltFieldset legend="Subgenres">
            <div class="flex flex-wrap">
              <VoltButton
                v-for="{ book_subgenre: bookSubgenre } in props.book.book_has_book_subgenre"
                :key="bookSubgenre.id"
                :label="bookSubgenre.title"
                size="small"
                text
                @click="emit('addBookSubgenreFilter', bookSubgenre)"
              />
            </div>
          </VoltFieldset>

          <VoltFieldset legend="Tropes" class="col-span-1 md:col-span-2">
            <div class="flex flex-wrap">
              <VoltButton
                v-for="{ book_trope: bookTrope } in props.book.book_has_book_trope"
                :key="bookTrope.id"
                :label="bookTrope.title"
                size="small"
                text
                @click="emit('addBookTropeFilter', bookTrope)"
              />
            </div>
          </VoltFieldset>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <VoltDangerButton label="Buch löschen" text size="small" @click="emit('deleteBook')" />
        <VoltButton label="Buch aktualisieren" text size="small" @click="emit('updateBook')" />
      </div>
    </template>
  </VoltCard>
</template>
