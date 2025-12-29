<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Tables } from '@/gen/database'
import { supabase } from '@/lib/supabase.ts'
import CreateUpdateBookDialog from '@/dialogs/CreateUpdateBookDialog.vue'
import FormattedBookTitle from '@/components/FormattedBookTitle.vue'
import FormattedAuthorName from '@/components/FormattedAuthorName.vue'
import { pluralize } from '@/lib/util/text.ts'
import { useDebounceFn } from '@vueuse/core'
import BookGenreMultiSelect from '@/components/BookGenreMultiSelect.vue'
import BookSubgenreMultiSelect from '@/components/BookSubgenreMultiSelect.vue'
import BookTropeMultiSelect from '@/components/BookTropeMultiSelect.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

type PaginatedBook = Tables<'book'> & {
  author_created_book: Array<{
    author: Tables<'author'>
  }>
  book_has_book_genre: {
    book_genre: Tables<'book_genre'>
  }
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
const selectedBookGenres = ref<Array<Tables<'book_genre'>>>([])
const selectedBookSubgenres = ref<Array<Tables<'book_subgenre'>>>([])
const selectedBookTropes = ref<Array<Tables<'book_trope'>>>([])

async function getBooks() {
  books.value = null
  let query = supabase
    .from('book')
    .select(
      '*, author_created_book!inner(author!inner(*)), book_has_book_genre!inner(book_genre!inner(*)), book_has_book_subgenre!inner(book_subgenre!inner(*)), book_has_book_trope!inner(book_trope!inner(*))',
    )

  if (search.value) {
    query = query.ilike('title', `%${search.value}%`)
  }
  if (selectedBookGenres.value.length > 0) {
    query = query.in(
      'book_has_book_genre.book_genre.id',
      selectedBookGenres.value.map((genre) => genre.id),
    )
  }
  if (selectedBookSubgenres.value.length > 0) {
    query = query.in(
      'book_has_book_subgenre.book_subgenre.id',
      selectedBookSubgenres.value.map((subgenre) => subgenre.id),
    )
  }
  if (selectedBookTropes.value.length > 0) {
    query = query.in(
      'book_has_book_trope.book_trope.id',
      selectedBookTropes.value.map((trope) => trope.id),
    )
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

onMounted(async () => {
  await reload()

  const bookGenreId = route.query['bookGenreId'] as string | undefined
  if (bookGenreId) {
    const { data } = await supabase
      .from('book_genre')
      .select()
      .eq('id', bookGenreId)
      .single()
      .throwOnError()
    selectedBookGenres.value.push(data)
  }

  const bookSubgenreId = route.query['bookSubgenreId'] as string | undefined
  if (bookSubgenreId) {
    const { data } = await supabase
      .from('book_subgenre')
      .select()
      .eq('id', bookSubgenreId)
      .single()
      .throwOnError()
    selectedBookSubgenres.value.push(data)
  }

  const bookTropeId = route.query['bookTropeId'] as string | undefined
  if (bookTropeId) {
    const { data } = await supabase
      .from('book_trope')
      .select()
      .eq('id', bookTropeId)
      .single()
      .throwOnError()
    selectedBookTropes.value.push(data)
  }
})

watch(search, async () => {
  console.log('Search watch -> Debounced reload')
  await debouncedReload()
})

watch(
  [selectedBookGenres, selectedBookSubgenres, selectedBookTropes],
  async () => {
    console.log('Selected categories watch -> Reload')
    await reload()
  },
  { deep: true },
)

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
      <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
        <VoltInputText v-model="search" placeholder="Suche" class="col-span-1 md:col-span-3" />

        <BookGenreMultiSelect v-model="selectedBookGenres" placeholder="Nach Genres filtern" />
        <BookSubgenreMultiSelect
          v-model="selectedBookSubgenres"
          placeholder="Nach Subgenres filtern"
        />
        <BookTropeMultiSelect v-model="selectedBookTropes" placeholder="Nach Tropes filtern" />
      </div>

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
              <FormattedAuthorName
                v-for="{ author } in book.author_created_book"
                :key="author.id"
                :author="author"
              />
            </div>

            <div>
              <strong>Genre:</strong>
              <VoltButton
                :label="book.book_has_book_genre.book_genre.title"
                size="small"
                text
                @click="selectedBookGenres.push(book.book_has_book_genre.book_genre)"
              />
            </div>

            <div>
              <strong>
                {{ pluralize(book.book_has_book_subgenre.length, 'Subgenre', 'Subgenres') }}:
              </strong>
              <div class="flex flex-wrap">
                <VoltButton
                  v-for="{ book_subgenre: bookSubgenre } in book.book_has_book_subgenre"
                  :key="bookSubgenre.id"
                  :label="bookSubgenre.title"
                  size="small"
                  text
                  @click="selectedBookSubgenres.push(bookSubgenre)"
                />
              </div>
            </div>

            <div>
              <strong>
                {{ pluralize(book.book_has_book_trope.length, 'Trope', 'Tropes') }}:
              </strong>
              <div class="flex flex-wrap">
                <VoltButton
                  v-for="{ book_trope: bookTrope } in book.book_has_book_trope"
                  :key="bookTrope.id"
                  :label="bookTrope.title"
                  size="small"
                  text
                  @click="selectedBookTropes.push(bookTrope)"
                />
              </div>
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
