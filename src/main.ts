import { createApp } from 'vue'
import 'uno.css'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus'

import './style/index.css'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.mount('#app')
