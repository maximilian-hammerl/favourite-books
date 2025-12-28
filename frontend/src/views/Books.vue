<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Tables } from '@/gen/database'
import { supabase } from '@/lib/supabase.ts'
import CreateBookDialog from '@/dialogs/CreateBookDialog.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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
    .select()
    .range(firstIndexOfCurrentPage.value, firstIndexOfCurrentPage.value + booksPerPage.value - 1)
    .throwOnError()
  books.value = data
}

async function countBooks() {
  console.log('Count books')
  const { count } = await supabase.from('book').select('*', { count: 'exact' }).throwOnError()
  numberTotalBooks.value = count
}

async function reload() {
  await Promise.all([getBooks(), countBooks()])
}

onMounted(reload)

watch([firstIndexOfCurrentPage, booksPerPage], getBooks)

const isCreateBookDialogVisible = ref<boolean>(false)

async function onBookCreated(newBook: Tables<'book'>) {
  await router.push({
    name: 'book',
    params: { bookId: newBook.id },
  })
}
</script>

<template>
  <div class="w-full">
    <div class="flex justify-between mb-4">
      <h1>Books</h1>

      <VoltButton label="Create new book" size="small" @click="isCreateBookDialogVisible = true" />
    </div>

    <div v-if="books === null || numberTotalBooks === null" class="flex flex-col gap-4">
      <VoltSkeleton v-for="i in booksPerPage" :key="i" height="6rem" />
    </div>

    <div v-else class="flex flex-col gap-4">
      <VoltCard v-for="book in books" :key="book.id">
        <template #title>
          <RouterLink :to="{ name: 'book', params: { bookId: book.id } }">
            {{ book.title }}
          </RouterLink>
        </template>
        <template #content>
          <p>Created at: {{ book.created_at }}</p>
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

  <CreateBookDialog v-model:visible="isCreateBookDialogVisible" @book-created="onBookCreated" />
</template>
