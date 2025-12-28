<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import type { Tables } from '@/gen/database'
import { supabase } from '@/lib/supabase.ts'

const route = useRoute()

const bookId = computed<string>(() => route.params.bookId as string)

const book = ref<Tables<'book'> | null>(null)

async function getBook() {
  const { data } = await supabase
    .from('book')
    .select()
    .eq('id', bookId.value)
    .single()
    .throwOnError()
  book.value = data
}

onMounted(getBook)
</script>

<template>
  <div class="w-full">
    <div>
      <h1>{{ book?.title }}</h1>
    </div>

    <div v-if="book === null">
      <VoltSkeleton height="10rem" />
    </div>
  </div>
</template>
