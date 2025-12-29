<script setup lang="ts">
import type { Tables } from '@/gen/database'
import { onMounted, ref } from 'vue'
import { supabase } from '@/lib/supabase.ts'
import type { VoltMultiSelectProps } from '@/volt/MultiSelect.vue'

const selectedAuthors = defineModel<Array<Tables<'author'>>>({ required: true })

const props = defineProps<VoltMultiSelectProps>()

const selectableAuthors = ref<Array<Tables<'author'>> | null>(null)

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
    filter
    option-label="title"
    placeholder="Wähle ein oder mehrere Autoren aus"
    fluid
  />
  <VoltSkeleton v-else height="3rem" />
</template>
