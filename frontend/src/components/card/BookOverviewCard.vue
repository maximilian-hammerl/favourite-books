<script setup lang="ts">
import { pluralize } from '@/lib/util/text.ts'
import FormattedBookTitle from '@/components/formatted/FormattedBookTitle.vue'
import FormattedAuthorName from '@/components/formatted/FormattedAuthorName.vue'
import type { PaginatedBook } from '@/views/AllBooks.vue'
import type { Tables } from '@/gen/database'

const props = defineProps<{
  book: PaginatedBook
}>()

const emit = defineEmits<{
  updateBook: []
  addBookGenreFilter: [Tables<'book_genre'>]
  addBookSubgenreFilter: [Tables<'book_subgenre'>]
  addBookTropeFilter: [Tables<'book_trope'>]
}>()
</script>

<template>
  <VoltCard>
    <template #title> Buch: <FormattedBookTitle :book="props.book" /> </template>
    <template v-if="book.subtitle" #subtitle>
      {{ props.book.subtitle }}
    </template>
    <template #content>
      <div class="flex flex-col gap-2">
        <div>
          <strong>
            {{ pluralize(props.book.author_created_book.length, 'Autor', 'Autoren') }}:
          </strong>
          <FormattedAuthorName
            v-for="{ author } in props.book.author_created_book"
            :key="author.id"
            :author="author"
          />
        </div>

        <div>
          <strong>Genre:</strong>
          <VoltButton
            :label="props.book.book_has_book_genre.book_genre.title"
            size="small"
            text
            @click="emit('addBookGenreFilter', props.book.book_has_book_genre.book_genre)"
          />
        </div>

        <div>
          <strong>
            {{ pluralize(props.book.book_has_book_subgenre.length, 'Subgenre', 'Subgenres') }}:
          </strong>
          <div class="flex flex-wrap">
            <VoltButton
              v-for="{ book_subgenre: bookSubgenre } in props.book.book_has_book_subgenre"
              :key="bookSubgenre.id"
              :label="bookSubgenre.title"
              size="small"
              text
              @click="emit('addBookSubgenreFilter', bookSubgenre)"
            />
          </div>
        </div>

        <div>
          <strong>
            {{ pluralize(props.book.book_has_book_trope.length, 'Trope', 'Tropes') }}:
          </strong>
          <div class="flex flex-wrap">
            <VoltButton
              v-for="{ book_trope: bookTrope } in props.book.book_has_book_trope"
              :key="bookTrope.id"
              :label="bookTrope.title"
              size="small"
              text
              @click="emit('addBookTropeFilter', bookTrope)"
            />
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end">
        <VoltButton label="Buch aktualisieren" text size="small" @click="emit('updateBook')" />
      </div>
    </template>
  </VoltCard>
</template>
