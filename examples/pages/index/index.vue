<template>
  <view class="index">
    <cq-button />
    <cq-checkbox />
    <text>{{ msg }}</text>
  </view>
</template>

<script>
// import CqButton  from '../../../lib/cq-button.js'
import { ref } from 'vue'
// import './index.scss'

export default {
  // components:{
  //   CqButton
  // },
  setup () {
    const msg = ref('Hello world')
    return {
      msg
    }
  }
}
</script>
<style lang="scss">
@import './index.scss'
</style>
