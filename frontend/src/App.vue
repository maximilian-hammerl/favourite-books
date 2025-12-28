<script setup lang="ts">
import { supabase } from '@/lib/supabase.ts'
import { useRouter } from 'vue-router'

const router = useRouter()

supabase.auth.onAuthStateChange((event) => {
  switch (event) {
    case 'SIGNED_IN':
      console.info('Forwarding to books on sign in')
      void router.push({ name: 'books' })
      break

    case 'SIGNED_OUT':
      console.info('Forwarding to login on sign out')
      void router.push({ name: 'login' })
      break

    default:
      console.debug('Ignoring auth event', event)
  }
})
</script>

<template>
  <div
    class="bg-surface-0 dark:bg-surface-950 text-surface-700 dark:text-surface-0 flex flex-col min-h-screen"
  >
    <header class="flex-none"></header>
    <div class="flex-grow flex items-center justify-center">
      <RouterView />
    </div>
    <footer class="flex-none"></footer>
  </div>
</template>
