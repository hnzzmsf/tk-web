import Vue from 'vue'
import VueResource from 'vue-resource'
import { Message } from 'element-ui';
import { Loading } from 'element-ui';
import store from '../vuex/store'
Vue.use(VueResource)

//var BasicUrl = "https://faysunshine.com";
//var BasicUrl = "";
var BasicUrl = "http://172.20.10.4:8080";

window.TK_URL = {
	Menu: {
		DataSource: {
			TableData: BasicUrl + "/datasources/selectPageDatasources",
			CreateSource: BasicUrl + "/datasources/addDatasource",
			UpdateSource: BasicUrl + "/datasources/upDatasource",
			DeleteSource: BasicUrl + "/datasources/deleteDatasources",
			TestConnect: BasicUrl + "/datasources/testConnect",
			Names: BasicUrl + "/static/json/MenuDataSourceNames.json",
		},
		DataAccess: {
			TableData: BasicUrl + "/static/json/MenuDataAccessManagement.json",
		},
		Runtime: {
			TableData: BasicUrl + "/static/json/MenuRuntimeTableData.json",
			TaskInfo: BasicUrl + "/static/json/MenuRuntimeTaskInfoTableData.json",
		},
		Task: {
			TableData: BasicUrl + "/tasks/selectTasks",
			CreateTask: BasicUrl + "/tasks/addTask",
			UpdateTask: BasicUrl + "/tasks/upTask",
			DeleteTask: BasicUrl + "/tasks/deleteTasks",
			Tasks: BasicUrl + "/static/json/MenuTaskTasks.json",
		},
		User: {
			TableData: BasicUrl + "/users/selectAll",
			AddUser: BasicUrl + "/users/addUser",
			UpdateStatus: BasicUrl + "/users/upUserStatus",
			UpdateUserStatus: BasicUrl + "/users/upUsersStatus",
			UpdateName: BasicUrl + "/users/upUser",
			UpdatePwd: BasicUrl + "/users/upUserPwd",
			
			
		},
		Log: {
			Login: {
				TableData: BasicUrl + "/loginlog/selectLoginlog",
			},
			Operation: {
				TableData: BasicUrl + "/opes/selectOpes",
			},
		}
	},
	Login: {
		Url: BasicUrl + '/users/login',
	},
	Method: {
		exec(url, data, callback, callbackError, dom){
			var loadingFlag = null;
			loadingFlag = dom ? loadingFlag = Loading.service({target: document.querySelector(dom)}) : null;
			Vue.http({
//				method: 'JSONP',
				method: 'POST',
				url: url,
				body: data,
//				emulateJSON: true,
//				jsonpCallback: '_',
				headers: {
					Authorization: store.state.token
				}
			}).then(
			(res) => {
				if(res.body.code == 200){
					callback(res.body.data);
					loadingFlag && loadingFlag.close();
				}else{
					loadingFlag && loadingFlag.close();
					if(callbackError){
						callbackError(res.body);
					}else{
						Message({message: res.body.msg, type: 'error'});
					}
				}
			}, (res) => {
				loadingFlag && loadingFlag.close();
				Message({message: '请求服务器失败: ' + res.statusText, type: 'error'});
			});
		},
		http(url, data, callback, callbackError){
			TK_URL.Method.exec(url, data, callback, callbackError, '.homebody .loadingTable');
		},
		httpAll(url, data, callback, callbackError){
			TK_URL.Method.exec(url, data, callback, callbackError, 'body');
		},
		httpQuietly(url, data, callback, callbackError){
			TK_URL.Method.exec(url, data, callback, callbackError);
		},
	}
};

