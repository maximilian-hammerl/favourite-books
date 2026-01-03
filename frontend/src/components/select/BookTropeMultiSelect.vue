<script setup lang="ts">
import type { Tables } from '@/gen/database'
import { onMounted, ref } from 'vue'
import { supabase } from '@/lib/supabase.ts'
import type { VoltMultiSelectProps } from '@/volt/MultiSelect.vue'

const selectedBookTropes = defineModel<Array<Tables<'book_trope'>>>({ required: true })

const props = defineProps<VoltMultiSelectProps>()

const selectableBookTropes = ref<Array<Tables<'book_trope'>> | null>(null)

onMounted(async () => {
  const { data } = await supabase.from('book_trope').select().order('title').throwOnError()
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
    option-label="title"
    fluid
  />
  <VoltSkeleton v-else height="3rem" />
</template>
