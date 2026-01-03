<script setup lang="ts">
import type { Tables } from '@/gen/database'
import { onMounted, ref } from 'vue'
import { supabase } from '@/lib/supabase.ts'
import type { VoltMultiSelectProps } from '@/volt/MultiSelect.vue'
import FormattedAuthor, { type AuthorToFormat } from '@/components/formatted/FormattedAuthor.vue'

const selectedAuthors = defineModel<Array<Tables<'author'>>>({ required: true })

const props = defineProps<VoltMultiSelectProps>()

const selectableAuthors = ref<Array<AuthorToFormat> | null>(null)

onMounted(async () => {
  const { data } = await supabase
    .from('author')
    .select()
    .order('last_name')
    .order('first_name')
    .throwOnError()
  selectableAuthors.value = data
})
</script>

<template>
  <VoltMultiSelect
    v-if="selectableAuthors !== null"
    v-bind="props"
    v-model="selectedAuthors"
    :options="selectableAuthors"
    data-key="id"
    filter
    fluid
  >
    <template
      #value="{
        value,
        placeholder,
      }: {
        value: AuthorToFormat | null | undefined
        placeholder: string
      }"
    >
      <FormattedAuthor v-if="value" :author="value" />
      <span v-else>
        {{ placeholder }}
      </span>
    </template>

    <template #option="{ option }: { option: AuthorToFormat }">
      <FormattedAuthor :author="option" />
    </template>
  </VoltMultiSelect>
  <VoltSkeleton v-else height="3rem" />
</template>
