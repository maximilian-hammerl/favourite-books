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
    <span class="inline-flex">
      <span
        class="border-s rounded-s-full border-primary-contrast bg-primary text-primary-contrast p-2 flex items-center justify-center"
      >
        <i class="pi pi-book"></i>
      </span>
      <span
        class="border-y border-primary bg-primary-contrast text-primary p-2 flex items-center justify-center"
      >
        {{ initials }}
      </span>
      <span
        class="bg-primary text-primary-contrast rounded-e-full p-2 flex items-center justify-center"
      >
        {{ props.book.title }}
      </span>
    </span>
  </RouterLink>
</template>
