<script setup lang="ts">
import type { Tables } from '@/gen/database'

type Author = Pick<Tables<'author'>, 'first_name' | 'last_name'>

const author = defineModel<Author>({ required: true })
</script>

<template>
  <div>
    <label for="author-title">Vorname</label>
    <VoltInputText id="author-title" v-model="author.first_name" required fluid autofocus />
  </div>

  <div>
    <label for="author-title">Nachname</label>
    <VoltInputText id="author-title" v-model="author.last_name" required fluid />
  </div>
</template>
