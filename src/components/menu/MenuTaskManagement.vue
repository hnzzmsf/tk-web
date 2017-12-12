<template>
	<div class="data-config">
		<div class="main">
			<div class="data-config-header1">
				<span class="data-config-header1-left"><i class="el-icon-menu"></i> 任务管理</span>
				<span class="data-config-header1-right">
					<el-button type="info" size="mini" plain @click="createTask">新 增</el-button>
					<el-button v-show="selectNums==0" type="info" size="mini" plain disabled>删 除</el-button>
					<el-button v-show="selectNums!=0" type="info" size="mini" plain @click="deleteTask">删 除</el-button>
				</span>
			</div>
			<div class="data-config-header2">
				<el-form ref="form" :inline="true" size="small">
					<el-form-item label="任务名称">
					    <el-input placeholder="请输入全部或部分任务名称" clearable v-model="formSearch.taskname"></el-input>
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
					<el-table-column prop="name" label="任务名称" align="center"></el-table-column>
					<el-table-column prop="confName" label="配置文件名称" align="center"></el-table-column>
					<el-table-column prop="rundate" label="计划执行时间" align="center"></el-table-column>
					<el-table-column prop="desc" label="说明" align="center"></el-table-column>
					
					<el-table-column label="操作" width="100" align="center">
						<template slot-scope="scope">
					        <el-button type="text" size="small" @click="updateTask(scope.$index)">修 改</el-button>
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
		
		<el-dialog title="任务管理" width="400px" :visible.sync="dialog.update.dataConfigUpdateDialogVisible" @close="clearSubmit('taskform')">
			<div style="margin-top: -20px; margin-bottom: -30px;">
				<el-form ref="taskform" label-width="105px" size="small" :model="tableCellClickData" :rules="dialog.rules">
					<el-form-item label="任务名称" prop="name">
					    <el-input v-model="tableCellClickData.name" placeholder="请输入任务名称" clearable></el-input>
					</el-form-item>
					<el-form-item label="配置文件名称" prop="confName">
					    <el-input v-model="tableCellClickData.confName" placeholder="请输入配置文件名称" clearable></el-input>
					</el-form-item>
					<el-form-item label="计划执行时间" prop="rundate">
					    <el-time-picker type="fixed-time" v-model="tableCellClickData.rundate" value-format="HH:mm:ss" placeholder="请输入计划执行时间" style="width: 100%;"></el-time-picker>
					</el-form-item>
					<el-form-item label="说明">
					    <el-input v-model="tableCellClickData.desc" placeholder="请输入任务备注" clearable></el-input>
					</el-form-item>
				</el-form>
			</div>
		  	<span slot="footer" class="dialog-footer right">
		  		<el-button size="small" type="primary" @click="taskSubmit('taskform')" v-text="dialog.btn">保 存</el-button>
		    	<el-button size="small" type="info"    @click="dialog.update.dataConfigUpdateDialogVisible = false">返 回</el-button>
		  	</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'MenuTaskManagement',
		data() {
			return {
				selectNums: 0,
				selectDatas: [],
				tableData: [],
				tableCellClickData: {},
				tableIndex: 0,
				formSearch: {
					taskname: '',
				},
				pagination: {
					pageSizes: [10, 20, 30, 50],
					currentPage: 1,
					pageSize: 10,
					total: 40,
				},
				dialog: {
					btn: '',
					update: {
						dataConfigUpdateDialogVisible: false,
					},
					rules: {
						name: [
				        	{validator: (rule, value, callback) => {
						        if (!value) {
						          	callback(new Error('请输入任务名称'));
						        } else {
						          	callback();
						        }
						    }, trigger: 'blur'}
				        ],
				        confName: [
				        	{validator: (rule, value, callback) => {
						        if (!value) {
						          	callback(new Error('请输入配置文件名称'));
						        } else {
						          	callback();
						        }
						    }, trigger: 'blur'}
				        ],
				        rundate: [
				        	{validator: (rule, value, callback) => {
						        if (!value) {
						          	callback(new Error('请输入计划执行时间'));
						        } else {
						          	callback();
						        }
						    }, trigger: 'blur'}
				        ],
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
			createTask(){
				this.tableCellClickData = {}; 	
				this.dialog.btn = '新 增';
				this.dialog.update.dataConfigUpdateDialogVisible = true;
			},
			updateTask(Index){
				this.tableIndex = Index;
				this.dialog.btn = '更 新';
				this.dialog.update.dataConfigUpdateDialogVisible = true;
			},
			deleteTask(){
				this.$confirm('此操作将永久删除任务, 是否继续?', '提示', {
		          	type: 'warning'
		        }).then(() => {
		        	var arr = [];
		        	for(var i in this.selectDatas){
		        		arr.push({
		        			id: this.selectDatas[i].id
		        		});
		        	}
		        	TK_URL.Method.httpAll(TK_URL.Menu.Task.DeleteTask, arr, (res)=>{
						this.dialog.update.dataConfigUpdateDialogVisible = false;
						this.$message({message: '任务删除成功', type: 'success'});
						this.getData();
					});
		        }).catch(() => {
		       	  	console.log('取消删除!');
		        });
			},
			taskSubmit(formName){
				this.$refs[formName].validate((valid) => {
		          	if (valid) {
		          		var dt = {
		            		name: this.tableCellClickData.name,
		            		confName: this.tableCellClickData.confName,
		            		rundate: this.tableCellClickData.rundate,
		            		desc: this.tableCellClickData.desc,
		            	};
		            	if(this.dialog.btn == '更 新'){
		            		dt.id = this.tableCellClickData.id;
			            	TK_URL.Method.httpAll(TK_URL.Menu.Task.UpdateTask, dt, (res)=>{
								this.dialog.update.dataConfigUpdateDialogVisible = false;
								this.$message({message: '任务【'+this.tableCellClickData.name+'】更新成功', type: 'success'});
								this.tableData[this.tableIndex].name = this.tableCellClickData.name;
								this.tableData[this.tableIndex].confName = this.tableCellClickData.confName;
								this.tableData[this.tableIndex].rundate = this.tableCellClickData.rundate;
								this.tableData[this.tableIndex].desc = this.tableCellClickData.desc;
							});
		            	}else if(this.dialog.btn == '新 增'){
		            		TK_URL.Method.httpAll(TK_URL.Menu.Task.CreateTask, dt, (res)=>{
								this.dialog.update.dataConfigUpdateDialogVisible = false;
								this.$message({message: '任务【'+this.tableCellClickData.name+'】新增成功', type: 'success'});
								this.getData();
							});
		            	}
		          	} else {
		            	return false;
		          	}
		        });
			},
			clearSubmit(formName){
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
			getData(){
				var data = {
					page: this.pagination.currentPage,
					size: this.pagination.pageSize,
					taskName: this.formSearch.taskname,
				};
				
				TK_URL.Method.http(TK_URL.Menu.Task.TableData, data, (res)=>{
					this.tableData = res.tableData;
					this.pagination.currentPage = res.currentPage;
					this.pagination.total = res.total;
				});
			},
		},
		mounted(){
			this.getData();
		}
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