import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'

Vue.config.productionTip = false

Vue.use(ElementUI);
import Contextmenu from 'vue-contextmenujs'
Vue.use(Contextmenu);//自定义右键菜单，暂时没用上
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
