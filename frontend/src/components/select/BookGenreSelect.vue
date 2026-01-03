<script setup lang="ts">
import type { Tables } from '@/gen/database'
import { onMounted, ref } from 'vue'
import { supabase } from '@/lib/supabase.ts'
import type { VoltSelectProps } from '@/volt/Select.vue'
import FormattedBookGenre from '@/components/formatted/FormattedBookGenre.vue'

type SelectableBookGenre = Tables<'book_genre'> & {
  book_has_book_genre: Array<{ count: number }>
}

const selectedBookGenre = defineModel<SelectableBookGenre | null>({ required: true })

const props = defineProps<VoltSelectProps>()

const selectableBookGenres = ref<Array<SelectableBookGenre> | null>(null)

onMounted(async () => {
  const { data } = await supabase
    .from('book_genre')
    .select('*, book_has_book_genre(count)')
    .order('title')
    .throwOnError()
  selectableBookGenres.value = data
})
</script>

<template>
  <VoltSelect
    v-if="selectableBookGenres !== null"
    v-bind="props"
    v-model="selectedBookGenre"
    :options="selectableBookGenres"
    data-key="id"
    filter
    option-label="title"
    fluid
  >
    <template #option="{ option }: { option: SelectableBookGenre }">
      <FormattedBookGenre :book-genre="option" />
    </template>
  </VoltSelect>
  <VoltSkeleton v-else height="3rem" />
</template>
