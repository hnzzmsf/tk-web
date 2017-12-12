<template>
	<div class="data-config">
		<div class="main">
			<div class="data-config-header1">
				<span class="data-config-header1-left"><i class="el-icon-menu"></i> 系统用户管理</span>
				<span class="data-config-header1-right">
					<el-button type="info" size="mini" plain @click="createUser">新 增</el-button>
					<el-button v-show="selectNums==0" type="info" size="mini" plain disabled>删 除</el-button>
					<el-button v-show="selectNums!=0" type="info" size="mini" plain @click="changeUsers('0')">删 除</el-button>
					<el-button v-show="selectNums==0" type="info" size="mini" plain disabled>启 用</el-button>
					<el-button v-show="selectNums!=0" type="info" size="mini" plain @click="changeUsers('1')">启 用</el-button>
				</span>
			</div>
			<div class="data-config-header2">
				<el-form ref="form" :inline="true" size="small">
					<el-form-item label="姓名：">
					    <el-input placeholder="请输入全部或部分姓名" clearable v-model="formSearch.username"></el-input>
					</el-form-item>
					<el-form-item label="登录账号：">
					    <el-input placeholder="请输入全部或部分登录账号" clearable v-model="formSearch.account"></el-input>
					</el-form-item>
					<el-form-item label="用户状态：">
					    <el-select v-model="formSearch.status" placeholder="请选择">
					    	<el-option v-for="item in options" style="width: 203px"
						      	:key="item.value" :label="item.label" :value="item.value">
						    </el-option>
					    </el-select>
					</el-form-item>
					<el-form-item label="">
						<el-button type="primary" size="mini" plain @click="getData">搜索</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="data-config-main">
				<el-table size="mini" border class="loadingTable" :data="tableData" 
					@select="tableSelect" @select-all="tableSelect" @cell-click="tableCellClick">
					<el-table-column type="selection" width="35"></el-table-column>
					<el-table-column label="序号" width="80" align="center">
						<template slot-scope="scope">
							<span v-text="scope.$index + 1"></span>
					    </template>
					</el-table-column>
					<el-table-column prop="name" label="姓名" align="center"></el-table-column>
					<el-table-column prop="account" label="登录账号" align="center"></el-table-column>
					<el-table-column prop="crdate" label="创建时间" align="center"></el-table-column>
					<el-table-column prop="lastdate" label="最后登录时间" align="center"></el-table-column>
					<el-table-column label="用户状态" align="center" width="150">
						<template slot-scope="scope">
							<span v-if="scope.row.status != 1" style="color: red;">删除</span>
							<span v-else="">有效</span>
					    </template>
					</el-table-column>
					
					<el-table-column label="操作" width="200" align="center">
						<template slot-scope="scope">
					        <el-button type="text" size="small" @click="updateUser(scope.$index)">编 辑</el-button>
					        <el-button type="text" size="small" @click="resetPwd(scope.$index)" v-if="account != scope.row.account">重置密码</el-button>
					        <el-button type="text" size="small" @click="changeUserStatus(scope.$index , '0')" v-if="account != scope.row.account && scope.row.status == '1'" style="color:red;">删 除</el-button>
					        <el-button type="text" size="small" @click="changeUserStatus(scope.$index , '1')" v-else-if="account != scope.row.account && scope.row.status != '1'" >启 用</el-button>
					    </template>
					</el-table-column>
				</el-table>
			</div>
			<div class="data-config-pagination">
				<el-pagination v-show="tableData.length != 0"
			      	@size-change="sizeChange"
			      	@current-change="currentChange"
			      	:current-page="pagination.currentPage"
			      	:page-sizes="pagination.pageSizes"
			      	:page-size="pagination.pageSize"
			      	layout="total, sizes, prev, pager, next, jumper"
			      	:total="pagination.total">
			    </el-pagination>
			</div>
		</div>
		
		<el-dialog title="编辑系统用户" width="400px" :visible.sync="dialog.update.dataConfigUpdateDialogVisible" @close="clearPwdSubmit('updateName')">
			<div style="margin-top: -20px; margin-bottom: -30px;">
				<el-form ref="updateName" label-width="80px" :model="tableCellClickData" :rules="dialog.resetpwd.rules" size="small" >
					<el-form-item label="姓名" prop="name">
					    <el-input v-model="tableCellClickData.name" placeholder="请输入姓名" clearable></el-input>
					</el-form-item>
					<el-form-item label="登录账号">
					    <el-input disabled v-model="tableCellClickData.account"></el-input>
					</el-form-item>
				</el-form>
			</div>
		  	<span slot="footer" class="dialog-footer right">
		  		<el-button size="small" type="primary" @click="updateUserYes('updateName')">保 存</el-button>
		    	<el-button size="small" type="info"    @click="dialog.update.dataConfigUpdateDialogVisible = false">返 回</el-button>
		  	</span>
		</el-dialog>
		
		<el-dialog title="重置系统用户密码" width="400px" :visible.sync="dialog.resetpwd.dataConfigUpdateDialogVisible" @close="clearPwdSubmit('resetForm')">
			<div style="margin-top: -20px; margin-bottom: -30px;">
				<el-form ref="resetForm" label-width="80px" size="small" :model="tableCellClickData" :rules="dialog.resetpwd.rules" >
					<el-form-item label="姓名">
					    <el-input disabled v-model="tableCellClickData.name"></el-input>
					</el-form-item>
					<el-form-item label="登录账号">
					    <el-input disabled v-model="tableCellClickData.account"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="pwd">
					    <el-input type="password" clearable v-model="tableCellClickData.pwd"></el-input>
					</el-form-item>
					<el-form-item label="确认密码" prop="pwd2">
					    <el-input type="password" clearable v-model="tableCellClickData.pwd2"></el-input>
					</el-form-item>
				</el-form>
			</div>
		  	<span slot="footer" class="dialog-footer right">
		  		<el-button size="small" type="primary" @click="resetPwdSubmit('resetForm')">保 存</el-button>
		    	<el-button size="small" type="info"    @click="dialog.resetpwd.dataConfigUpdateDialogVisible = false">返 回</el-button>
		  	</span>
		</el-dialog>
		
		<el-dialog title="新增系统用户" width="400px" :visible.sync="dialog.create.dataConfigUpdateDialogVisible" @close="clearPwdSubmit('createForm')">
			<div style="margin-top: -20px; margin-bottom: -30px;">
				<el-form ref="createForm" label-width="80px" size="small" :model="tableCellClickData" :rules="dialog.resetpwd.rules" >
					<el-form-item label="姓名" prop="name">
					    <el-input clearable v-model="tableCellClickData.name"></el-input>
					</el-form-item>
					<el-form-item label="登录账号" prop="account">
					    <el-input clearable v-model="tableCellClickData.account"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="pwd">
					    <el-input type="password" clearable v-model="tableCellClickData.pwd"></el-input>
					</el-form-item>
					<el-form-item label="确认密码" prop="pwd2">
					    <el-input type="password" clearable v-model="tableCellClickData.pwd2"></el-input>
					</el-form-item>
				</el-form>
			</div>
		  	<span slot="footer" class="dialog-footer right">
		  		<el-button size="small" type="primary" @click="createUserYes('createForm')">保 存</el-button>
		    	<el-button size="small" type="info"    @click="dialog.create.dataConfigUpdateDialogVisible = false">返 回</el-button>
		  	</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'MenuUserManagement',
		data() {
			return {
				options: [
					{label: '全部', value: '0'},
					{label: '有效', value: '1'},
					{label: '删除', value: '2'},
				],
				selectNums: 0,
				selectDatas: [],
				tableData: [],
				tableCellClickData: {},
				userClickIndex: {},
				defaultUserStatus: {
					"有效": "删除",
					"删除": "有效",
				},
				formSearch: {
					username: '',
					account: '',
					status: '0',
				},
				pagination: {
					pageSizes: [10, 20, 30, 50],
					currentPage: 1,
					pageSize: 10,
					total: 40,
				},
				dialog: {
					create: {
						dataConfigUpdateDialogVisible: false,
						
					},
					update: {
						dataConfigUpdateDialogVisible: false,
						userData: {},
					},
					resetpwd: {
						dataConfigUpdateDialogVisible: false,
						rules: {
							pwd: [
					        	{validator: (rule, value, callback) => {
							        if (!value) {
							          	callback(new Error('请输入密码'));
							        } else {
							          	if (this.tableCellClickData.pwd2) {
											if(this.$refs.resetForm){
												this.$refs.resetForm.validateField('pwd2');
											}
											if(this.$refs.createForm){
												this.$refs.createForm.validateField('pwd2');
											}
							          	}
							          	callback();
							        }
							    }, trigger: 'blur'}
					        ],
					        pwd2: [
					        	{validator: (rule, value, callback) => {
							        if (!value) {
							          	callback(new Error('请再次输入密码'));
							        } else if (value !== this.tableCellClickData.pwd) {
          								callback(new Error('两次输入密码不一致!'));
							        } else {
							          	callback();
							        }
							    }, trigger: 'blur'}
					        ],
					        name: [
					        	{validator: (rule, value, callback) => {
							        if (!value) {
							          	callback(new Error('请输入姓名'));
							        } else {
							          	callback();
							        }
							    }, trigger: 'blur'}
					        ],
					        account: [
					        	{validator: (rule, value, callback) => {
							        if (!value) {
							          	callback(new Error('请输入账号'));
							        } else {
							          	callback();
							        }
							    }, trigger: 'blur'}
					        ],
						}
					}
				},
			}
		},
		methods: {
			tableCellClick(data){
				this.tableCellClickData = JSON.parse(JSON.stringify(data));
			},
			tableSelect(datas){
				this.selectDatas = datas;
				this.selectNums = datas ? datas.length : 0;
			},
			changeUserStatus(Index, status){
				this.userClickIndex = Index;
				var dt = {
					id: this.tableData[this.userClickIndex].id,
		            status: status
				};
				TK_URL.Method.httpAll(TK_URL.Menu.User.UpdateStatus, dt, (res)=>{
					this.tableData[this.userClickIndex].status = res.status;
				});
			},
			createUser(){
				this.tableCellClickData = {};
				this.dialog.create.dataConfigUpdateDialogVisible = true;
			},
			createUserYes(formName){
				this.$refs[formName].validate((valid) => {
		          	if (valid) {
		          		var dt = {
		            		name: this.tableCellClickData.name,
		            		account: this.tableCellClickData.account,
		            		password: this.tableCellClickData.pwd,
		            	};
		            	TK_URL.Method.httpAll(TK_URL.Menu.User.AddUser, dt, (res)=>{
							this.dialog.create.dataConfigUpdateDialogVisible = false;
							this.$message({message: '用户['+this.tableCellClickData.account+']新增成功', type: 'success'});
							this.getData();
						});
		          	} else {
		            	return false;
		          	}
		        });
			},
			updateUser(Index){
				this.userClickIndex = Index;
				this.dialog.update.dataConfigUpdateDialogVisible = true;
			},
			updateUserYes(formName){
				this.$refs[formName].validate((valid) => {
		          	if (valid) {
		            	var dt = {
		            		id: this.tableData[this.userClickIndex].id,
		            		name: this.tableCellClickData.name
		            	};
						TK_URL.Method.httpAll(TK_URL.Menu.User.UpdateName, dt, (res)=>{
							this.$store.state.name = res.name;
							this.tableData[this.userClickIndex].name = res.name;
							this.dialog.update.dataConfigUpdateDialogVisible = false;
						});
		          	} else {
		            	return false;
		          	}
		        });
			},
			resetPwd(Index){
				this.userClickIndex = Index;
				if(this.tableData[this.userClickIndex].account == this.$store.state.account){
//					this.$message({message: '密码修改成功，3s后跳转至登录页面！', type: 'success'});
					return ;
				}
				this.dialog.resetpwd.dataConfigUpdateDialogVisible = true;
			},
			resetPwdSubmit(formName){
				this.$refs[formName].validate((valid) => {
		          	if (valid) {
		          		var dt = {
		            		id: this.tableData[this.userClickIndex].id,
		            		password: this.tableCellClickData.pwd
		            	};
		            	TK_URL.Method.httpAll(TK_URL.Menu.User.UpdatePwd, dt, (res)=>{
							this.dialog.update.dataConfigUpdateDialogVisible = false;
							this.$message({message: '用户['+this.tableCellClickData.account+'], 密码修改成功！', type: 'success'});
						});
		            	this.dialog.resetpwd.dataConfigUpdateDialogVisible = false;
		          	} else {
		            	return false;
		          	}
		        });
			},
			clearPwdSubmit(formName){
				this.$refs[formName].clearValidate();
			},
			sizeChange(pageSize){
				this.pagination.pageSize = pageSize;
				this.getData();
			},
			currentChange(currentPage){
				this.pagination.currentPage = currentPage;
				this.getData();
			},
			changeUsers(status){
				status = status - 0;
				var arr = [];
				for(var i in this.selectDatas){
					arr.push({
						"id": this.selectDatas[i].id,
						"status": status
					});
				}
				TK_URL.Method.http(TK_URL.Menu.User.UpdateUserStatus, arr, (res)=>{
					this.$message({message: '状态修改成功！', type: 'success'});
					this.getData();
				});
			},
			getData(){
				var data = {
					page: this.pagination.currentPage,
					size: this.pagination.pageSize,
					name: this.formSearch.username,
					account: this.formSearch.account,
					status: this.formSearch.status,
				};
				TK_URL.Method.http(TK_URL.Menu.User.TableData, data, (res)=>{
					this.tableData = res.tableData;
					this.pagination.currentPage = res.currentPage;
					this.pagination.total = res.total;
				});
			},
		},
		mounted(){
			this.getData();
		},
		computed: {
			account(){
				return this.$store.state.account;
			},
		},
	}
</script> 

<style scoped="scoped">
.main{margin: 10px;}

.data-config-header1{position: relative; border-bottom: 2px solid #C8C8C8; height: 32px;}
.data-config-header1-left{padding: 0 10px; border-left: 2px solid #02A2CC;}
.data-config-header1-left i{color: #EC971F;}
.data-config-header1-right{position: absolute; right: 0;}
.data-config-header1-right button{width: 110px;}
.data-config-header2{padding: 10px 0; border-bottom: 1px solid #C8C8C8;}
.data-config-header2-span{display: inline-block; width: 300px;margin-right: 30px;}
.data-config-header2-span .select{display: inline-block;}
.data-config-header2 .el-form-item{margin-bottom: 0;margin-right: 50px;}
.data-config-main{margin-top: 15px;}
.data-config-pagination{text-align: right; margin-top: 10px;}
</style>