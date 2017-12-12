<template>
	<div class="homeheader">
		<div class="homeheader-left">
			<!--<span><i class="el-icon-info"></i></span>-->
			<span><img src="../../../static/img/logo1.png" width="50px"/></span>
			<span>泰康在线<br />大数据管理平台</span>
		</div>		
		<div class="homeheader-right">
			<el-dropdown @command="userItem">
			  	<span v-text="username"></span>
			  	<el-dropdown-menu slot="dropdown">
				    <el-dropdown-item command="changePwd">修改密码</el-dropdown-item>
			  	</el-dropdown-menu>
			</el-dropdown>
			
			<span class="logout" @click="logout">退出<i class="el-icon-d-arrow-right"></i></span>
		</div>
		
		<HomeMenu @sendIndex="showIndex"></HomeMenu>
		
		<el-dialog title="修改密码" width="400px" :visible.sync="dialog.dataDialogVisible" @close="clearPwdSubmit('resetForm')" append-to-body>
			<div style="margin-top: -20px; margin-bottom: -30px;">
				<el-form ref="resetForm" label-width="80px" size="small" :model="formData" :rules="dialog.rules" >
					<el-form-item label="姓名">
					    <el-input disabled v-model="username"></el-input>
					</el-form-item>
					<el-form-item label="登录账号">
					    <el-input disabled v-model="account"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="pwd">
					    <el-input type="password" clearable v-model="formData.pwd"></el-input>
					</el-form-item>
					<el-form-item label="确认密码" prop="pwd2">
					    <el-input type="password" clearable v-model="formData.pwd2"></el-input>
					</el-form-item>
				</el-form>
			</div>
		  	<span slot="footer" class="dialog-footer right">
		  		<el-button size="small" type="primary" @click="resetPwdSubmit('resetForm')">保 存</el-button>
		    	<el-button size="small" type="info"    @click="clearPwdSubmit('resetForm')">返 回</el-button>
		  	</span>
		</el-dialog>
	</div>
	
</template>

<script>
	import HomeMenu from './HomeMenu'
	export default {
		name: 'HomeHeader',
		data() {
			return {
				formData: {},
				dialog: {
					dataDialogVisible: false,
					rules: {
						pwd: [
				        	{validator: (rule, value, callback) => {
						        if (!value) {
						          	callback(new Error('请输入密码'));
						        } else {
						          	if (this.formData.pwd2) {
						            	this.$refs.resetForm.validateField('pwd2');
						          	}
						          	callback();
						        }
						    }, trigger: 'blur'}
				        ],
				        pwd2: [
				        	{validator: (rule, value, callback) => {
						        if (!value) {
						          	callback(new Error('请再次输入密码'));
						        } else if (value !== this.formData.pwd) {
      								callback(new Error('两次输入密码不一致!'));
						        } else {
						          	callback();
						        }
						    }, trigger: 'blur'}
				        ],
					}
				}
			}
		},
		methods: {
			userItem(commond){
				if(commond == 'changePwd'){
					this.dialog.dataDialogVisible = true;
				}
			},
			resetPwdSubmit(formName){
				this.$refs[formName].validate((valid) => {
		          	if (valid) {
		            	var dt = {
							id: this.id,
				            password: this.formData.pwd
						};
						TK_URL.Method.httpAll(TK_URL.Menu.User.UpdatePwd, dt, (res)=>{
							this.dialog.dataDialogVisible = false;
							this.$message({message: '密码修改成功，3s后跳转至登录页面！', type: 'success'});
							setTimeout(()=>{
								this.$router.push('/Login');
							}, 2900);
						});
		          	} else {
		            	return false;
		          	}
		        });
			},
			clearPwdSubmit(formName){
				this.dialog.dataDialogVisible = false;
				this.$refs['resetForm'].clearValidate();
			},
			logout(){
				this.$message({
			      	message: '已退出',
			      	type: 'info'
			    });
			    setTimeout(()=>{
			    	this.$router.push('/Login');
			    }, 1000);
			},
			showIndex(Index){
				this.$emit('sendIndex', Index);
			}
		},
		computed: {
			id(){
				return this.$store.state.id;
			},
			username(){
				return this.$store.state.name;
			},
			account(){
				return this.$store.state.account;
			},
		},
		components: {
			HomeMenu
		}
	}
</script>

<style>
.homeheader{position: fixed;-webkit-user-select: none; top: 0; right: 0; left: 0; z-index: 10;}
.homeheader-left{position: absolute; left: 10px; top: 0;z-index: 1;height: 60px; font-family: "微软雅黑"; color: #F2F3F3; vertical-align: middle;line-height: 60px; font-size: 24px;cursor: pointer;}
.homeheader-left span:nth-child(1){display: inline-block;}
.homeheader-left span:nth-child(2){line-height: 30px; font-size: 16px;display: inline-block; text-align: center;}
.homeheader-right{position: absolute; right: 0; line-height: 60px; z-index: 1;}
.homeheader-right span{display: inline-block;text-align: center; color: #F2F3F3; font-size: 14px; cursor: pointer;}
.homeheader-right span:hover{background-color: rgb(67,74,80);}
.homeheader-right span:nth-child(1){width: 100px; text-align: center;border-left: 2px solid #FFFFFF;margin-right: -4px;}
.homeheader-right span:nth-child(2){width: 80px;border-left: 2px solid #FFFFFF;}
.homeheader-right span:nth-child(2):hover{text-decoration: underline;}
</style>