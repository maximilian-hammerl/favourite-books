<script setup lang="ts">
import type { Tables } from '@/gen/database'
import { computed } from 'vue'
import { computeInitialsForName } from '@/lib/util/text.ts'

export type AuthorToFormat = Tables<'author'>

const props = defineProps<{
  author: AuthorToFormat
}>()

const name = computed<string>(() => `${props.author.first_name} ${props.author.last_name}`.trim())

const initials = computed<string>(() =>
  computeInitialsForName(props.author.first_name, props.author.last_name),
)
</script>

<template>
  <span class="inline-flex">
    <span
      class="rounded-s-full bg-primary text-primary-contrast px-2 flex items-center justify-center"
    >
      <i class="pi pi-user"></i>
    </span>
    <span
      class="border-y-2 border-primary bg-primary-contrast text-primary px-2 flex items-center justify-center"
    >
      {{ initials }}
    </span>
    <span
      class="rounded-e-full bg-primary text-primary-contrast px-2 flex items-center justify-center"
    >
      {{ name }}
    </span>
  </span>
</template>
