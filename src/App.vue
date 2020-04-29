<template>
  <div id="app">
    <router-view class="main"></router-view>
  </div>
</template>
<script>
  import checkToken from '@/api/check-token'
  export default {
    name: 'app',
    created() {
      checkToken.refreshToken() // 用户主动刷新页面 主动获取token 计时任务重新开始
      // checkToken.saveToken(response && response.content.token);
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  @import "assets/style/index.scss";

  #app {
    height: 100%;
  }

  .main {
    background: #ededed;;
  }
</style>
