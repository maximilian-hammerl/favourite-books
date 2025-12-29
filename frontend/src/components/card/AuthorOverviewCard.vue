<script setup lang="ts">
import FormattedBookTitle from '@/components/formatted/FormattedBookTitle.vue'
import FormattedAuthorName from '@/components/formatted/FormattedAuthorName.vue'
import type { PaginatedAuthor } from '@/views/AllAuthors.vue'
import type { Tables } from '@/gen/database'
import { computed } from 'vue'
import FormattedBookSeriesTitle from '@/components/formatted/FormattedBookSeriesTitle.vue'
import { sortByAttribute } from '@/lib/util/array.ts'

const props = defineProps<{
  author: PaginatedAuthor
}>()

const emit = defineEmits<{
  updateAuthor: []
}>()

type BookSeries = Tables<'book_series'> & {
  books: Array<Tables<'book'> & Pick<Tables<'book_is_part_of_book_series'>, 'number_in_series'>>
}

const bookSeriess = computed<Array<BookSeries>>(() => {
  const seriess: Array<BookSeries> = []

  for (const { book } of props.author.author_created_book) {
    if (book.book_is_part_of_book_series.length === 0) {
      continue
    }

    for (const {
      number_in_series: numberInSeries,
      book_series: bookSeries,
    } of book.book_is_part_of_book_series) {
      const existingBookSeries = seriess.find((x) => x.id === bookSeries.id)
      if (existingBookSeries !== undefined) {
        existingBookSeries.books.push({
          ...book,
          number_in_series: numberInSeries,
        })
      } else {
        seriess.push({
          ...bookSeries,
          books: [
            {
              ...book,
              number_in_series: numberInSeries,
            },
          ],
        })
      }
    }
  }

  for (const series of seriess) {
    series.books = sortByAttribute(series.books, 'number_in_series')
  }

  return sortByAttribute(seriess, 'title')
})

const booksWithoutSeries = computed<Array<Tables<'book'>>>(() =>
  props.author.author_created_book
    .map((x) => x.book)
    .filter((x) => x.book_is_part_of_book_series.length === 0),
)
</script>

<template>
  <VoltCard>
    <template #title> Autor: <FormattedAuthorName :author="props.author" /> </template>
    <template #content>
      <div v-if="bookSeriess.length > 0">
        <strong>Bücherreihen:</strong>
        <ul>
          <li v-for="bookSeries in bookSeriess" :key="bookSeries.id">
            <FormattedBookSeriesTitle :book-series="bookSeries" />
            <ol class="ml-4">
              <li v-for="book in bookSeries.books" :key="book.id">
                <FormattedBookTitle :book="book" />
              </li>
            </ol>
          </li>
        </ul>
      </div>
      <div v-if="booksWithoutSeries.length > 0">
        <strong>Bücher:</strong>
        <ul>
          <li v-for="book in booksWithoutSeries" :key="book.id">
            <FormattedBookTitle :book="book" />
          </li>
        </ul>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end">
        <VoltButton label="Autor aktualisieren" text size="small" @click="emit('updateAuthor')" />
      </div>
    </template>
  </VoltCard>
</template>
