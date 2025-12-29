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
    .slice(0, 3)
    .join(''),
)
</script>

<template>
  <RouterLink :to="{ name: 'singleBook', params: { bookId: props.book.id } }">
    <VoltButton text size="small">
      <div class="flex items-center gap-1">
        <VoltAvatar :label="initials" />
        {{ props.book.title }}
      </div>
    </VoltButton>
  </RouterLink>
</template>
