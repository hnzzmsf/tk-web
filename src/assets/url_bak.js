import Vue from 'vue'
import VueResource from 'vue-resource'
import { Message } from 'element-ui';
import { Loading } from 'element-ui';
Vue.use(VueResource)

//var BasicUrl = "https://faysunshine.com";
//var BasicUrl = "";
var BasicUrl = "http://172.20.10.4:8080";

window.TK_URL = {
	Menu: {
		DataSource: {
			TableData: BasicUrl + "/static/json/MenuDataSourceManagement.json",
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
			TableData: BasicUrl + "/static/json/MenuTaskManagement.json",
			tasks: BasicUrl + "/static/json/MenuTaskTasks.json",
		},
		User: {
			TableData: BasicUrl + "/static/json/MenuUserManagement.json",
		},
		Log: {
			Login: {
				TableData: BasicUrl + "/static/json/MenuLogLogin.json",
			},
			Operation: {
				TableData: BasicUrl + "/static/json/MenuLogOperation.json",
			},
		}
	},
	Login: {
		Url: BasicUrl + '/users/login',
	},
	Method: {
		http(url, data, callback, callbackError){
			var loadingFlag = Loading.service({target: document.querySelector('.homebody .loadingTable')});
			Vue.http({
//				method: 'JSONP',
				method: 'POST',
				url: url,
				body: data,
//				emulateJSON: true,
//				jsonpCallback: '_'
			}).then(
			(res) => {
				if(res.body.code == 200){
					callback(res.body.data);
					loadingFlag.close();
				}else{
					loadingFlag.close();
					if(callbackError){
						callbackError(res.body);
					}else{
						Message({message: res.body.msg, type: 'error'});
					}
				}
			}, (res) => {
				loadingFlag.close();
				Message({message: '请求服务器失败: ' + res.statusText, type: 'error'});
			});
		},
		httpQuietly(url, data, callback, callbackError){
			Vue.http({
				method: 'POST',
				url: url,
				body: data,
			}).then(
			(res) => {
				if(res.body.code == 200){
					callback(res.body.data);
				}else{
					if(callbackError){
						callbackError(res.body);
					}else{
						Message({message: res.body.msg, type: 'error'});
					}
				}
			}, (res) => {
				Message({message: '请求服务器失败: ' + res.statusText, type: 'error'});
			});
		},
	}
};

