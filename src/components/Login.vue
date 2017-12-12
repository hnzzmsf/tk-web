<template>
	<div class="login-container">
		<div class="login">
			<header>
				<span><img src="../../static/img/logo3.png" width="80px"/></span>
				<span v-text="title"></span>
			</header>
			<dl>
				<dd>
					<label>账号：</label>
					<input type="text" class="user" v-model="formData.username" :placeholder="formDataPrompting.username">
				</dd>
				<dd>
					<label>密码：</label>
					<input type="password" class="paw" v-model="formData.password" :placeholder="formDataPrompting.password">
				</dd>
			</dl>
			<span v-show="errormsgShow" class="error" v-text="errormsg"></span>
			<footer>
				<el-button class="btn" :loading="loginLoading" v-html="loginText" @click="login"></el-button>
			</footer>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Login',
		data() {
			return {
				title: '大数据平台',
				formDataPrompting: {
					username: '请输入用户名',
					password: '请输入密码',
				},
				formData: {
					username: 'admin',
					password: '123',
				},
				loginLoading: false,
				loginLoadingText: '<i class="el-icon-loading"></i> 登录中',
				loginDefaultText: '登录',
				loginText: '登录',
				errormsg: '* 您输入的账号或者密码错误,请重新输入！',
				errormsgShow: false
			}
		},
		methods: {
			login(){
				if(!this.formData.username){
					this.errormsgShow = true;
					this.errormsg = '* 账号不能为空！';
					return ;
				}
				if(!this.formData.password){
					this.errormsgShow = true;
					this.errormsg = '* 密码不能为空！';
					return ;
				}
				
				this.errormsgShow = false;
				
				this.loginLoading = true;
				this.loginText = this.loginLoadingText;
					
				TK_URL.Method.httpQuietly(TK_URL.Login.Url, {
					account: this.formData.username,
    				password: this.formData.password
				}, (res)=>{
					this.$store.state.id = res[1].id;
					this.$store.state.name = res[1].name;
					this.$store.state.account = res[1].account;
					this.$store.state.admin = res[1].admin;
					this.$store.state.token = res[0].token_type + res[0].access_token;
					this.$router.push('/Home');
				}, (res)=>{
					this.loginLoading = false;
					this.loginText = this.loginDefaultText;
					this.errormsgShow = true;
					this.errormsg = '* ' + res.msg + '！';
				});
			}
		},
		mounted(){
			this.$store.state.id = "";
			this.$store.state.name = "";
			this.$store.state.account = "";
			this.$store.state.admin = "0";
			this.$store.state.token = "";
		}
	}
</script>

<style>
.login-container{font-size:12px;color:#333;width:100%;height:100%;background:url(../../static/img/bg_349466f.jpg);background-size:cover;position: absolute; -webkit-user-select: none;}
.login input,.login button,.login select,.login textarea{outline:0}
.login input:-webkit-autofill{-webkit-box-shadow:0 0 0 1000px #fff inset}
.login button{border:0;cursor:pointer;}

.login{width:500px;height:500px;position:fixed;top:50%;left:50%;margin:-250px 0 0 -250px;background:#f2f3f3;border-radius:6px;box-shadow:0 0 20px rgba(0,0,0,.5)}
.login header{height:100px;line-height:100px;text-align:center;background:#1d2329;font-size:30px;color:#fff;border-top-right-radius:6px;border-top-left-radius:6px}
.login header{background-color: rgb(84, 92, 100);}
.login header span:nth-child(1){position: absolute; top: 22px; left: 95px;}
.login header span:nth-child(2){display: inline-block; padding-left: 10px;}
.login dl{padding:40px 30px}
.login dl dd{height:96px;line-height:96px;padding:0 28px;background:#fff}
.login dl dd:first-child{border-bottom:1px solid #c8c8c8}
.login dl dd label{font-size:24px;color:#606366;vertical-align:middle}
.login dl dd input{width:300px;height:54px;vertical-align:middle;font-size:24px;color:#606366;border:0;margin-top: 3px;}
.login footer{padding:0 30px}
.login footer .btn{height:76px;line-height:76px;text-align:center;font-size:30px;background:#ff712b;color:#fff;width:440px;border:0;padding: 0;}
.login .error{font-size:14px;color:red;position:absolute;margin:-30px 0 0 30px;}
</style>