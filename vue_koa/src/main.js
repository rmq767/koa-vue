import Vue from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/css/media.css'//引入媒体查询文件
import axios from 'axios'
import './http'
import store from './store'//引入store
import Unicon from './plugin/icon'//引入iocn
import animated from 'animate.css'//引入动画
import ElementUI from 'element-ui'//引入elementui
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';//用于在某些条件下隐藏元素
import mavonEditor from 'mavon-editor'//引入markdown编辑器
import 'mavon-editor/dist/css/index.css'
import highlight from 'highlight.js';//代码高亮
import 'highlight.js/styles/atom-one-dark.css'	//样式

Vue.use(mavonEditor)
Vue.use(ElementUI)
Vue.use(animated)
Vue.use(Unicon)
Vue.use(BootstrapVue)
Vue.prototype.$http = axios//可以使用$http发送请求

Vue.config.productionTip = false
Vue.directive('highlight',function (el) {
  let blocks = el.querySelectorAll('pre code');
  blocks.forEach((block)=>{
    highlight.highlightBlock(block)    
  })
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
