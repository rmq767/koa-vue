<template>
  <div id="app">
    <transition
      enter-active-class="animated zoomIn faster"
      leave-active-class="animated zoomOut faster"
      class="tran"
      mode="out-in"
    >
      <router-view class="show_animate"/>
    </transition>
    <!-- <loading v-if="this.$store.state.isShow"></loading> -->
    <div class="d-none d-lg-block">
    <scollTop></scollTop>
    </div>
  </div>
</template>

<script>
import jwt_decode from 'jwt-decode'
import scollTop from './components/ScollTop.vue'
// import loading from './components/Loading.vue'
export default {
    created() {
      if(localStorage.eleToken){
      // 解析token
      const decode = jwt_decode(localStorage.eleToken)
      // token存储到vuex中
      this.$store.dispatch('setAuthenticated', !this.isEmpty(decode))
      this.$store.dispatch('setUser', decode) 
      }
    },
    methods: {
      isEmpty(value){
        return (
          value === undefined ||
          value === null ||
          (typeof value === 'object' && Object.keys(value).length === 0) ||
          (typeof value === 'string' && value.trim().length === 0)
        )
      }
    },
    components:{
      scollTop,
      // loading
    }
}
</script>>

<style lang="less">
@import url('https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.css');
*{
  margin: 0;
  padding: 0;
}
html,body,#app{
  width: 100%;
  height: 100%;
  .tran{
    position: relative;
    .show_animate{
      position: absolute;
    }
  }
}
</style>
