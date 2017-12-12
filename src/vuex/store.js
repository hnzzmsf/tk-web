import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	// 定义状态
	state: {
        "id": "",
        "name": "",
        "account": "",
        "admin": "0",
        "token": "",
	}
})

export default store