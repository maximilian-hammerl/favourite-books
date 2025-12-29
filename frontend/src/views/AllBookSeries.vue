<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Tables } from '@/gen/database'
import { supabase } from '@/lib/supabase.ts'
import CreateUpdateBookSeriesDialog from '@/dialogs/CreateUpdateBookSeriesDialog.vue'
import { pluralize } from '@/lib/util/text.ts'
import FormattedBookTitle from '@/components/FormattedBookTitle.vue'

type PaginatedBookSeries = Tables<'book_series'> & {
  book_is_part_of_book_series: Array<{
    book: Tables<'book'>
  }>
}

const firstIndexOfCurrentPage = ref<number>(0)
const bookSeriessPerPage = ref<number>(10)

const bookSeriess = ref<Array<PaginatedBookSeries> | null>(null)
const numberTotalBookSeriess = ref<number | null>(null)

async function getBookSeriess() {
  const { data } = await supabase
    .from('book_series')
    .select('*, book_is_part_of_book_series(book(*))')
    .order('title')
    .order('title', { referencedTable: 'book_is_part_of_book_series.book' })
    .range(
      firstIndexOfCurrentPage.value,
      firstIndexOfCurrentPage.value + bookSeriessPerPage.value - 1,
    )
    .throwOnError()
  bookSeriess.value = data
}

async function countBookSeriess() {
  const { count } = await supabase
    .from('book_series')
    .select('*', { count: 'exact' })
    .throwOnError()
  numberTotalBookSeriess.value = count
}

async function reload() {
  await Promise.all([getBookSeriess(), countBookSeriess()])
}

onMounted(reload)

watch([firstIndexOfCurrentPage, bookSeriessPerPage], getBookSeriess)

const isCreateUpdateBookSeriesDialogVisible = ref<boolean>(false)
const bookSeriesIdToUpdate = ref<string | null>(null)

function createBookSeries() {
  bookSeriesIdToUpdate.value = null
  isCreateUpdateBookSeriesDialogVisible.value = true
}

function updateBookSeries(bookSeries: Tables<'book_series'>) {
  bookSeriesIdToUpdate.value = bookSeries.id
  isCreateUpdateBookSeriesDialogVisible.value = true
}
</script>

<template>
  <div class="w-full">
    <div class="flex justify-between mb-4">
      <h1>Buchreihen</h1>

      <VoltButton label="Buchreihe anlegen" size="small" @click="createBookSeries()" />
    </div>

    <div v-if="bookSeriess === null || numberTotalBookSeriess === null" class="flex flex-col gap-4">
      <VoltSkeleton v-for="i in bookSeriessPerPage" :key="i" height="6rem" />
    </div>

    <div v-else class="flex flex-col gap-4">
      <VoltInputText placeholder="Suche" />

      <VoltCard v-for="bookSeries in bookSeriess" :key="bookSeries.id">
        <template #title>
          <RouterLink :to="{ name: 'singleBookSeries', params: { bookSeriesId: bookSeries.id } }">
            {{ bookSeries.title }}
          </RouterLink>
        </template>
        <template #content>
          <div>
            <strong>
              {{ pluralize(bookSeries.book_is_part_of_book_series.length, 'Buch', 'Bücher') }}:
            </strong>
            <ul>
              <li v-for="{ book } in bookSeries.book_is_part_of_book_series" :key="book.id">
                <RouterLink :to="{ name: 'singleBook', params: { bookId: book.id } }">
                  <FormattedBookTitle :book="book" />
                </RouterLink>
              </li>
            </ul>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-end">
            <VoltButton
              label="Buchserie aktualisieren"
              text
              size="small"
              @click="updateBookSeries(bookSeries)"
            />
          </div>
        </template>
      </VoltCard>
      <div>
        <VoltPaginator
          v-model:first="firstIndexOfCurrentPage"
          v-model:rows="bookSeriessPerPage"
          :total-records="numberTotalBookSeriess"
        />
      </div>
    </div>
  </div>

  <CreateUpdateBookSeriesDialog
    v-model:visible="isCreateUpdateBookSeriesDialogVisible"
    :book-series-id-to-update="bookSeriesIdToUpdate"
    @book-series-created-or-updated="reload()"
  />
</template>
