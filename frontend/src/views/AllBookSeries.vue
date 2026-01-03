<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Tables } from '@/gen/database'
import { supabase } from '@/lib/supabase.ts'
import BookSeriesOverviewCard from '@/components/card/BookSeriesOverviewCard.vue'
import CreateBookSeriesDialog from '@/dialogs/book-series/CreateBookSeriesDialog.vue'

export type PaginatedBookSeries = Tables<'book_series'> & {
  book_is_part_of_book_series: Array<{
    book: Tables<'book'> & {
      user_reviewed_book: Array<Tables<'user_reviewed_book'>>
    }
  }>
}

const firstIndexOfCurrentPage = ref<number>(0)
const bookSeriessPerPage = ref<number>(10)

const bookSeriess = ref<Array<PaginatedBookSeries> | null>(null)
const numberTotalBookSeriess = ref<number | null>(null)

async function getBookSeriess() {
  const { data } = await supabase
    .from('book_series')
    .select('*, book_is_part_of_book_series(book(*, user_reviewed_book(*)))')
    .order('created_at', { ascending: false })
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

function createBookSeries() {
  isCreateUpdateBookSeriesDialogVisible.value = true
}
</script>

<template>
  <div class="w-full">
    <div class="flex justify-between mb-4">
      <h1>Buchreihen</h1>

      <VoltButton
        label="Buchreihe anlegen"
        icon="pi pi-plus"
        size="small"
        @click="createBookSeries()"
      />
    </div>

    <div v-if="bookSeriess === null || numberTotalBookSeriess === null" class="flex flex-col gap-4">
      <VoltSkeleton v-for="i in bookSeriessPerPage" :key="i" height="6rem" />
    </div>

    <div v-else class="flex flex-col gap-4">
      <VoltInputText placeholder="Suche" />

      <BookSeriesOverviewCard
        v-for="bookSeries in bookSeriess"
        :key="bookSeries.id"
        :book-series="bookSeries"
      />

      <div>
        <VoltPaginator
          v-model:first="firstIndexOfCurrentPage"
          v-model:rows="bookSeriessPerPage"
          :total-records="numberTotalBookSeriess"
        />
      </div>
    </div>
  </div>

  <CreateBookSeriesDialog
    v-model:visible="isCreateUpdateBookSeriesDialogVisible"
    @book-series-created="reload()"
  />
</template>
