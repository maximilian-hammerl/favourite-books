<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Tables } from '@/gen/database'
import { supabase } from '@/lib/supabase.ts'
import InplaceWithSave from '@/components/InplaceWithSave.vue'

type PaginatedBookGenre = Tables<'book_genre'>
type PaginatedBookSubgenre = Tables<'book_subgenre'>
type PaginatedBookTrope = Tables<'book_trope'>

const bookGenres = ref<Array<PaginatedBookGenre> | null>(null)
const bookSubgenres = ref<Array<PaginatedBookSubgenre> | null>(null)
const bookTropes = ref<Array<PaginatedBookTrope> | null>(null)

async function getBookGenres() {
  const { data } = await supabase.from('book_genre').select().order('title').throwOnError()
  bookGenres.value = data
}

async function getBookSubgenres() {
  const { data } = await supabase.from('book_subgenre').select().order('title').throwOnError()
  bookSubgenres.value = data
}

async function getBookTropes() {
  const { data } = await supabase.from('book_trope').select().order('title').throwOnError()
  bookTropes.value = data
}

onMounted(async () => {
  await Promise.all([getBookGenres(), getBookSubgenres(), getBookTropes()])
})

const isUpdatingBookGenre = ref<boolean>(false)
async function updateBookGenre(bookGenre: Tables<'book_genre'>, newTitle: string) {
  isUpdatingBookGenre.value = true
  try {
    await supabase
      .from('book_genre')
      .update({
        title: newTitle,
      })
      .eq('id', bookGenre.id)
      .throwOnError()
  } finally {
    isUpdatingBookGenre.value = false
  }
}

const isUpdatingBookSubgenre = ref<boolean>(false)
async function updateBookSubgenre(bookSubgenre: Tables<'book_subgenre'>, newTitle: string) {
  isUpdatingBookSubgenre.value = true
  try {
    await supabase
      .from('book_subgenre')
      .update({
        title: newTitle,
      })
      .eq('id', bookSubgenre.id)
      .throwOnError()
  } finally {
    isUpdatingBookSubgenre.value = false
  }
}

const isUpdatingBookTrope = ref<boolean>(false)
async function updateBookTrope(bookTrope: Tables<'book_trope'>, newTitle: string) {
  isUpdatingBookTrope.value = true
  try {
    await supabase
      .from('book_trope')
      .update({
        title: newTitle,
      })
      .eq('id', bookTrope.id)
      .throwOnError()
  } finally {
    isUpdatingBookTrope.value = false
  }
}

const titleOfNewBookGenre = ref<string>('')
async function insertBookGenre() {
  await supabase
    .from('book_genre')
    .insert({
      title: titleOfNewBookGenre.value,
    })
    .throwOnError()

  titleOfNewBookGenre.value = ''
  await getBookGenres()
}

const titleOfNewBookSubgenre = ref<string>('')
async function insertBookSubgenre() {
  await supabase
    .from('book_subgenre')
    .insert({
      title: titleOfNewBookSubgenre.value,
    })
    .throwOnError()

  titleOfNewBookSubgenre.value = ''
  await getBookSubgenres()
}

const titleOfNewBookTrope = ref<string>('')
async function insertBookTrope() {
  await supabase
    .from('book_trope')
    .insert({
      title: titleOfNewBookTrope.value,
    })
    .throwOnError()

  titleOfNewBookTrope.value = ''
  await getBookTropes()
}
</script>

<template>
  <div class="w-full">
    <div class="mb-4">
      <h1>Kategorien</h1>
    </div>

    <VoltTabs value="genres">
      <VoltTabList>
        <VoltTab value="genres">Genres</VoltTab>
        <VoltTab value="subgenres">Subgenres</VoltTab>
        <VoltTab value="tropes">Tropes</VoltTab>
      </VoltTabList>
      <VoltTabPanels>
        <VoltTabPanel value="genres">
          <div v-if="bookGenres !== null" class="flex flex-col gap-2">
            <VoltCard v-for="bookGenre in bookGenres" :key="bookGenre.id">
              <template #content>
                <InplaceWithSave
                  v-model="bookGenre.title"
                  :disabled="isUpdatingBookGenre"
                  @save="updateBookGenre(bookGenre, $event)"
                />
              </template>
            </VoltCard>
            <VoltDivider />
            <VoltCard>
              <template #content>
                <VoltInputText v-model="titleOfNewBookGenre" fluid />
                <div class="mt-2 flex justify-end">
                  <VoltButton label="Anlegen" size="small" @click="insertBookGenre()" />
                </div>
              </template>
            </VoltCard>
          </div>
        </VoltTabPanel>
        <VoltTabPanel value="subgenres">
          <div v-if="bookSubgenres !== null" class="flex flex-col gap-2">
            <VoltCard v-for="bookSubgenre in bookSubgenres" :key="bookSubgenre.id">
              <template #content>
                <InplaceWithSave
                  v-model="bookSubgenre.title"
                  :disabled="isUpdatingBookSubgenre"
                  @save="updateBookSubgenre(bookSubgenre, $event)"
                />
              </template>
            </VoltCard>
            <VoltDivider />
            <VoltCard>
              <template #content>
                <VoltInputText v-model="titleOfNewBookSubgenre" fluid />
                <div class="mt-2 flex justify-end">
                  <VoltButton label="Anlegen" size="small" @click="insertBookSubgenre()" />
                </div>
              </template>
            </VoltCard>
          </div>
        </VoltTabPanel>
        <VoltTabPanel value="tropes">
          <div v-if="bookTropes !== null" class="flex flex-col gap-2">
            <VoltCard v-for="bookTrope in bookTropes" :key="bookTrope.id">
              <template #content>
                <InplaceWithSave
                  v-model="bookTrope.title"
                  :disabled="isUpdatingBookTrope"
                  @save="updateBookTrope(bookTrope, $event)"
                />
              </template>
            </VoltCard>
            <VoltDivider />
            <VoltCard>
              <template #content>
                <label for="book-trope-title">Neues Trope</label>
                <VoltInputText id="book-trope-title" v-model="titleOfNewBookTrope" fluid />
                <div class="mt-2 flex justify-end">
                  <VoltButton label="Anlegen" size="small" @click="insertBookTrope()" />
                </div>
              </template>
            </VoltCard>
          </div>
        </VoltTabPanel>
      </VoltTabPanels>
    </VoltTabs>
  </div>
</template>
