import type { App } from 'vue'

import Components from './component'
const install = (app: App) => {
  Components.forEach(component => app.use(component));
}
export default {
  install
}