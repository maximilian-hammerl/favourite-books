<script setup lang="ts">
import type { Tables } from '@/gen/database'
import { computed } from 'vue'
import { computeInitialsForTitle } from '@/lib/util/text.ts'
import { user } from '@/lib/supabase.ts'
import { sumOfArray } from '@/lib/util/array.ts'

export type BookToFormat = Tables<'book'> & {
  user_reviewed_book: Array<Tables<'user_reviewed_book'>>
}

const props = defineProps<{
  book: BookToFormat
}>()

const initials = computed<string>(() => computeInitialsForTitle(props.book.title))

const ownRating = computed<number | null>(() => {
  const userReviewedBook = props.book.user_reviewed_book.find((x) => x.user_id === user.value!.id)
  return userReviewedBook ? userReviewedBook.overall_rating : null
})

const averageOtherRatings = computed<number | null>(() => {
  const otherRatings = props.book.user_reviewed_book.filter((x) => x.user_id !== user.value!.id)
  if (otherRatings.length === 0) {
    return null
  }
  return sumOfArray(otherRatings.map((x) => x.overall_rating)) / otherRatings.length
})
</script>

<template>
  <span class="inline-flex">
    <span
      class="rounded-s-full bg-primary text-primary-contrast px-2 flex items-center justify-center"
    >
      <i class="pi pi-book"></i>
    </span>

    <span
      class="border-y-2 border-primary bg-primary-contrast text-primary px-2 flex items-center justify-center"
    >
      {{ initials }}
    </span>

    <span class="bg-primary text-primary-contrast px-2 flex items-center justify-center">
      {{ props.book.title }}
    </span>

    <span
      class="border-e-2 border-y-2 border-primary rounded-e-full bg-primary-contrast text-primary px-2 flex items-center justify-center gap-1"
    >
      <template v-if="ownRating !== null || averageOtherRatings !== null">
        <template v-if="ownRating !== null">
          {{ ownRating }}
          <i class="pi pi-star-fill"></i>
        </template>
        <template v-if="averageOtherRatings !== null">
          {{ averageOtherRatings }}
          <i class="pi pi-star"></i>
        </template>
      </template>
      <template v-else>
        <i class="pi pi-minus"></i>
      </template>
    </span>
  </span>
</template>
