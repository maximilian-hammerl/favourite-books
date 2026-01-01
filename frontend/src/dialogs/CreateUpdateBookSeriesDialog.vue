<script setup lang="ts">
import type { Tables, TablesInsert } from '@/gen/database'
import { ref, watch } from 'vue'
import { supabase } from '@/lib/supabase.ts'
import FormattedBook from '@/components/formatted/FormattedBook.vue'
import BookSelect from '@/components/BookSelect.vue'

type BookInSeries = Tables<'book'> & {
  user_reviewed_book: Array<Tables<'user_reviewed_book'>>
}

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
const booksInSeries = ref<Array<BookInSeries>>([])

const bookToAddToSeries = ref<BookInSeries | null>(null)

function addBookToSeries() {
  if (bookToAddToSeries.value === null) {
    throw new Error('No book selected to add to series')
  }
  booksInSeries.value.push(bookToAddToSeries.value)
  bookToAddToSeries.value = null
}

function swapBooks(first: number, second: number) {
  const firstBook = booksInSeries.value[first]!
  booksInSeries.value[first] = booksInSeries.value[second]!
  booksInSeries.value[second] = firstBook
}

watch(isVisible, async (newIsVisible) => {
  if (newIsVisible) {
    if (props.bookSeriesIdToUpdate) {
      const { data: existingBookSeries } = await supabase
        .from('book_series')
        .select()
        .eq('id', props.bookSeriesIdToUpdate)
        .single()
        .throwOnError()
      bookSeries.value = existingBookSeries

      const { data: existingBooksInSeries } = await supabase
        .from('book_is_part_of_book_series')
        .select('book(*, user_reviewed_book(*))')
        .eq('book_series_id', props.bookSeriesIdToUpdate)
        .throwOnError()
      booksInSeries.value = existingBooksInSeries.map((x) => x.book)
    } else {
      bookSeries.value = structuredClone(NEW_BOOK_SERIES)
    }
  } else {
    bookSeries.value = null
    booksInSeries.value = []
  }
})

async function createOrUpdate() {
  if (bookSeries.value === null) {
    throw new Error('Author cannot be null when creating bookSeries')
  }

  let createdOrUpdatedBookSeries: Tables<'book_series'>
  if (props.bookSeriesIdToUpdate) {
    const { data: updatedBookSeries } = await supabase
      .from('book_series')
      .update(bookSeries.value)
      .eq('id', props.bookSeriesIdToUpdate)
      .select()
      .single()
      .throwOnError()
    createdOrUpdatedBookSeries = updatedBookSeries

    await supabase
      .from('book_is_part_of_book_series')
      .delete()
      .eq('book_series_id', props.bookSeriesIdToUpdate)
      .throwOnError()
  } else {
    const { data: createdBookSeries } = await supabase
      .from('book_series')
      .insert(bookSeries.value)
      .select()
      .single()
      .throwOnError()
    createdOrUpdatedBookSeries = createdBookSeries
  }

  if (booksInSeries.value.length > 0) {
    await supabase
      .from('book_is_part_of_book_series')
      .insert(
        booksInSeries.value.map((x, i) => ({
          book_series_id: createdOrUpdatedBookSeries.id,
          book_id: x.id,
          number_in_series: i + 1,
        })),
      )
      .throwOnError()
  }

  emit('bookSeriesCreatedOrUpdated', createdOrUpdatedBookSeries)
  isVisible.value = false
}
</script>

<template>
  <VoltDialog
    v-model:visible="isVisible"
    :header="props.bookSeriesIdToUpdate ? 'Buchreihe aktualisieren' : 'Buchreihe anlegen'"
    modal
    :closable="false"
    class="w-11/12 sm:w-10/12 md:w-9/12 lg:w-8/12"
  >
    <form v-if="bookSeries !== null" class="flex flex-col gap-4" @submit.prevent="createOrUpdate()">
      <div>
        <label for="title">Titel</label>
        <VoltInputText id="title" v-model="bookSeries.title" required fluid autofocus />
      </div>

      <VoltDivider />

      <div>
        <strong>Bücher:</strong>
        <ol class="list-inside list-decimal">
          <li v-for="(book, index) in booksInSeries" :key="book.id">
            <span class="inline-flex gap-2">
              <FormattedBook :book="book" class="flew-grow" />
              <VoltButtonGroup class="flex-none">
                <VoltButton
                  icon="pi pi-sort-up-fill"
                  size="small"
                  :disabled="index === 0"
                  @click="swapBooks(index, index - 1)"
                />
                <VoltButton
                  icon="pi pi-sort-down-fill"
                  size="small"
                  :disabled="index === booksInSeries.length - 1"
                  @click="swapBooks(index, index + 1)"
                />
              </VoltButtonGroup>
            </span>
          </li>
        </ol>
      </div>

      <div class="flex gap-2">
        <BookSelect v-model="bookToAddToSeries" class="flex-grow" />
        <VoltButton
          label="Zur Reihe hinzufügen"
          icon="pi pi-plus"
          size="small"
          :disabled="bookToAddToSeries === null"
          class="flex-none"
          @click="addBookToSeries()"
        />
      </div>

      <VoltDivider />

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
