<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Tables } from '@/gen/database'
import { supabase } from '@/lib/supabase.ts'
import CreateUpdateBookDialog from '@/dialogs/CreateUpdateBookDialog.vue'
import FormattedBookTitle from '@/components/FormattedBookTitle.vue'
import FormattedAuthorName from '@/components/FormattedAuthorName.vue'
import { pluralize } from '@/lib/util/text.ts'
import { useDebounceFn } from '@vueuse/core'

type PaginatedBook = Tables<'book'> & {
  author_created_book: Array<{
    author: Tables<'author'>
  }>
  book_has_book_genre: {
    book_genre: Tables<'book_genre'>
  } | null
  book_has_book_subgenre: Array<{
    book_subgenre: Tables<'book_subgenre'>
  }>
  book_has_book_trope: Array<{
    book_trope: Tables<'book_trope'>
  }>
}

const firstIndexOfCurrentPage = ref<number>(0)
const booksPerPage = ref<number>(10)

const books = ref<Array<PaginatedBook> | null>(null)
const numberTotalBooks = ref<number | null>(null)

const search = ref<string>('')

async function getBooks() {
  books.value = null
  let query = supabase
    .from('book')
    .select(
      '*, author_created_book(author(*)), book_has_book_genre(book_genre(*)), book_has_book_subgenre(book_subgenre(*)), book_has_book_trope(book_trope(*))',
    )

  if (search.value) {
    query = query.ilike('title', `%${search.value}%`)
  }

  const { data } = await query
    .order('title')
    .range(firstIndexOfCurrentPage.value, firstIndexOfCurrentPage.value + booksPerPage.value - 1)
    .throwOnError()
  books.value = data
}

async function countBooks() {
  numberTotalBooks.value = null
  const { count } = await supabase.from('book').select('*', { count: 'exact' }).throwOnError()
  numberTotalBooks.value = count
}

async function reload() {
  await Promise.all([getBooks(), countBooks()])
}

const debouncedReload = useDebounceFn(reload, 1000)

onMounted(reload)

watch(search, debouncedReload)

watch([firstIndexOfCurrentPage, booksPerPage], getBooks)

const isCreateUpdateBookDialogVisible = ref<boolean>(false)
const bookIdToUpdate = ref<string | null>(null)

function createBook() {
  bookIdToUpdate.value = null
  isCreateUpdateBookDialogVisible.value = true
}

function updateBook(book: Tables<'book'>) {
  bookIdToUpdate.value = book.id
  isCreateUpdateBookDialogVisible.value = true
}
</script>

<template>
  <div class="w-full">
    <div class="flex justify-between mb-4">
      <h1>Bücher</h1>

      <VoltButton label="Buch erstellen" size="small" @click="createBook()" />
    </div>

    <div v-if="books === null || numberTotalBooks === null" class="flex flex-col gap-4">
      <VoltSkeleton v-for="i in booksPerPage" :key="i" height="6rem" />
    </div>

    <div v-else class="flex flex-col gap-4">
      <VoltInputText v-model="search" placeholder="Suche" />

      <VoltCard v-for="book in books" :key="book.id">
        <template #title>
          <FormattedBookTitle :book="book" />
        </template>
        <template v-if="book.subtitle" #subtitle>
          {{ book.subtitle }}
        </template>
        <template #content>
          <div class="flex flex-col gap-2">
            <div>
              <strong>
                {{ pluralize(book.author_created_book.length, 'Autor', 'Autoren') }}:
              </strong>
              <span v-for="({ author }, index) in book.author_created_book" :key="author.id">
                <FormattedAuthorName :author="author" />
                <span v-if="index !== book.author_created_book.length - 1">, </span>
              </span>
            </div>

            <div>
              <strong>Genre:</strong>
              {{ book.book_has_book_genre?.book_genre.title }}
            </div>

            <div>
              <strong>
                {{ pluralize(book.book_has_book_subgenre.length, 'Subgenre', 'Subgenres') }}:
              </strong>
              <span
                v-for="({ book_subgenre: bookSubgenre }, index) in book.book_has_book_subgenre"
                :key="bookSubgenre.id"
              >
                {{ bookSubgenre.title }}
                <span v-if="index !== book.book_has_book_subgenre.length - 1">, </span>
              </span>
            </div>

            <div>
              <strong>
                {{ pluralize(book.book_has_book_trope.length, 'Trope', 'Tropes') }}:
              </strong>
              <span
                v-for="({ book_trope: bookTrope }, index) in book.book_has_book_trope"
                :key="bookTrope.id"
              >
                {{ bookTrope.title }}
                <span v-if="index !== book.book_has_book_trope.length - 1">, </span>
              </span>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-end">
            <VoltButton label="Buch aktualisieren" text size="small" @click="updateBook(book)" />
          </div>
        </template>
      </VoltCard>
      <div>
        <VoltPaginator
          v-model:first="firstIndexOfCurrentPage"
          v-model:rows="booksPerPage"
          :total-records="numberTotalBooks"
        />
      </div>
    </div>
  </div>

  <CreateUpdateBookDialog
    v-model:visible="isCreateUpdateBookDialogVisible"
    :book-id-to-update="bookIdToUpdate"
    @book-created-or-updated="reload()"
  />
</template>
