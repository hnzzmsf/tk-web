import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import routes from './router/router'
import store from './vuex/store'
import App from './App'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/url.js'

Vue.config.devtools=true;//开发模式
//Vue.config.productionTip = false

Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(ElementUI)

const router = new VueRouter({
//	用于处理浏览器url中的#
//	mode: 'history',
	routes
})

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')