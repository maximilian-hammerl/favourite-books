<script setup lang="ts">
import type { TablesInsert } from '@/gen/database'
import { ref, watch } from 'vue'
import { supabase, user } from '@/lib/supabase.ts'

type BookReview = Omit<TablesInsert<'user_reviewed_book'>, 'user_id' | 'book_id'>

const isVisible = defineModel<boolean>('visible', { required: true })

const props = defineProps<{
  bookIdForReview: string | null
}>()

const NEW_BOOK_REVIEW: BookReview = {
  overall_rating: 0,
  emotions_rating: 0,
  spice_rating: 0,
  darkness_rating: 0,
  suspense_rating: 0,
  quality_of_writing_rating: 0,
  plot_development_rating: 0,
  characters_rating: 0,
  ease_of_reading_rating: 0,
  story_immersion_rating: 0,
  ending_rating: 0,
}

const bookReview = ref<BookReview | null>(null)

watch(isVisible, async (newIsVisible) => {
  if (newIsVisible) {
    if (props.bookIdForReview === null) {
      throw new Error('Book ID is required when creating a new review')
    }
    const { data: existingBookReview } = await supabase
      .from('user_reviewed_book')
      .select()
      .eq('user_id', user.value!.id)
      .eq('book_id', props.bookIdForReview)
      .maybeSingle()
      .throwOnError()

    bookReview.value = existingBookReview ?? structuredClone(NEW_BOOK_REVIEW)
  } else {
    bookReview.value = null
  }
})
</script>

<template>
  <VoltDialog
    v-model:visible="isVisible"
    header="Buch-Review"
    modal
    :closable="false"
    class="min-w-11/12 sm:min-w-10/12 md:min-w-9/12 lg:min-w-8/12"
  >
    <form class="flex flex-col gap-4">
      <div>
        <label for="book-title">Titel</label>
        <VoltInputText id="book-title" v-model="book.title" required fluid autofocus />

        <Rating v-model="value">
          <template #onicon>
            <img
              src="https://primefaces.org/cdn/primevue/images/rating/custom-onicon.png"
              height="24"
              width="24"
            />
          </template>
          <template #officon>
            <img
              src="https://primefaces.org/cdn/primevue/images/rating/custom-officon.png"
              height="24"
              width="24"
            />
          </template>
        </Rating>
      </div>
    </form>
  </VoltDialog>
</template>
