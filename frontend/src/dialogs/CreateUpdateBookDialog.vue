<script setup lang="ts">
import type { Tables, TablesInsert } from '@/gen/database'
import { ref, watch } from 'vue'
import { supabase } from '@/lib/supabase.ts'
import BookGenreSelect from '@/components/BookGenreSelect.vue'
import BookSubGenreMultiSelect from '@/components/BookSubGenreMultiSelect.vue'
import BookTropeMultiSelect from '@/components/BookTropeMultiSelect.vue'
import { useToast } from 'primevue'

const toast = useToast()

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
const bookTropes = ref<Array<Tables<'book_trope'>>>([])

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

      const { data: existingBookTropes } = await supabase
        .from('book_has_book_trope')
        .select('book_trope(*)')
        .eq('book_id', props.bookIdToUpdate)
        .throwOnError()
      bookTropes.value = existingBookTropes.map((x) => x.book_trope)
    } else {
      book.value = structuredClone(NEW_BOOK)
    }
  } else {
    book.value = null
    bookGenre.value = null
    bookSubGenres.value = []
    bookTropes.value = []
  }
})

async function createOrUpdate() {
  if (book.value === null) {
    throw new Error('Book cannot be null when creating book')
  }
  if (bookGenre.value === null) {
    toast.add({
      severity: 'warn',
      summary: 'Book-Genre fehlt',
      detail: 'Bitte wähle noch ein Book-Genre aus',
      life: 5000,
    })
    return
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

    // Easier to just delete existing and insert new
    await supabase.from('book_has_book_sub_genre').delete().eq('book_id', props.bookIdToUpdate)
    await supabase.from('book_has_book_trope').delete().eq('book_id', props.bookIdToUpdate)
  } else {
    const { data: createdBook } = await supabase
      .from('book')
      .insert(book.value)
      .select()
      .single()
      .throwOnError()
    createdOrUpdatedBook = createdBook
  }

  await supabase
    .from('book_has_book_genre')
    .upsert({
      book_id: createdOrUpdatedBook.id,
      book_genre_id: bookGenre.value.id,
    })
    .throwOnError()

  await supabase
    .from('book_has_book_sub_genre')
    .insert(
      bookSubGenres.value.map((x) => ({
        book_id: createdOrUpdatedBook.id,
        book_sub_genre_id: x.id,
      })),
    )
    .throwOnError()

  await supabase
    .from('book_has_book_trope')
    .insert(
      bookTropes.value.map((x) => ({
        book_id: createdOrUpdatedBook.id,
        book_trope_id: x.id,
      })),
    )
    .throwOnError()

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
    class="min-w-11/12 sm:min-w-10/12 md:min-w-9/12 lg:min-w-8/12"
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

      <div>
        <label for="book-genre">Genre</label>
        <BookGenreSelect id="book-genre" v-model="bookGenre" />
      </div>

      <div>
        <label for="book-sub-genres">Subgenres</label>
        <BookSubGenreMultiSelect id="book-sub-genres" v-model="bookSubGenres" />
      </div>

      <div>
        <label for="book-tropes">Tropes</label>
        <BookTropeMultiSelect id="book-tropes" v-model="bookTropes" />
      </div>

      <div class="flex flex-wrap gap-2 justify-end">
        <VoltButton label="Abbrechen" @click="isVisible = false" outlined />
        <VoltButton :label="props.bookIdToUpdate ? 'Aktualisieren' : 'Erstellen'" type="submit" />
      </div>
    </form>

    <VoltSkeleton v-else height="20rem" />
  </VoltDialog>
</template>
