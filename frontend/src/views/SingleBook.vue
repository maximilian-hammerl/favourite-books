<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import type { Tables } from '@/gen/database'
import { supabase } from '@/lib/supabase.ts'
import FormattedBook from '@/components/formatted/FormattedBook.vue'
import ButtonWithPopup from '@/components/custom/ButtonWithPopup.vue'

type Book = Tables<'book'> & {
  user_reviewed_book: Array<Tables<'user_reviewed_book'>>
}

const route = useRoute()

const bookId = computed<string>(() => route.params.bookId as string)

const book = ref<Book | null>(null)

async function getBook() {
  const { data } = await supabase
    .from('book')
    .select('*, user_reviewed_book(*)')
    .eq('id', bookId.value)
    .single()
    .throwOnError()
  book.value = data
}

onMounted(getBook)
</script>

<template>
  <div class="w-full">
    <div v-if="book !== null">
      <div class="flex justify-between mb-4">
        <h1><FormattedBook :book="book" /></h1>

        <ButtonWithPopup
          :button="{
            icon: 'pi pi-ellipsis-v',
            rounded: true,
          }"
          :menu="{
            model: [
              {
                label: 'Verwalten',
                items: [
                  { label: 'Reviewen', icon: 'pi pi-star' },
                  { label: 'Aktualisieren', icon: 'pi pi-pencil' },
                ],
              },
              {
                label: 'Vorsicht!',
                items: [{ label: 'Löschen', icon: 'pi pi-trash' }],
              },
            ],
          }"
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <VoltCard>
          <template #title> Autor </template>
          <template #content> Autoren </template>
        </VoltCard>
      </div>
    </div>

    <div v-else>
      <VoltSkeleton height="10rem" />
    </div>
  </div>
</template>
