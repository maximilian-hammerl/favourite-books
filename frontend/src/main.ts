import './assets/main.css'
import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'

import App from './App.vue'
import router from './router'
import Button from '@/volt/Button.vue'
import SecondaryButton from '@/volt/SecondaryButton.vue'
import Dialog from '@/volt/Dialog.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(PrimeVue, {
  unstyled: true,
})

app
  .component('VoltButton', Button)
  .component('VoltSecondaryButton', SecondaryButton)
  .component('VoltDialog', Dialog)

app.mount('#app')
