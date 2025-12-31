<script setup lang="ts">
import FormattedAuthor, { type AuthorToFormat } from '@/components/formatted/FormattedAuthor.vue'

const props = defineProps<{
  author: AuthorToFormat
}>()
</script>

<template>
  <RouterLink :to="{ name: 'singleAuthor', params: { authorId: props.author.id } }">
    <FormattedAuthor :author="props.author" />
  </RouterLink>
</template>
