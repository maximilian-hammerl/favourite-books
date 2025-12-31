<script setup lang="ts">
import type { Tables } from '@/gen/database'
import { computed } from 'vue'
import { computeInitialsForTitle } from '@/lib/util/text.ts'

const props = defineProps<{
  book: Tables<'book'>
}>()

const initials = computed<string>(() => computeInitialsForTitle(props.book.title))
</script>

<template>
  <RouterLink :to="{ name: 'singleBook', params: { bookId: props.book.id } }">
    <span class="inline-flex">
      <span
        class="rounded-s-full bg-primary text-primary-contrast p-1 px-2 flex items-center justify-center"
      >
        <i class="pi pi-book"></i>
      </span>
      <span
        class="border-y-2 border-primary bg-primary-contrast text-primary p-1 px-2 flex items-center justify-center"
      >
        {{ initials }}
      </span>
      <span
        class="rounded-e-full bg-primary text-primary-contrast p-1 px-2 flex items-center justify-center"
      >
        {{ props.book.title }}
      </span>
    </span>
  </RouterLink>
</template>
