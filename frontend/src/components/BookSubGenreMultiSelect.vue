<script setup lang="ts">
import type { Tables } from '@/gen/database'
import { onMounted, ref } from 'vue'
import { supabase } from '@/lib/supabase.ts'
import type { VoltMultiSelectProps } from '@/volt/MultiSelect.vue'

const selectedBookSubGenres = defineModel<Array<Tables<'book_sub_genre'>>>({ required: true })

const props = defineProps<VoltMultiSelectProps>()

const selectableBookSubGenres = ref<Array<Tables<'book_sub_genre'>> | null>(null)

onMounted(async () => {
  const { data } = await supabase.from('book_sub_genre').select().order('title').throwOnError()
  selectableBookSubGenres.value = data
})
</script>

<template>
  <VoltMultiSelect
    v-if="selectableBookSubGenres !== null"
    v-bind="props"
    v-model="selectedBookSubGenres"
    :options="selectableBookSubGenres"
    filter
    option-label="title"
    placeholder="Wähle ein oder mehrere Buch-Subgenres aus"
    fluid
  />
  <VoltSkeleton v-else height="3rem" />
</template>
