import type { App } from 'vue'
import button from './CqButton/index.vue'

const components = [
  button
]
const install = (app: App) => {
  for (const key in components) {
    const component = components[key]
    app.component(key, component)
  }
}
export default {
  install
}

export {
  button
}
