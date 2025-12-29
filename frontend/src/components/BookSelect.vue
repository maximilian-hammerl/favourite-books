<script setup lang="ts">
import type { Tables } from '@/gen/database'
import { onMounted, ref } from 'vue'
import { supabase } from '@/lib/supabase.ts'
import type { VoltSelectProps } from '@/volt/Select.vue'

const selectedBook = defineModel<Tables<'book'> | null>({ required: true })

const props = defineProps<VoltSelectProps>()

const selectableBooks = ref<Array<Tables<'book'>> | null>(null)

onMounted(async () => {
  const { data } = await supabase.from('book').select().order('title').throwOnError()
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
    option-label="title"
    fluid
  />
  <VoltSkeleton v-else height="3rem" />
</template>
