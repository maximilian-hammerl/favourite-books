<script setup lang="ts">
import type { Tables, TablesInsert } from '@/gen/database'
import { ref, watch } from 'vue'
import { supabase } from '@/lib/supabase.ts'

const isVisible = defineModel<boolean>('visible', { required: true })

const emit = defineEmits<{
  bookCreated: [Tables<'book'>]
}>()

const INITIAL_BOOK: TablesInsert<'book'> = { title: '' }

const newBook = ref<TablesInsert<'book'>>(structuredClone(INITIAL_BOOK))

watch(isVisible, () => {
  if (!isVisible.value) {
    return
  }
  newBook.value = structuredClone(INITIAL_BOOK)
})

async function createBook() {
  const { data } = await supabase
    .from('book')
    .insert(newBook.value)
    .select()
    .single()
    .throwOnError()
  emit('bookCreated', data)
  isVisible.value = false
}
</script>

<template>
  <VoltDialog v-model:visible="isVisible" header="Create a new book" modal :closable="false">
    <form class="flex flex-col gap-4" @submit.prevent="createBook()">
      <div>
        <label for="book-title">Title</label>
        <VoltInputText id="book-title" v-model="newBook.title" fluid autofocus />
      </div>

      <div class="flex flex-wrap gap-2 justify-end">
        <VoltButton label="Cancel" @click="isVisible = false" outlined />
        <VoltButton label="Create" type="submit" />
      </div>
    </form>
  </VoltDialog>
</template>
