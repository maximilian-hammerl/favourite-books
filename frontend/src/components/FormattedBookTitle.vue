<script setup lang="ts">
import type { Tables } from '@/gen/database'
import { computed } from 'vue'

const props = defineProps<{
  book: Tables<'book'>
}>()

const initials = computed<string>(() =>
  props.book.title
    .split(/\s+/)
    .map((x) => x.charAt(0))
    .join(''),
)
</script>

<template>
  <RouterLink :to="{ name: 'singleBook', params: { bookId: props.book.id } }">
    <span class="inline-flex items-center gap-1">
      <VoltAvatar :label="initials" />
      <span>{{ props.book.title }}</span>
    </span>
  </RouterLink>
</template>
