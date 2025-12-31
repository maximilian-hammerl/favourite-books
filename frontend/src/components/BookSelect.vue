<script setup lang="ts">
import type { Tables } from '@/gen/database'
import { onMounted, ref } from 'vue'
import { supabase } from '@/lib/supabase.ts'
import type { VoltSelectProps } from '@/volt/Select.vue'
import FormattedBook from '@/components/formatted/FormattedBook.vue'

type SelectableBook = Tables<'book'> & {
  user_reviewed_book: Array<Tables<'user_reviewed_book'>>
}

const selectedBook = defineModel<SelectableBook | null>({ required: true })

const props = defineProps<VoltSelectProps>()

const selectableBooks = ref<Array<SelectableBook> | null>(null)

onMounted(async () => {
  const { data } = await supabase
    .from('book')
    .select('*, user_reviewed_book(*)')
    .order('title')
    .throwOnError()
  selectableBooks.value = data
})
</script>

<template>
  <VoltSelect
    v-if="selectableBooks !== null"
    v-bind="props"
    v-model="selectedBook"
    :options="selectableBooks"
    filter
    fluid
  >
    <template
      #value="{
        value,
        placeholder,
      }: {
        value: SelectableBook | null | undefined
        placeholder: string
      }"
    >
      <FormattedBook v-if="value" :book="value" />
      <span v-else>
        {{ placeholder }}
      </span>
    </template>

    <template #option="{ option }: { option: SelectableBook }">
      <FormattedBook :book="option" />
    </template>
  </VoltSelect>

  <VoltSkeleton v-else height="3rem" />
</template>
