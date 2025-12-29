<script setup lang="ts">
import type { Tables } from '@/gen/database'
import { computed } from 'vue'

const props = defineProps<{
  author: Tables<'author'>
}>()

const name = computed<string>(() => `${props.author.first_name} ${props.author.last_name}`.trim())
const initials = computed<string>(
  () => `${props.author.first_name.charAt(0)}${props.author.last_name.charAt(0)}`,
)
</script>

<template>
  <RouterLink :to="{ name: 'singleAuthor', params: { authorId: props.author.id } }">
    <span class="inline-flex items-center gap-1">
      <VoltAvatar :label="initials" />
      <span>{{ name }}</span>
    </span>
  </RouterLink>
</template>
