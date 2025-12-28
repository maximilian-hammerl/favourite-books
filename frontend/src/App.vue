<script setup lang="ts"></script>

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
