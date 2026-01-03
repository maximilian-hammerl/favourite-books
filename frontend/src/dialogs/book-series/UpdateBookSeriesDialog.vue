<script setup lang="ts">
import type { Tables, TablesInsert } from '@/gen/database'
import { ref, watch } from 'vue'
import { supabase } from '@/lib/supabase.ts'
import { type BookToFormat } from '@/components/formatted/FormattedBook.vue'
import BookSeriesForm from '@/components/form/BookSeriesForm.vue'

const isVisible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  bookSeriesIdToUpdate: string | null
}>()

const emit = defineEmits<{
  bookSeriesUpdated: [Tables<'book_series'>]
}>()

const bookSeries = ref<TablesInsert<'book_series'> | null>(null)
const booksInSeries = ref<Array<BookToFormat>>([])

watch(isVisible, async (newIsVisible) => {
  if (newIsVisible) {
    const { data: existingBookSeries } = await supabase
      .from('book_series')
      .select()
      .eq('id', props.bookSeriesIdToUpdate!)
      .single()
      .throwOnError()
    bookSeries.value = existingBookSeries

    const { data: existingBooksInSeries } = await supabase
      .from('book_is_part_of_book_series')
      .select('book(*, user_reviewed_book(*))')
      .eq('book_series_id', props.bookSeriesIdToUpdate!)
      .throwOnError()
    booksInSeries.value = existingBooksInSeries.map((x) => x.book)
  } else {
    bookSeries.value = null
    booksInSeries.value = []
  }
})

async function createOrUpdate() {
  if (bookSeries.value === null) {
    throw new Error('Author cannot be null when creating bookSeries')
  }

  const { data: updatedBookSeries } = await supabase
    .from('book_series')
    .update(bookSeries.value)
    .eq('id', props.bookSeriesIdToUpdate!)
    .select()
    .single()
    .throwOnError()

  await supabase
    .from('book_is_part_of_book_series')
    .delete()
    .eq('book_series_id', props.bookSeriesIdToUpdate!)
    .throwOnError()

  if (booksInSeries.value.length > 0) {
    await supabase
      .from('book_is_part_of_book_series')
      .insert(
        booksInSeries.value.map((x, i) => ({
          book_series_id: updatedBookSeries.id,
          book_id: x.id,
          number_in_series: i + 1,
        })),
      )
      .throwOnError()
  }

  emit('bookSeriesUpdated', updatedBookSeries)
  isVisible.value = false
}
</script>

<template>
  <VoltDialog
    v-model:visible="isVisible"
    header="Buchreihe aktualisieren"
    modal
    class="w-11/12 sm:w-10/12 md:w-9/12 lg:w-8/12"
  >
    <form v-if="bookSeries !== null" class="flex flex-col gap-4" @submit.prevent="createOrUpdate()">
      <BookSeriesForm v-model:book-series="bookSeries" v-model:books-in-series="booksInSeries" />

      <VoltDivider />

      <div class="flex flex-wrap gap-2 justify-end">
        <VoltButton label="Abbrechen" @click="isVisible = false" outlined />
        <VoltButton label="Aktualisieren" type="submit" />
      </div>
    </form>

    <VoltSkeleton v-else height="20rem" />
  </VoltDialog>
</template>
