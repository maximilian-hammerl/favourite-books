<script setup lang="ts">
import type { Tables } from '@/gen/database'

const props = defineProps<{
  book: Tables<'book'>
}>()
</script>

<template>
  <span v-if="book.subtitle" class="inline-flex gap-2 items-center">
    <span>{{ props.book.title }}:</span>
    <small>{{ props.book.subtitle }}</small>
  </span>
  <span v-else>{{ props.book.title }}</span>
</template>
