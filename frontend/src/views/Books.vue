<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Tables } from '@/gen/database'
import { supabase } from '@/lib/supabase.ts'

const firstIndexOfCurrentPage = ref<number>(0)
const booksPerPage = ref<number>(10)

const books = ref<Array<Tables<'book'>> | null>(null)
const numberTotalBooks = ref<number | null>(null)

async function getBooks() {
  console.log('Get books', {
    firstIndexOfCurrentPage: firstIndexOfCurrentPage.value,
    booksPerPage: booksPerPage.value,
  })
  const { data } = await supabase
    .from('book')
    .select('*')
    .range(firstIndexOfCurrentPage.value, firstIndexOfCurrentPage.value + booksPerPage.value - 1)
    .throwOnError()
  books.value = data
}

async function countBooks() {
  console.log('Count books')
  const { count } = await supabase.from('book').select('*', { count: 'exact' }).throwOnError()
  numberTotalBooks.value = count
}

onMounted(async () => {
  await Promise.all([getBooks(), countBooks()])
})

watch([firstIndexOfCurrentPage, booksPerPage], getBooks)
</script>

<template>
  <div v-if="books !== null && numberTotalBooks !== null">
    <div v-for="book in books" :key="book.id">
      {{ book.title }}
    </div>
    <div>
      <VoltPaginator
        v-model:first="firstIndexOfCurrentPage"
        v-model:rows="booksPerPage"
        :total-records="numberTotalBooks"
      />
    </div>
  </div>
</template>
