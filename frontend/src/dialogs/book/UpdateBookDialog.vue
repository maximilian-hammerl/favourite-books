<script setup lang="ts">
import type { Tables, TablesInsert } from '@/gen/database'
import { ref, watch } from 'vue'
import { supabase } from '@/lib/supabase.ts'
import { useToast } from 'primevue'
import BookForm from '@/components/form/BookForm.vue'

const toast = useToast()

const isVisible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  bookToUpdate: Tables<'book'> | null
}>()

const emit = defineEmits<{
  bookUpdated: [Tables<'book'>]
}>()

const book = ref<TablesInsert<'book'> | null>(null)
const authors = ref<Array<Tables<'author'>>>([])
const bookGenre = ref<Tables<'book_genre'> | null>(null)
const bookSubgenres = ref<Array<Tables<'book_subgenre'>>>([])
const bookTropes = ref<Array<Tables<'book_trope'>>>([])

watch(isVisible, async (newIsVisible) => {
  if (newIsVisible) {
    const { data: existingBook } = await supabase
      .from('book')
      .select()
      .eq('id', props.bookToUpdate!.id)
      .single()
      .throwOnError()
    book.value = existingBook

    const { data: existingAuthors } = await supabase
      .from('author_created_book')
      .select('author(*)')
      .eq('book_id', props.bookToUpdate!.id)
      .throwOnError()
    authors.value = existingAuthors.map((x) => x.author)

    const { data: existingBookGenre } = await supabase
      .from('book_has_book_genre')
      .select('book_genre(*)')
      .eq('book_id', props.bookToUpdate!.id)
      .maybeSingle()
      .throwOnError()
    bookGenre.value = existingBookGenre?.book_genre ?? null

    const { data: existingBookSubgenres } = await supabase
      .from('book_has_book_subgenre')
      .select('book_subgenre(*)')
      .eq('book_id', props.bookToUpdate!.id)
      .throwOnError()
    bookSubgenres.value = existingBookSubgenres.map((x) => x.book_subgenre)

    const { data: existingBookTropes } = await supabase
      .from('book_has_book_trope')
      .select('book_trope(*)')
      .eq('book_id', props.bookToUpdate!.id)
      .throwOnError()
    bookTropes.value = existingBookTropes.map((x) => x.book_trope)
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

  const { data: updatedBook } = await supabase
    .from('book')
    .update(book.value)
    .eq('id', props.bookToUpdate!.id)
    .select()
    .single()
    .throwOnError()

  // Easier to just delete existing and insert new
  await supabase
    .from('author_created_book')
    .delete()
    .eq('book_id', props.bookToUpdate!.id)
    .throwOnError()
  await supabase
    .from('book_has_book_subgenre')
    .delete()
    .eq('book_id', props.bookToUpdate!.id)
    .throwOnError()
  await supabase
    .from('book_has_book_trope')
    .delete()
    .eq('book_id', props.bookToUpdate!.id)
    .throwOnError()

  await supabase
    .from('author_created_book')
    .insert(
      authors.value.map((x) => ({
        book_id: updatedBook.id,
        author_id: x.id,
      })),
    )
    .throwOnError()

  await supabase
    .from('book_has_book_genre')
    .upsert({
      book_id: updatedBook.id,
      book_genre_id: bookGenre.value.id,
    })
    .throwOnError()

  await supabase
    .from('book_has_book_subgenre')
    .insert(
      bookSubgenres.value.map((x) => ({
        book_id: updatedBook.id,
        book_subgenre_id: x.id,
      })),
    )
    .throwOnError()

  await supabase
    .from('book_has_book_trope')
    .insert(
      bookTropes.value.map((x) => ({
        book_id: updatedBook.id,
        book_trope_id: x.id,
      })),
    )
    .throwOnError()

  emit('bookUpdated', updatedBook)
  isVisible.value = false
}
</script>

<template>
  <VoltDialog
    v-model:visible="isVisible"
    header="Buch aktualisieren"
    modal
    class="w-11/12 sm:w-10/12 md:w-9/12 lg:w-8/12"
  >
    <form v-if="book !== null" class="flex flex-col gap-4" @submit.prevent="createOrUpdate()">
      <BookForm
        v-model:book="book"
        v-model:authors="authors"
        v-model:book-genre="bookGenre"
        v-model:book-subgenres="bookSubgenres"
        v-model:book-tropes="bookTropes"
      />

      <VoltDivider />

      <div class="flex flex-wrap gap-2 justify-end">
        <VoltButton label="Abbrechen" @click="isVisible = false" outlined />
        <VoltButton label="Aktualisieren" type="submit" />
      </div>
    </form>

    <VoltSkeleton v-else height="20rem" />
  </VoltDialog>
</template>
