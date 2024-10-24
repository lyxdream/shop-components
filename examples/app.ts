
import { createApp } from 'vue'
import './app.scss'
import '../taro-ui-vue3/dist/style/index.scss'
import { createUI } from '../taro-ui-vue3/dist/index.js'
console.log(createUI,'==createUI')
import CqShopComponents from '../lib/cq-shop-components.js'
// console.log(CqShopComponents,'==CqShopComponents')
// import CqButton from '../lib/cq-Button.js'
// console.log(CqButton,'==CqButton')
// import CqButton from '../packages/cq-Button/index'
// console.log(CqButton,'==CqButton')
const App = createApp({
  onShow (options) {
    console.log(options,'==options')
    console.log('App onShow.11111')
    // console.log(CqShopComponents,'==CqShopComponents')
  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})
const tuv3 = createUI()
App.use(tuv3)
// const tuv3 = createUI({
//   AtButton,
// })
// App.use(tuv3)
App.use(CqShopComponents)
// App.use(CqButton)
export default App
