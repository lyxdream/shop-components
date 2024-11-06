
import type { App, Component,Plugin } from 'vue'

export type SFCWithInstall<T> = T & Plugin

export const withInstall = <T extends Component>(comp: T) => {
  const _comp = comp as SFCWithInstall<T>
  _comp.install = (app: App): void  => {
    if (_comp.name) {
      app.component(_comp.name, _comp)
    }
  }
  return _comp as SFCWithInstall<T>
}