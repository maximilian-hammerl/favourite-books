<script setup lang="ts">
import type { Tables, TablesInsert } from '@/gen/database'
import { ref, watch } from 'vue'
import { supabase } from '@/lib/supabase.ts'
import BookGenreSelect from '@/components/BookGenreSelect.vue'

const isVisible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  bookIdToUpdate: string | null
}>()

const emit = defineEmits<{
  bookCreatedOrUpdated: [Tables<'book'>]
}>()

const NEW_BOOK: TablesInsert<'book'> = {
  title: '',
  subtitle: '',
  blurb: '',
  number_pages: null,
}

const book = ref<TablesInsert<'book'> | null>(null)
const bookGenre = ref<Tables<'book_genre'> | null>(null)
const bookSubGenres = ref<Array<Tables<'book_sub_genre'>>>([])

watch(isVisible, async () => {
  if (isVisible.value) {
    if (props.bookIdToUpdate) {
      const { data: existingBook } = await supabase
        .from('book')
        .select()
        .eq('id', props.bookIdToUpdate)
        .single()
        .throwOnError()
      book.value = existingBook

      const { data: existingBookGenre } = await supabase
        .from('book_has_book_genre')
        .select('book_genre(*)')
        .eq('book_id', props.bookIdToUpdate)
        .maybeSingle()
        .throwOnError()
      bookGenre.value = existingBookGenre?.book_genre ?? null

      const { data: existingBookSubGenres } = await supabase
        .from('book_has_book_sub_genre')
        .select('book_sub_genre(*)')
        .eq('book_id', props.bookIdToUpdate)
        .throwOnError()
      bookSubGenres.value = existingBookSubGenres.map((x) => x.book_sub_genre)
    } else {
      book.value = structuredClone(NEW_BOOK)
    }
  } else {
    book.value = null
    bookGenre.value = null
    bookSubGenres.value = []
  }
})

async function createOrUpdate() {
  if (book.value === null) {
    throw new Error('Book cannot be null when creating book')
  }

  let createdOrUpdatedBook: Tables<'book'>
  if (props.bookIdToUpdate) {
    const { data: updatedBook } = await supabase
      .from('book')
      .update(book.value)
      .eq('id', props.bookIdToUpdate)
      .select()
      .single()
      .throwOnError()
    createdOrUpdatedBook = updatedBook
  } else {
    const { data: createdBook } = await supabase
      .from('book')
      .insert(book.value)
      .select()
      .single()
      .throwOnError()
    createdOrUpdatedBook = createdBook
  }

  emit('bookCreatedOrUpdated', createdOrUpdatedBook)
  isVisible.value = false
}
</script>

<template>
  <VoltDialog
    v-model:visible="isVisible"
    :header="props.bookIdToUpdate ? 'Buch aktualisieren' : 'Buch erstellen'"
    modal
    :closable="false"
  >
    <form v-if="book !== null" class="flex flex-col gap-4" @submit.prevent="createOrUpdate()">
      <div>
        <label for="book-title">Titel</label>
        <VoltInputText id="book-title" v-model="book.title" required fluid autofocus />
      </div>

      <div>
        <label for="book-title">Subtitel (optional)</label>
        <VoltInputText id="book-title" v-model="book.subtitle" fluid />
      </div>

      <div>
        <label for="book-title">Blurb (optional)</label>
        <VoltTextarea id="book-title" v-model="book.blurb" fluid auto-resize :rows="5" />
      </div>

      <BookGenreSelect v-model="bookGenre" />

      <div class="flex flex-wrap gap-2 justify-end">
        <VoltButton label="Abbrechen" @click="isVisible = false" outlined />
        <VoltButton :label="props.bookIdToUpdate ? 'Aktualisieren' : 'Erstellen'" type="submit" />
      </div>
    </form>

    <VoltSkeleton v-else height="20rem" />
  </VoltDialog>
</template>
