<script setup lang="ts">
import StarIcon from '@primevue/icons/star'

import { user } from '@/lib/supabase.ts'
</script>

<template>
  <div
    class="py-4 px-8 bg-surface-0 dark:bg-surface-950 text-surface-700 dark:text-surface-0 flex flex-col min-h-screen gap-4"
  >
    <header class="flex-none">
      <div v-if="user" class="flex">
        <div class="basis-1/3 flex items-center justify-start">
          <StarIcon />
        </div>

        <nav class="basis-1/3 flex gap-2 items-center justify-center">
          <RouterLink :to="{ name: 'books' }">Bücher</RouterLink>
          <RouterLink :to="{ name: 'authors' }">Autoren</RouterLink>
        </nav>

        <div class="basis-1/3 flex items-center justify-end">
          <VoltButton label="Ausloggen" text />
        </div>
      </div>
      <span class="text-center" v-else>Lieblingsbücher</span>
    </header>
    <div class="flex-grow flex items-center justify-center">
      <RouterView />
    </div>
    <footer class="flex-none flex items-center justify-center">Created by Maxi with Love</footer>
  </div>
</template>
