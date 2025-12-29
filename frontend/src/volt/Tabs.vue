<template>
  <Tabs
    :value="props.value"
    unstyled
    :pt="theme"
    :ptOptions="{
      mergeProps: ptViewMerge,
    }"
  >
    <slot></slot>
  </Tabs>
</template>

<script setup lang="ts">
import Tabs, { type TabsPassThroughOptions, type TabsProps } from 'primevue/tabs'
import { ref } from 'vue'
import { ptViewMerge } from './utils'

interface Props extends /* @vue-ignore */ TabsProps {}
const props = defineProps<Props>()

const theme = ref<TabsPassThroughOptions>({
  root: `border border-surface-700 dark:border-surface-0 flex flex-col`,
})
</script>
