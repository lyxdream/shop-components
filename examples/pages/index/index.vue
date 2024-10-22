<template>
  <view class="index">
    首页1111
    <text>{{ msg }}</text>
  </view>
</template>

<script>
import { ref } from 'vue'
// import './index.scss'

export default {
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
