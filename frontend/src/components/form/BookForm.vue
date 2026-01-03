<script setup lang="ts">
import BookTropeMultiSelect from '@/components/BookTropeMultiSelect.vue'
import AuthorMultiSelect from '@/components/AuthorMultiSelect.vue'
import BookGenreSelect from '@/components/BookGenreSelect.vue'
import BookSubgenreMultiSelect from '@/components/BookSubgenreMultiSelect.vue'
import type { Tables } from '@/gen/database'

type Book = Pick<Tables<'book'>, 'title' | 'subtitle' | 'blurb'>

const book = defineModel<Book>('book', { required: true })
const authors = defineModel<Array<Tables<'author'>>>('authors', { required: true })
const bookGenre = defineModel<Tables<'book_genre'> | null>('bookGenre', { required: true })
const bookSubgenres = defineModel<Array<Tables<'book_subgenre'>>>('bookSubgenres', {
  required: true,
})
const bookTropes = defineModel<Array<Tables<'book_trope'>>>('bookTropes', { required: true })
</script>

<template>
  <div>
    <label for="book-title">Titel</label>
    <VoltInputText id="book-title" v-model="book.title" required fluid autofocus />
  </div>

  <div>
    <label for="book-title">Subtitel (optional)</label>
    <VoltInputText id="book-title" v-model="book.subtitle" fluid />
  </div>

  <VoltDivider />

  <div>
    <label for="authors">Autoren</label>
    <AuthorMultiSelect
      id="authors"
      v-model="authors"
      placeholder="Wähle einen oder mehrere Autoren aus"
    />
  </div>

  <VoltDivider />

  <div>
    <label for="book-title">Blurb (optional)</label>
    <VoltTextarea id="book-title" v-model="book.blurb" fluid auto-resize :rows="5" />
  </div>

  <VoltDivider />

  <div>
    <label for="book-genre">Genre</label>
    <BookGenreSelect id="book-genre" v-model="bookGenre" placeholder="Wähle ein Buch-Genre aus" />
  </div>

  <div>
    <label for="book-subgenres">Subgenres</label>
    <BookSubgenreMultiSelect
      id="book-subgenres"
      v-model="bookSubgenres"
      placeholder="Wähle ein oder mehrere Buch-Subgenres aus"
    />
  </div>

  <div>
    <label for="book-tropes">Tropes</label>
    <BookTropeMultiSelect
      id="book-tropes"
      v-model="bookTropes"
      placeholder="Wähle ein oder mehrere Buch-Tropes aus"
    />
  </div>
</template>
