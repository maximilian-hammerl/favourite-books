<script setup lang="ts">
import type { Tables, TablesInsert } from '@/gen/database'
import { ref, watch } from 'vue'
import { supabase } from '@/lib/supabase.ts'
import BookGenreSelect from '@/components/BookGenreSelect.vue'
import BookSubgenreMultiSelect from '@/components/BookSubgenreMultiSelect.vue'
import BookTropeMultiSelect from '@/components/BookTropeMultiSelect.vue'
import { useToast } from 'primevue'
import AuthorMultiSelect from '@/components/AuthorMultiSelect.vue'

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
const authors = ref<Array<Tables<'author'>>>([])
const bookGenre = ref<Tables<'book_genre'> | null>(null)
const bookSubgenres = ref<Array<Tables<'book_subgenre'>>>([])
const bookTropes = ref<Array<Tables<'book_trope'>>>([])

watch(isVisible, async (newIsVisible) => {
  if (newIsVisible) {
    if (props.bookIdToUpdate) {
      const { data: existingBook } = await supabase
        .from('book')
        .select()
        .eq('id', props.bookIdToUpdate)
        .single()
        .throwOnError()
      book.value = existingBook

      const { data: existingAuthors } = await supabase
        .from('author_created_book')
        .select('author(*)')
        .eq('book_id', props.bookIdToUpdate)
        .throwOnError()
      authors.value = existingAuthors.map((x) => x.author)

      const { data: existingBookGenre } = await supabase
        .from('book_has_book_genre')
        .select('book_genre(*)')
        .eq('book_id', props.bookIdToUpdate)
        .maybeSingle()
        .throwOnError()
      bookGenre.value = existingBookGenre?.book_genre ?? null

      const { data: existingBookSubgenres } = await supabase
        .from('book_has_book_subgenre')
        .select('book_subgenre(*)')
        .eq('book_id', props.bookIdToUpdate)
        .throwOnError()
      bookSubgenres.value = existingBookSubgenres.map((x) => x.book_subgenre)

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
    authors.value = []
    bookGenre.value = null
    bookSubgenres.value = []
    bookTropes.value = []
  }
})

async function createOrUpdate() {
  if (book.value === null) {
    throw new Error('Book cannot be null when creating book')
  }
  if (authors.value.length === 0) {
    toast.add({
      severity: 'warn',
      summary: 'Autor fehlt',
      detail: 'Bitte wähle mindestens einen Autor aus',
      life: 5000,
    })
    return
  }
  if (bookGenre.value === null) {
    toast.add({
      severity: 'warn',
      summary: 'Genre fehlt',
      detail: 'Bitte wähle noch ein Book-Genre aus',
      life: 5000,
    })
    return
  }
  if (bookSubgenres.value.length === 0) {
    toast.add({
      severity: 'warn',
      summary: 'Subgenre fehlt',
      detail: 'Bitte wähle mindestens ein Book-Subgenre aus',
      life: 5000,
    })
    return
  }
  if (bookTropes.value.length === 0) {
    toast.add({
      severity: 'warn',
      summary: 'Trope fehlt',
      detail: 'Bitte wähle mindestens ein Book-Trope aus',
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
    await supabase
      .from('author_created_book')
      .delete()
      .eq('book_id', props.bookIdToUpdate)
      .throwOnError()
    await supabase
      .from('book_has_book_subgenre')
      .delete()
      .eq('book_id', props.bookIdToUpdate)
      .throwOnError()
    await supabase
      .from('book_has_book_trope')
      .delete()
      .eq('book_id', props.bookIdToUpdate)
      .throwOnError()
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
    .from('author_created_book')
    .insert(
      authors.value.map((x) => ({
        book_id: createdOrUpdatedBook.id,
        author_id: x.id,
      })),
    )
    .throwOnError()

  await supabase
    .from('book_has_book_genre')
    .upsert({
      book_id: createdOrUpdatedBook.id,
      book_genre_id: bookGenre.value.id,
    })
    .throwOnError()

  await supabase
    .from('book_has_book_subgenre')
    .insert(
      bookSubgenres.value.map((x) => ({
        book_id: createdOrUpdatedBook.id,
        book_subgenre_id: x.id,
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

      <VoltDivider />

      <div>
        <label for="authors">Autoren</label>
        <AuthorMultiSelect
          id="authors"
          v-model="authors"
          placeholder="Wähle einen oder mehrere Autoren aus"
        />
      </div>

      <VoltDivider />

      <div>
        <label for="book-title">Blurb (optional)</label>
        <VoltTextarea id="book-title" v-model="book.blurb" fluid auto-resize :rows="5" />
      </div>

      <VoltDivider />

      <div>
        <label for="book-genre">Genre</label>
        <BookGenreSelect
          id="book-genre"
          v-model="bookGenre"
          placeholder="Wähle ein Buch-Genre aus"
        />
      </div>

      <div>
        <label for="book-subgenres">Subgenres</label>
        <BookSubgenreMultiSelect
          id="book-subgenres"
          v-model="bookSubgenres"
          placeholder="Wähle ein oder mehrere Buch-Subgenres aus"
        />
      </div>

      <div>
        <label for="book-tropes">Tropes</label>
        <BookTropeMultiSelect
          id="book-tropes"
          v-model="bookTropes"
          placeholder="Wähle ein oder mehrere Buch-Tropes aus"
        />
      </div>

      <VoltDivider />

      <div class="flex flex-wrap gap-2 justify-end">
        <VoltButton label="Abbrechen" @click="isVisible = false" outlined />
        <VoltButton :label="props.bookIdToUpdate ? 'Aktualisieren' : 'Erstellen'" type="submit" />
      </div>
    </form>

    <VoltSkeleton v-else height="20rem" />
  </VoltDialog>
</template>
