<template>
  <view class="index">
    <!-- <cq-button /> -->
    <cq-button />
    <!-- <AtButton type="primary" size="normal">
      按钮文案
    </AtButton> -->
    首页1111
    <!-- <text>{{ msg }}</text> -->
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
