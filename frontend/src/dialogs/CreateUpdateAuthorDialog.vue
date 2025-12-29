<script setup lang="ts">
import type { Tables, TablesInsert } from '@/gen/database'
import { ref, watch } from 'vue'
import { supabase } from '@/lib/supabase.ts'

const isVisible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  authorIdToUpdate: string | null
}>()

const emit = defineEmits<{
  authorCreatedOrUpdated: [Tables<'author'>]
}>()

const NEW_BOOK: TablesInsert<'author'> = {
  first_name: '',
  last_name: '',
}

const author = ref<TablesInsert<'author'> | null>(null)

watch(isVisible, async () => {
  if (isVisible.value) {
    if (props.authorIdToUpdate) {
      const { data } = await supabase
        .from('author')
        .select()
        .eq('id', props.authorIdToUpdate)
        .single()
        .throwOnError()
      author.value = data
    } else {
      author.value = structuredClone(NEW_BOOK)
    }
  } else {
    author.value = null
  }
})

async function createOrUpdate() {
  if (author.value === null) {
    throw new Error('Author cannot be null when creating author')
  }

  if (props.authorIdToUpdate) {
    const { data } = await supabase
      .from('author')
      .update(author.value)
      .eq('id', props.authorIdToUpdate)
      .select()
      .single()
      .throwOnError()
    emit('authorCreatedOrUpdated', data)
  } else {
    const { data } = await supabase
      .from('author')
      .insert(author.value)
      .select()
      .single()
      .throwOnError()
    emit('authorCreatedOrUpdated', data)
  }
  isVisible.value = false
}
</script>

<template>
  <VoltDialog
    v-model:visible="isVisible"
    :header="props.authorIdToUpdate ? 'Autor aktualisieren' : 'Autor anlegen'"
    modal
    :closable="false"
  >
    <form v-if="author !== null" class="flex flex-col gap-4" @submit.prevent="createOrUpdate()">
      <div>
        <label for="author-title">Vorname</label>
        <VoltInputText id="author-title" v-model="author.first_name" required fluid autofocus />
      </div>

      <div>
        <label for="author-title">Nachname</label>
        <VoltInputText id="author-title" v-model="author.last_name" required fluid />
      </div>

      <div class="flex flex-wrap gap-2 justify-end">
        <VoltButton label="Abbrechen" @click="isVisible = false" outlined />
        <VoltButton :label="props.authorIdToUpdate ? 'Aktualisieren' : 'Anlegen'" type="submit" />
      </div>
    </form>

    <VoltSkeleton v-else height="20rem" />
  </VoltDialog>
</template>
