<script setup lang="ts">
import { ref } from 'vue'
import type { Tables } from '@/gen/database'

type PaginatedBookGenre = Tables<'book_genre'>

const bookGenres = ref<Array<PaginatedBookGenre> | null>(null)
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
          <div v-if="bookGenres !== null">
            <VoltCard v-for="bookGenre in bookGenres" :key="bookGenre.id">
              <template #content>
                {{ bookGenre.title }}
              </template>
            </VoltCard>
          </div>
        </VoltTabPanel>
        <VoltTabPanel value="subgenres">
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
            laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
            architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
            sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
            voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
          </p>
        </VoltTabPanel>
        <VoltTabPanel value="tropes">
          <p>
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium
            voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint
            occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt
            mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et
            expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque
            nihil impedit quo minus.
          </p>
        </VoltTabPanel>
      </VoltTabPanels>
    </VoltTabs>
  </div>
</template>
