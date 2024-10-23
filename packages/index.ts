import type { App } from 'vue'
import CqButton from './cq-button/index'

console.log(CqButton,'==CqButton')
const components = [
  CqButton
]
export const install = (app: App) => {
  for (const key in components) {
    const component = components[key]
    app.component(key, component)
  }
}
// export {
//   CqButton
// }
export default {
  install,
  CqButton
}

