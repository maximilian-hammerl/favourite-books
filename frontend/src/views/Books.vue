<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Tables } from '@/gen/database'
import { supabase } from '@/lib/supabase.ts'

const currentPage = ref<number>(0)
const booksPerPage = ref<number>(10)

const books = ref<Array<Tables<'book'>>>([])
const numberTotalBooks = ref<number | null>(null)

async function fetchBooks() {
  const { data } = await supabase
    .from('book')
    .select('*')
    .range(currentPage.value * booksPerPage.value, (currentPage.value + 1) * booksPerPage.value - 1)
    .throwOnError()
  books.value = data
}

onMounted(fetchBooks)
</script>

<template>
  <div>
    <div v-for="book in books" :key="book.id">
      {{ book.title }}
    </div>
    <div>
      <VoltPaginator
        v-model:first="currentPage"
        v-model:rows="booksPerPage"
        :total-records="numberTotalBooks"
      />
    </div>
  </div>
</template>
