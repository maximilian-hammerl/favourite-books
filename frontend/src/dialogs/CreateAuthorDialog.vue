<script setup lang="ts">
import type { Tables, TablesInsert } from '@/gen/database'
import { ref, watch } from 'vue'
import { supabase } from '@/lib/supabase.ts'

const isVisible = defineModel<boolean>('visible', { required: true })

const emit = defineEmits<{
  authorCreated: [Tables<'author'>]
}>()

const INITIAL_AUTHOR: TablesInsert<'author'> = {
  first_name: '',
  last_name: '',
}

const newAuthor = ref<TablesInsert<'author'>>(structuredClone(INITIAL_AUTHOR))

watch(isVisible, () => {
  if (!isVisible.value) {
    return
  }
  newAuthor.value = structuredClone(INITIAL_AUTHOR)
})

async function createAuthor() {
  const { data } = await supabase
    .from('author')
    .insert(newAuthor.value)
    .select()
    .single()
    .throwOnError()
  emit('authorCreated', data)
  isVisible.value = false
}
</script>

<template>
  <VoltDialog v-model:visible="isVisible" header="Neuen Autor anlegen" modal :closable="false">
    <form class="flex flex-col gap-4" @submit.prevent="createAuthor()">
      <div>
        <label for="author-title">Vorname</label>
        <VoltInputText id="author-title" v-model="newAuthor.first_name" required fluid autofocus />
      </div>

      <div>
        <label for="author-title">Nachname</label>
        <VoltInputText id="author-title" v-model="newAuthor.last_name" required fluid />
      </div>

      <div class="flex flex-wrap gap-2 justify-end">
        <VoltButton label="Abbrechen" @click="isVisible = false" outlined />
        <VoltButton label="Anlegen" type="submit" />
      </div>
    </form>
  </VoltDialog>
</template>
