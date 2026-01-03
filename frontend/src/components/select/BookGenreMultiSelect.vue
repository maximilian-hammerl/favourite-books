<script setup lang="ts">
import type { Tables } from '@/gen/database'
import { onMounted, ref } from 'vue'
import { supabase } from '@/lib/supabase.ts'
import type { VoltSelectProps } from '@/volt/Select.vue'
import FormattedBookGenre, {
  type BookGenreToFormat,
} from '@/components/formatted/FormattedBookGenre.vue'

const selectedBookGenres = defineModel<Array<Tables<'book_genre'>>>({ required: true })

const props = defineProps<VoltSelectProps>()

const selectableBookGenres = ref<Array<BookGenreToFormat> | null>(null)

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
  <VoltMultiSelect
    v-if="selectableBookGenres !== null"
    v-bind="props"
    v-model="selectedBookGenres"
    :options="selectableBookGenres"
    data-key="id"
    filter
    fluid
  >
    <template
      #value="{
        value,
        placeholder,
      }: {
        value: BookGenreToFormat | null | undefined
        placeholder: string
      }"
    >
      <FormattedBookGenre v-if="value" :book-genre="value" />
      <span v-else>
        {{ placeholder }}
      </span>
    </template>

    <template #option="{ option }: { option: BookGenreToFormat }">
      <FormattedBookGenre :book-genre="option" />
    </template>
  </VoltMultiSelect>
  <VoltSkeleton v-else height="3rem" />
</template>
