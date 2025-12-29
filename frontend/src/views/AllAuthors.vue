<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Tables } from '@/gen/database'
import { supabase } from '@/lib/supabase.ts'
import CreateUpdateAuthorDialog from '@/dialogs/CreateUpdateAuthorDialog.vue'
import AuthorOverviewCard from '@/components/card/AuthorOverviewCard.vue'

export type PaginatedAuthor = Tables<'author'> & {
  author_created_book: Array<{
    book: Tables<'book'> & {
      book_is_part_of_book_series: Array<
        Pick<Tables<'book_is_part_of_book_series'>, 'number_in_series'> & {
          book_series: Tables<'book_series'>
        }
      >
    }
  }>
}

const firstIndexOfCurrentPage = ref<number>(0)
const authorsPerPage = ref<number>(10)

const authors = ref<Array<PaginatedAuthor> | null>(null)
const numberTotalAuthors = ref<number | null>(null)

async function getAuthors() {
  const { data } = await supabase
    .from('author')
    .select(
      '*, author_created_book(book(*, book_is_part_of_book_series(number_in_series, book_series(*))))',
    )
    .order('last_name')
    .order('first_name')
    .range(firstIndexOfCurrentPage.value, firstIndexOfCurrentPage.value + authorsPerPage.value - 1)
    .throwOnError()
  authors.value = data
}

async function countAuthors() {
  const { count } = await supabase.from('author').select('*', { count: 'exact' }).throwOnError()
  numberTotalAuthors.value = count
}

async function reload() {
  await Promise.all([getAuthors(), countAuthors()])
}

onMounted(reload)

watch([firstIndexOfCurrentPage, authorsPerPage], getAuthors)

const isCreateUpdateAuthorDialogVisible = ref<boolean>(false)
const authorIdToUpdate = ref<string | null>(null)

function createAuthor() {
  authorIdToUpdate.value = null
  isCreateUpdateAuthorDialogVisible.value = true
}

function updateAuthor(author: Tables<'author'>) {
  authorIdToUpdate.value = author.id
  isCreateUpdateAuthorDialogVisible.value = true
}
</script>

<template>
  <div class="w-full">
    <div class="flex justify-between mb-4">
      <h1>Autoren</h1>

      <VoltButton label="Autor anlegen" size="small" @click="createAuthor()" />
    </div>

    <div v-if="authors === null || numberTotalAuthors === null" class="flex flex-col gap-4">
      <VoltSkeleton v-for="i in authorsPerPage" :key="i" height="6rem" />
    </div>

    <div v-else class="flex flex-col gap-4">
      <VoltInputText placeholder="Suche" />

      <AuthorOverviewCard
        v-for="author in authors"
        :key="author.id"
        :author="author"
        @update-author="updateAuthor(author)"
      />
      <div>
        <VoltPaginator
          v-model:first="firstIndexOfCurrentPage"
          v-model:rows="authorsPerPage"
          :total-records="numberTotalAuthors"
        />
      </div>
    </div>
  </div>

  <CreateUpdateAuthorDialog
    v-model:visible="isCreateUpdateAuthorDialogVisible"
    :author-id-to-update="authorIdToUpdate"
    @author-created-or-updated="reload()"
  />
</template>
