<script setup lang="ts">
import type { Tables, TablesInsert } from '@/gen/database'
import { ref, watch } from 'vue'
import { supabase } from '@/lib/supabase.ts'

const isVisible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  bookSeriesIdToUpdate: string | null
}>()

const emit = defineEmits<{
  bookSeriesCreatedOrUpdated: [Tables<'book_series'>]
}>()

const NEW_BOOK_SERIES: TablesInsert<'book_series'> = {
  title: '',
}

const bookSeries = ref<TablesInsert<'book_series'> | null>(null)

watch(isVisible, async () => {
  if (isVisible.value) {
    if (props.bookSeriesIdToUpdate) {
      const { data } = await supabase
        .from('book_series')
        .select()
        .eq('id', props.bookSeriesIdToUpdate)
        .single()
        .throwOnError()
      bookSeries.value = data
    } else {
      bookSeries.value = structuredClone(NEW_BOOK_SERIES)
    }
  } else {
    bookSeries.value = null
  }
})

async function createOrUpdate() {
  if (bookSeries.value === null) {
    throw new Error('Author cannot be null when creating bookSeries')
  }

  if (props.bookSeriesIdToUpdate) {
    const { data } = await supabase
      .from('book_series')
      .update(bookSeries.value)
      .eq('id', props.bookSeriesIdToUpdate)
      .select()
      .single()
      .throwOnError()
    emit('bookSeriesCreatedOrUpdated', data)
  } else {
    const { data } = await supabase
      .from('book_series')
      .insert(bookSeries.value)
      .select()
      .single()
      .throwOnError()
    emit('bookSeriesCreatedOrUpdated', data)
  }
  isVisible.value = false
}
</script>

<template>
  <VoltDialog
    v-model:visible="isVisible"
    :header="props.bookSeriesIdToUpdate ? 'Buchreihe aktualisieren' : 'Buchreihe anlegen'"
    modal
    :closable="false"
    class="min-w-11/12 sm:min-w-10/12 md:min-w-9/12 lg:min-w-8/12"
  >
    <form v-if="bookSeries !== null" class="flex flex-col gap-4" @submit.prevent="createOrUpdate()">
      <div>
        <label for="title">Titel</label>
        <VoltInputText id="title" v-model="bookSeries.title" required fluid autofocus />
      </div>

      <div class="flex flex-wrap gap-2 justify-end">
        <VoltButton label="Abbrechen" @click="isVisible = false" outlined />
        <VoltButton
          :label="props.bookSeriesIdToUpdate ? 'Aktualisieren' : 'Anlegen'"
          type="submit"
        />
      </div>
    </form>

    <VoltSkeleton v-else height="20rem" />
  </VoltDialog>
</template>
