<script setup lang="ts">
import type { Tables } from '@/gen/database'
import { computed } from 'vue'

const props = defineProps<{
  bookSeries: Tables<'book_series'>
}>()

const initials = computed<string>(() =>
  props.bookSeries.title
    .split(/\s+/)
    .map((x) => x.charAt(0))
    .slice(0, 3)
    .join(''),
)
</script>

<template>
  <RouterLink :to="{ name: 'singleBookSeries', params: { bookSeriesId: props.bookSeries.id } }">
    <VoltButton text size="small">
      <div class="flex items-center gap-1">
        <VoltAvatar :label="initials" />
        {{ props.bookSeries.title }}
      </div>
    </VoltButton>
  </RouterLink>
</template>
