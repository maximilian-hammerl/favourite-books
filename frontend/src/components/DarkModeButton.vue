<script setup lang="ts">
import { ref } from 'vue'

const isDarkMode = ref<boolean>(false)

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value
  document.body.classList.toggle('my-app-dark', isDarkMode.value)
}
</script>

<template>
  <VoltContrastButton
    :icon="isDarkMode ? 'pi pi-moon' : 'pi pi-sun'"
    rounded
    outlined
    size="small"
    @click="toggleDarkMode()"
  />
</template>

<style scoped></style>
