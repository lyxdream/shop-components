import type { App } from 'vue'

import type { Plugin } from 'vue'

import { CqButton,CqCheckbox } from '@components/index'

const Components = [
  CqButton,
  CqCheckbox
] as Plugin[]

const install = (app: App) => {
  Components.forEach(component => app.use(component));
}
export default {
  install
}