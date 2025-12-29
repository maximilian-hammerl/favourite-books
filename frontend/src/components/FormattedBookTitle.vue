<script setup lang="ts">
import type { Tables } from '@/gen/database'

const props = defineProps<{
  book: Tables<'book'>
}>()
</script>

<template>
  <span>{{ props.book.title }}</span>
</template>
