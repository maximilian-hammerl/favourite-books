<script setup lang="ts">
import type { Tables, TablesInsert } from '@/gen/database'
import { ref, watch } from 'vue'
import { supabase } from '@/lib/supabase.ts'
import { type BookToFormat } from '@/components/formatted/FormattedBook.vue'
import BookSeriesForm from '@/components/form/BookSeriesForm.vue'

const isVisible = defineModel<boolean>('visible', { required: true })

const emit = defineEmits<{
  bookSeriesCreated: [Tables<'book_series'>]
}>()

const NEW_BOOK_SERIES: TablesInsert<'book_series'> = {
  title: '',
}

const bookSeries = ref<TablesInsert<'book_series'> | null>(null)
const booksInSeries = ref<Array<BookToFormat>>([])

watch(isVisible, async (newIsVisible) => {
  if (newIsVisible) {
    bookSeries.value = structuredClone(NEW_BOOK_SERIES)
  } else {
    bookSeries.value = null
    booksInSeries.value = []
  }
})

async function createOrUpdate() {
  if (bookSeries.value === null) {
    throw new Error('Author cannot be null when creating bookSeries')
  }

  const { data: createdBookSeries } = await supabase
    .from('book_series')
    .insert(bookSeries.value)
    .select()
    .single()
    .throwOnError()

  if (booksInSeries.value.length > 0) {
    await supabase
      .from('book_is_part_of_book_series')
      .insert(
        booksInSeries.value.map((x, i) => ({
          book_series_id: createdBookSeries.id,
          book_id: x.id,
          number_in_series: i + 1,
        })),
      )
      .throwOnError()
  }

  emit('bookSeriesCreated', createdBookSeries)
  isVisible.value = false
}
</script>

<template>
  <VoltDialog
    v-model:visible="isVisible"
    header="Buchreihe anlegen"
    modal
    class="w-11/12 sm:w-10/12 md:w-9/12 lg:w-8/12"
  >
    <form v-if="bookSeries !== null" class="flex flex-col gap-4" @submit.prevent="createOrUpdate()">
      <BookSeriesForm v-model:book-series="bookSeries" v-model:books-in-series="booksInSeries" />

      <VoltDivider />

      <div class="flex flex-wrap gap-2 justify-end">
        <VoltButton label="Abbrechen" @click="isVisible = false" outlined />
        <VoltButton label="Anlegen" type="submit" />
      </div>
    </form>

    <VoltSkeleton v-else height="20rem" />
  </VoltDialog>
</template>
