<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import type { Tables } from '@/gen/database'
import { supabase } from '@/lib/supabase.ts'
import FormattedBook from '@/components/formatted/FormattedBook.vue'

type Book = Tables<'book'> & {
  user_reviewed_book: Array<Tables<'user_reviewed_book'>>
}

const route = useRoute()

const bookId = computed<string>(() => route.params.bookId as string)

const book = ref<Book | null>(null)

async function getBook() {
  const { data } = await supabase
    .from('book')
    .select('*, user_reviewed_book(*)')
    .eq('id', bookId.value)
    .single()
    .throwOnError()
  book.value = data
}

onMounted(getBook)
</script>

<template>
  <div class="w-full">
    <div v-if="book !== null">
      <h1>
        <FormattedBook :book="book" />
      </h1>
    </div>

    <div v-else>
      <VoltSkeleton height="10rem" />
    </div>
  </div>
</template>
