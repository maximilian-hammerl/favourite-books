import './assets/main.css'
import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'

import App from './App.vue'
import router from './router'
import Button from '@/volt/Button.vue'
import SecondaryButton from '@/volt/SecondaryButton.vue'
import Dialog from '@/volt/Dialog.vue'
import InputText from '@/volt/InputText.vue'
import Paginator from '@/volt/Paginator.vue'
import Card from '@/volt/Card.vue'
import Skeleton from '@/volt/Skeleton.vue'
import InputNumber from '@/volt/InputNumber.vue'
import Textarea from '@/volt/Textarea.vue'
import Divider from '@/volt/Divider.vue'
import MultiSelect from '@/volt/MultiSelect.vue'
import Select from '@/volt/Select.vue'
import Toast from '@/volt/Toast.vue'
import Avatar from '@/volt/Avatar.vue'
import Tab from '@/volt/Tab.vue'
import Tabs from '@/volt/Tabs.vue'
import TabPanels from '@/volt/TabPanels.vue'
import TabPanel from '@/volt/TabPanel.vue'
import TabList from '@/volt/TabList.vue'
import Inplace from '@/volt/Inplace.vue'
import Badge from '@/volt/Badge.vue'
import ButtonGroup from '@/volt/ButtonGroup.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(PrimeVue, {
  unstyled: true,
})

app.use(ToastService)

app
  .component('VoltAvatar', Avatar)
  .component('VoltBadge', Badge)
  .component('VoltButton', Button)
  .component('VoltButtonGroup', ButtonGroup)
  .component('VoltCard', Card)
  .component('VoltDialog', Dialog)
  .component('VoltDivider', Divider)
  .component('VoltInplace', Inplace)
  .component('VoltInputNumber', InputNumber)
  .component('VoltInputText', InputText)
  .component('VoltMultiSelect', MultiSelect)
  .component('VoltPaginator', Paginator)
  .component('VoltSecondaryButton', SecondaryButton)
  .component('VoltSelect', Select)
  .component('VoltSkeleton', Skeleton)
  .component('VoltTab', Tab)
  .component('VoltTabList', TabList)
  .component('VoltTabPanel', TabPanel)
  .component('VoltTabPanels', TabPanels)
  .component('VoltTabs', Tabs)
  .component('VoltTextarea', Textarea)
  .component('VoltToast', Toast)

app.mount('#app')
