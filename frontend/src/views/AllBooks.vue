<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Tables } from '@/gen/database'
import { supabase } from '@/lib/supabase.ts'
import CreateUpdateBookDialog from '@/dialogs/CreateUpdateBookDialog.vue'
import FormattedBookTitle from '@/components/FormattedBookTitle.vue'

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
      <VoltInputText placeholder="Suche" />

      <VoltCard v-for="book in books" :key="book.id">
        <template #title>
          <RouterLink :to="{ name: 'singleBook', params: { bookId: book.id } }">
            <FormattedBookTitle :book="book" />
          </RouterLink>
        </template>
        <template #content>
          <p>Erstellt am: {{ book.created_at }}</p>
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
    @book-created="reload()"
    @book-updated="reload()"
  />
</template>
