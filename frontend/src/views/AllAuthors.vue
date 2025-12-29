<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { Tables } from '@/gen/database'
import { supabase } from '@/lib/supabase.ts'
import CreateAuthorDialog from '@/dialogs/CreateAuthorDialog.vue'
import { useRouter } from 'vue-router'
import FormattedAuthorName from '@/components/FormattedAuthorName.vue'

const router = useRouter()

const firstIndexOfCurrentPage = ref<number>(0)
const authorsPerPage = ref<number>(10)

const authors = ref<Array<Tables<'author'>> | null>(null)
const numberTotalAuthors = ref<number | null>(null)

async function getAuthors() {
  console.log('Get authors', {
    firstIndexOfCurrentPage: firstIndexOfCurrentPage.value,
    authorsPerPage: authorsPerPage.value,
  })
  const { data } = await supabase
    .from('author')
    .select()
    .range(firstIndexOfCurrentPage.value, firstIndexOfCurrentPage.value + authorsPerPage.value - 1)
    .throwOnError()
  authors.value = data
}

async function countAuthors() {
  console.log('Count authors')
  const { count } = await supabase.from('author').select('*', { count: 'exact' }).throwOnError()
  numberTotalAuthors.value = count
}

async function reload() {
  await Promise.all([getAuthors(), countAuthors()])
}

onMounted(reload)

watch([firstIndexOfCurrentPage, authorsPerPage], getAuthors)

const isCreateAuthorDialogVisible = ref<boolean>(false)

async function onAuthorCreated(newAuthor: Tables<'author'>) {
  await router.push({
    name: 'singleAuthor',
    params: { authorId: newAuthor.id },
  })
}
</script>

<template>
  <div class="w-full">
    <div class="flex justify-between mb-4">
      <h1>Autoren</h1>

      <VoltButton
        label="Neuen Autor anlegen"
        size="small"
        @click="isCreateAuthorDialogVisible = true"
      />
    </div>

    <div v-if="authors === null || numberTotalAuthors === null" class="flex flex-col gap-4">
      <VoltSkeleton v-for="i in authorsPerPage" :key="i" height="6rem" />
    </div>

    <div v-else class="flex flex-col gap-4">
      <VoltCard v-for="author in authors" :key="author.id">
        <template #title>
          <RouterLink :to="{ name: 'singleAuthor', params: { authorId: author.id } }">
            <FormattedAuthorName :author="author" />
          </RouterLink>
        </template>
        <template #content>
          <p>Erstellt am: {{ author.created_at }}</p>
        </template>
      </VoltCard>
      <div>
        <VoltPaginator
          v-model:first="firstIndexOfCurrentPage"
          v-model:rows="authorsPerPage"
          :total-records="numberTotalAuthors"
        />
      </div>
    </div>
  </div>

  <CreateAuthorDialog
    v-model:visible="isCreateAuthorDialogVisible"
    @author-created="onAuthorCreated"
  />
</template>
