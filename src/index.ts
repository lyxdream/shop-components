import type { App } from 'vue'

import Components from './component'
// export const makeInstaller = (components: Plugin[] = []) => {
//   const install = (app: App) => {
//     components.forEach(component => app.use(component))
//   }
//   return {
//     install,
//   }
// }
const install = (app: App) => {
  Components.forEach(component => app.use(component));
}

export default {
  install
}
// export const install = installer.install