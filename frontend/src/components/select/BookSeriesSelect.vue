<script setup lang="ts">
import type { Tables } from '@/gen/database'
import { onMounted, ref } from 'vue'
import { supabase } from '@/lib/supabase.ts'
import type { VoltSelectProps } from '@/volt/Select.vue'
import FormattedBookSeries, {
  type BookSeriesToFormat,
} from '@/components/formatted/FormattedBookSeries.vue'

const selectedBookSeries = defineModel<Tables<'book_series'> | null>({ required: true })

const props = defineProps<VoltSelectProps>()

const selectableBookSeriess = ref<Array<BookSeriesToFormat> | null>(null)

onMounted(async () => {
  const { data } = await supabase.from('book_series').select().order('title').throwOnError()
  selectableBookSeriess.value = data
})
</script>

<template>
  <VoltSelect
    v-if="selectableBookSeriess !== null"
    v-bind="props"
    v-model="selectedBookSeries"
    :options="selectableBookSeriess"
    data-key="id"
    filter
    fluid
  >
    <template
      #value="{
        value,
        placeholder,
      }: {
        value: BookSeriesToFormat | null | undefined
        placeholder: string
      }"
    >
      <FormattedBookSeries v-if="value" :book-series="value" />
      <span v-else>
        {{ placeholder }}
      </span>
    </template>

    <template #option="{ option }: { option: BookSeriesToFormat }">
      <FormattedBookSeries :book-series="option" />
    </template>
  </VoltSelect>
  <VoltSkeleton v-else height="3rem" />
</template>
