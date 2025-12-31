<script setup lang="ts">
import FormattedBookSeries, {
  type BookSeriesToFormat,
} from '@/components/formatted/FormattedBookSeries.vue'

const props = defineProps<{
  bookSeries: BookSeriesToFormat
}>()
</script>

<template>
  <RouterLink :to="{ name: 'singleBookSeries', params: { bookSeriesId: props.bookSeries.id } }">
    <FormattedBookSeries :book-series="props.bookSeries" />
  </RouterLink>
</template>
