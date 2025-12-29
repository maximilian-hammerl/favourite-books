<script setup lang="ts">
import type { Tables } from '@/gen/database'
import { onMounted, ref } from 'vue'
import { supabase } from '@/lib/supabase.ts'
import type { VoltSelectProps } from '@/volt/Select.vue'

const selectedBookGenre = defineModel<Tables<'book_genre'> | null>({ required: true })

const props = defineProps<VoltSelectProps>()

const selectableBookGenres = ref<Array<Tables<'book_genre'>> | null>(null)

onMounted(async () => {
  const { data } = await supabase.from('book_genre').select().order('title').throwOnError()
  selectableBookGenres.value = data
})
</script>

<template>
  <VoltSelect
    v-if="selectableBookGenres !== null"
    v-bind="props"
    v-model="selectedBookGenre"
    :options="selectableBookGenres"
    filter
    option-label="title"
    placeholder="Wähle ein Buch-Genre aus"
    fluid
  />
  <VoltSkeleton v-else height="3rem" />
</template>
