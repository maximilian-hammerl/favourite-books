<script setup lang="ts">
import FormattedBook, { type BookToFormat } from '@/components/formatted/FormattedBook.vue'
import BookSelect from '@/components/select/BookSelect.vue'
import type { Tables } from '@/gen/database'
import { ref } from 'vue'

type BookSeries = Pick<Tables<'book_series'>, 'title'>

const bookSeries = defineModel<BookSeries>('bookSeries', { required: true })

const booksInSeries = defineModel<Array<BookToFormat>>('booksInSeries', { required: true })

function swapBooks(first: number, second: number) {
  const firstBook = booksInSeries.value[first]!
  booksInSeries.value[first] = booksInSeries.value[second]!
  booksInSeries.value[second] = firstBook
}

const bookToAddToSeries = ref<BookToFormat | null>(null)

function addBookToSeries() {
  if (bookToAddToSeries.value === null) {
    throw new Error('No book selected to add to series')
  }
  booksInSeries.value.push(bookToAddToSeries.value)
  bookToAddToSeries.value = null
}
</script>

<template>
  <div>
    <label for="title">Titel</label>
    <VoltInputText id="title" v-model="bookSeries.title" required fluid autofocus />
  </div>

  <VoltDivider />

  <div>
    <strong>Bücher:</strong>
    <ol class="list-inside list-decimal">
      <li v-for="(book, index) in booksInSeries" :key="book.id">
        <span class="inline-flex gap-2">
          <FormattedBook :book="book" class="flew-grow" />
          <VoltButtonGroup class="flex-none">
            <VoltButton
              icon="pi pi-sort-up-fill"
              size="small"
              :disabled="index === 0"
              @click="swapBooks(index, index - 1)"
            />
            <VoltButton
              icon="pi pi-sort-down-fill"
              size="small"
              :disabled="index === booksInSeries.length - 1"
              @click="swapBooks(index, index + 1)"
            />
          </VoltButtonGroup>
        </span>
      </li>
    </ol>
  </div>

  <div class="flex gap-2">
    <BookSelect v-model="bookToAddToSeries" class="flex-grow" />
    <VoltButton
      label="Zur Reihe hinzufügen"
      icon="pi pi-plus"
      size="small"
      :disabled="bookToAddToSeries === null"
      class="flex-none"
      @click="addBookToSeries()"
    />
  </div>
</template>
