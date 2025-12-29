<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import type { Tables } from '@/gen/database'
import { supabase } from '@/lib/supabase.ts'
import FormattedAuthorName from '@/components/formatted/FormattedAuthorName.vue'

const route = useRoute()

const authorId = computed<string>(() => route.params.authorId as string)

const author = ref<Tables<'author'> | null>(null)

async function getAuthor() {
  const { data } = await supabase
    .from('author')
    .select()
    .eq('id', authorId.value)
    .single()
    .throwOnError()
  author.value = data
}

onMounted(getAuthor)
</script>

<template>
  <div class="w-full">
    <div v-if="author !== null">
      <h1>
        <FormattedAuthorName :author="author" />
      </h1>
    </div>

    <div v-else>
      <VoltSkeleton height="10rem" />
    </div>
  </div>
</template>
