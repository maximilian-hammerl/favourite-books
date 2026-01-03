<script setup lang="ts">
import type { Tables } from '@/gen/database'
import { onMounted, ref } from 'vue'
import { supabase } from '@/lib/supabase.ts'
import type { VoltMultiSelectProps } from '@/volt/MultiSelect.vue'
import FormattedBookTrope, {
  type BookTropeToFormat,
} from '@/components/formatted/FormattedBookTrope.vue'

const selectedBookTropes = defineModel<Array<Tables<'book_trope'>>>({ required: true })

const props = defineProps<VoltMultiSelectProps>()

const selectableBookTropes = ref<Array<BookTropeToFormat> | null>(null)

onMounted(async () => {
  const { data } = await supabase
    .from('book_trope')
    .select('*, book_has_book_trope(count)')
    .order('title')
    .throwOnError()
  selectableBookTropes.value = data
})
</script>

<template>
  <VoltMultiSelect
    v-if="selectableBookTropes !== null"
    v-bind="props"
    v-model="selectedBookTropes"
    :options="selectableBookTropes"
    data-key="id"
    filter
    fluid
  >
    <template
      #value="{
        value,
        placeholder,
      }: {
        value: BookTropeToFormat | null | undefined
        placeholder: string
      }"
    >
      <FormattedBookTrope v-if="value" :book-trope="value" />
      <span v-else>
        {{ placeholder }}
      </span>
    </template>

    <template #option="{ option }: { option: BookTropeToFormat }">
      <FormattedBookTrope :book-trope="option" />
    </template>
  </VoltMultiSelect>
  <VoltSkeleton v-else height="3rem" />
</template>
