<script setup lang="ts">
import type { Tables } from '@/gen/database'
import { onMounted, ref } from 'vue'
import { supabase } from '@/lib/supabase.ts'
import type { VoltSelectProps } from '@/volt/Select.vue'

const selectedBookSeries = defineModel<Tables<'book_series'> | null>({ required: true })

const props = defineProps<VoltSelectProps>()

const selectableBookSeriess = ref<Array<Tables<'book_series'>> | null>(null)

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
    option-label="title"
    fluid
  />
  <VoltSkeleton v-else height="3rem" />
</template>
