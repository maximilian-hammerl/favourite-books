<script setup lang="ts">
import { useTemplateRef } from 'vue'
import type { VoltButtonProps } from '@/volt/Button.vue'
import type { VoltMenuProps } from '@/volt/Menu.vue'

const props = defineProps<{
  button: VoltButtonProps
  menu: VoltMenuProps
}>()

const popupMenu = useTemplateRef('popup-menu')

function togglePopupMenu(event: Event) {
  popupMenu.value!.toggle(event)
}
</script>

<template>
  <VoltButton
    v-bind="props.button"
    aria-haspopup="true"
    aria-controls="popup-menu"
    @click="togglePopupMenu"
  />
  <VoltMenu v-bind="props.menu" ref="popup-menu" id="popup-menu" :popup="true" />
</template>
