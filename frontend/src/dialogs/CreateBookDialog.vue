<script setup lang="ts">
import type { Tables, TablesInsert } from '@/gen/database'
import { ref, watch } from 'vue'
import { supabase } from '@/lib/supabase.ts'

const isVisible = defineModel<boolean>('visible', { required: true })

const emit = defineEmits<{
  bookCreated: [Tables<'book'>]
}>()

const INITIAL_BOOK: TablesInsert<'book'> = {
  title: '',
  subtitle: '',
  blurb: '',
  number_pages: null,
}

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
  <VoltDialog v-model:visible="isVisible" header="Neues Buch erstellen" modal :closable="false">
    <form class="flex flex-col gap-4" @submit.prevent="createBook()">
      <div>
        <label for="book-title">Titel</label>
        <VoltInputText id="book-title" v-model="newBook.title" required fluid autofocus />
      </div>

      <div>
        <label for="book-title">Subtitel (optional)</label>
        <VoltInputText id="book-title" v-model="newBook.subtitle" fluid />
      </div>

      <div>
        <label for="book-title">Blurb (optional)</label>
        <VoltInputText id="book-title" v-model="newBook.blurb" fluid />
      </div>

      <div class="flex flex-wrap gap-2 justify-end">
        <VoltButton label="Abbrechen" @click="isVisible = false" outlined />
        <VoltButton label="Erstellen" type="submit" />
      </div>
    </form>
  </VoltDialog>
</template>
