<script setup lang="ts">
import StarIcon from '@primevue/icons/star'

import { supabase, user } from '@/lib/supabase.ts'

async function logout() {
  await supabase.auth.signOut()
}
</script>

<template>
  <div
    class="p-4 bg-surface-0 dark:bg-surface-950 text-surface-700 dark:text-surface-0 flex flex-col min-h-screen gap-4"
  >
    <header class="flex-none">
      <div v-if="user" class="flex">
        <div class="basis-1/3 flex items-center justify-start">
          <StarIcon />
        </div>

        <nav class="basis-1/3 flex gap-2 items-center justify-center">
          <RouterLink :to="{ name: 'allBooks' }">Bücher</RouterLink>
          <RouterLink :to="{ name: 'allBookSeries' }">Buchreihen</RouterLink>
          <RouterLink :to="{ name: 'allAuthors' }">Autoren</RouterLink>
        </nav>

        <div class="basis-1/3 flex items-center justify-end">
          <VoltButton label="Ausloggen" text @click="logout()" />
        </div>
      </div>
      <div class="w-full text-center" v-else>Lieblingsbücher</div>
    </header>

    <VoltDivider class="flex-none" />

    <div class="mx-4 flex-grow flex items-center justify-center">
      <RouterView />
    </div>

    <VoltDivider class="flex-none" />

    <footer class="flex-none flex items-center justify-center">Von Maxi mit 💚</footer>
  </div>
</template>
