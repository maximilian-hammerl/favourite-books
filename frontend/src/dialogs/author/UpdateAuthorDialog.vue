<script setup lang="ts">
import type { Tables, TablesInsert } from '@/gen/database'
import { ref, watch } from 'vue'
import { supabase } from '@/lib/supabase.ts'
import AuthorForm from '@/components/form/AuthorForm.vue'

const isVisible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  authorIdToUpdate: string | null
}>()

const emit = defineEmits<{
  authorUpdated: [Tables<'author'>]
}>()

const author = ref<TablesInsert<'author'> | null>(null)

watch(isVisible, async (newIsVisible) => {
  if (newIsVisible) {
    const { data } = await supabase
      .from('author')
      .select()
      .eq('id', props.authorIdToUpdate!)
      .single()
      .throwOnError()
    author.value = data
  } else {
    author.value = null
  }
})

async function createOrUpdate() {
  if (author.value === null) {
    throw new Error('Author cannot be null when creating author')
  }

  const { data } = await supabase
    .from('author')
    .update(author.value)
    .eq('id', props.authorIdToUpdate!)
    .select()
    .single()
    .throwOnError()

  emit('authorUpdated', data)
  isVisible.value = false
}
</script>

<template>
  <VoltDialog
    v-model:visible="isVisible"
    header="Autor aktualisieren"
    modal
    class="w-11/12 sm:w-10/12 md:w-9/12 lg:w-8/12"
  >
    <form v-if="author !== null" class="flex flex-col gap-4" @submit.prevent="createOrUpdate()">
      <AuthorForm v-model="author" />

      <VoltDivider />

      <div class="flex flex-wrap gap-2 justify-end">
        <VoltButton label="Abbrechen" @click="isVisible = false" outlined />
        <VoltButton label="Aktualisieren" type="submit" />
      </div>
    </form>

    <VoltSkeleton v-else height="20rem" />
  </VoltDialog>
</template>
