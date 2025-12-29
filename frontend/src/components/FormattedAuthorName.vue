<script setup lang="ts">
import type { Tables } from '@/gen/database'

const props = defineProps<{
  author: Tables<'author'>
}>()
</script>

<template>
  <span> {{ props.author.first_name }} {{ props.author.last_name }} </span>
</template>
