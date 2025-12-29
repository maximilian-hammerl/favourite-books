<script setup lang="ts">
import { supabase, user } from '@/lib/supabase.ts'
import { useRoute } from 'vue-router'

const route = useRoute()

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
          <i class="pi pi-book"></i>
        </div>

        <nav class="basis-1/3 flex gap-2 items-center justify-center">
          <RouterLink :to="{ name: 'allBooks' }">
            <span
              :class="{
                'text-surface-600 dark:text-surface-400': route.name === 'allBooks',
                underline: route.name !== 'allBooks',
              }"
              >Bücher</span
            >
          </RouterLink>
          <RouterLink :to="{ name: 'allBookSeries' }">
            <span
              :class="{
                'text-surface-600 dark:text-surface-400': route.name === 'allBookSeries',
                underline: route.name !== 'allBookSeries',
              }"
              >Buchreihen</span
            >
          </RouterLink>
          <RouterLink :to="{ name: 'allAuthors' }">
            <span
              :class="{
                'text-surface-600 dark:text-surface-400': route.name === 'allAuthors',
                underline: route.name !== 'allAuthors',
              }"
              >Autoren</span
            >
          </RouterLink>
          <RouterLink :to="{ name: 'allCategories' }">
            <span
              :class="{
                'text-surface-600 dark:text-surface-400': route.name === 'allCategories',
                underline: route.name !== 'allCategories',
              }"
              >Kategorien</span
            >
          </RouterLink>
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

    <VoltToast />
  </div>
</template>
