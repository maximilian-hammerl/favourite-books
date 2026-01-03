<script setup lang="ts">
import type { Tables } from '@/gen/database'
import { onMounted, ref } from 'vue'
import { supabase } from '@/lib/supabase.ts'
import type { VoltMultiSelectProps } from '@/volt/MultiSelect.vue'

const selectedBookSubgenres = defineModel<Array<Tables<'book_subgenre'>>>({ required: true })

const props = defineProps<VoltMultiSelectProps>()

const selectableBookSubgenres = ref<Array<Tables<'book_subgenre'>> | null>(null)

onMounted(async () => {
  const { data } = await supabase.from('book_subgenre').select().order('title').throwOnError()
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
    option-label="title"
    fluid
  />
  <VoltSkeleton v-else height="3rem" />
</template>
