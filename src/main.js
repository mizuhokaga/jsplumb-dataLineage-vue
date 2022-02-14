import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Contextmenu from 'vue-contextmenujs'
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import '@/style/index.less'

Vue.config.productionTip = false

Vue.use(Contextmenu);//自定义右键菜单，暂时没用上
Vue.use(ViewUI);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')