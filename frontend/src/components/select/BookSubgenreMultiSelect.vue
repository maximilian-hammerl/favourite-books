<script setup lang="ts">
import type { Tables } from '@/gen/database'
import { onMounted, ref } from 'vue'
import { supabase } from '@/lib/supabase.ts'
import type { VoltMultiSelectProps } from '@/volt/MultiSelect.vue'
import FormattedBookSubgenre, {
  type BookSubgenreToFormat,
} from '@/components/formatted/FormattedBookSubgenre.vue'

const selectedBookSubgenres = defineModel<Array<Tables<'book_subgenre'>>>({ required: true })

const props = defineProps<VoltMultiSelectProps>()

const selectableBookSubgenres = ref<Array<BookSubgenreToFormat> | null>(null)

onMounted(async () => {
  const { data } = await supabase
    .from('book_subgenre')
    .select('*, book_has_book_subgenre(count)')
    .order('title')
    .throwOnError()
  selectableBookSubgenres.value = data
})
</script>

<template>
  <VoltMultiSelect
    v-if="selectableBookSubgenres !== null"
    v-bind="props"
    v-model="selectedBookSubgenres"
    :options="selectableBookSubgenres"
    data-key="id"
    filter
    fluid
  >
    <template
      #value="{
        value,
        placeholder,
      }: {
        value: BookSubgenreToFormat | null | undefined
        placeholder: string
      }"
    >
      <FormattedBookSubgenre v-if="value" :book-subgenre="value" />
      <span v-else>
        {{ placeholder }}
      </span>
    </template>

    <template #option="{ option }: { option: BookSubgenreToFormat }">
      <FormattedBookSubgenre :book-subgenre="option" />
    </template>
  </VoltMultiSelect>
  <VoltSkeleton v-else height="3rem" />
</template>
