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
import InputText from '@/volt/InputText.vue'
import Paginator from '@/volt/Paginator.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(PrimeVue, {
  unstyled: true,
})

app
  .component('VoltButton', Button)
  .component('VoltDialog', Dialog)
  .component('VoltInputText', InputText)
  .component('VoltPaginator', Paginator)
  .component('VoltSecondaryButton', SecondaryButton)

app.mount('#app')
