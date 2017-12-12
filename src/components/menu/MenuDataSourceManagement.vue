<template>
	<div class="data-config">
		<div class="main">
			<div class="data-config-header1">
				<span class="data-config-header1-left"><i class="el-icon-menu"></i> 数据源管理</span>
				<span class="data-config-header1-right">
					
					<el-button type="info" size="mini" plain @click="dataConfigCreate">增 加</el-button>
					<el-button v-show="selectNums==0" type="info" size="mini" plain disabled>删 除</el-button>
					<el-button v-show="selectNums!=0" type="info" size="mini" plain @click="dataConfigDelete">删 除</el-button>
				</span>
			</div>
			<div class="data-config-header2">
				<el-form ref="form" :inline="true" size="small">
					<el-form-item label="源系统名：">
					    <el-input placeholder="请输入全部或部分系统英文名" clearable v-model="formSearch.sysName"></el-input>
					</el-form-item>
					<el-form-item label="数据库名：">
					    <el-input placeholder="请输入全部或部分源数据库名" clearable v-model="formSearch.databaseName"></el-input>
					</el-form-item>
					<el-form-item label="数据源类型：">
					    <el-select v-model="formSearch.sourceType" placeholder="请选择">
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
					<el-table-column prop="sysName" label="源系统名" width="150" align="center"></el-table-column>
					<el-table-column prop="databaseName" label="数据库名" width="150" align="center"></el-table-column>
					<el-table-column label="数据源类型" width="120" align="center">
						<template slot-scope="scope">
					        <span v-if="scope.row.sourceType == 1">Oracle</span>
					        <span v-if="scope.row.sourceType == 2">Mysql</span>
					    </template>
					</el-table-column>
					<el-table-column label="数据库连接信息" align="center">
						<template slot-scope="scope">
							<el-tooltip class="item" effect="dark" placement="right">
								<div slot="content" v-text="scope.row.connect" style="width: 300px;"></div>
						      	<span v-text="scope.row.connect && scope.row.connect.length > 80 ? scope.row.connect.substr(0,80)+' ...' : scope.row.connect"></span>
						    </el-tooltip>
					    </template>
					</el-table-column>
					<el-table-column prop="name" label="最近更新人" width="120" align="center"></el-table-column>
					<el-table-column prop="update" label="最近更新时间" width="150" align="center"></el-table-column>
					
					<el-table-column label="操作" width="120" align="center">
						<template slot-scope="scope">
					        <el-button type="text" size="small" @click="dataConfigUpdate(scope.$index)">配 置</el-button>
					        <el-button type="text" size="small" @click="testConnect(scope.$index)">测试链接</el-button>
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
		
		<el-dialog title="数据源配置" width="640px" :visible.sync="dialog.dataConfigUpdateDialogVisible">
		  	<el-form :inline="true" label-width="100px" size="mini" ref="cuform" style="margin-bottom: -20px;"> <!--:model="form" -->
		  		<el-form-item label="源系统名">
				    <el-input placeholder="源系统名" v-model="tableCellClickData.sysName"></el-input>
				</el-form-item>
		  		<el-form-item label="数据源类型">
		  			<el-select style="width:185px;" v-model="tableCellClickData.sourceType" placeholder="请选择">
				    	<el-option label="Oracle" key="1" value="1"></el-option>
				    	<el-option label="MySQL" key="2" value="2"></el-option>
				    </el-select>
				</el-form-item>
				<el-row>
					<el-form-item label="数据库名">
					    <el-input placeholder="数据库名" v-model="tableCellClickData.databaseName"></el-input>
					</el-form-item>
				</el-row>
				<el-form-item label="用户名">
				    <el-input placeholder="用户名" v-model="tableCellClickData.userName"></el-input>
				</el-form-item>
				<el-form-item label="密码">
				    <el-input placeholder="密码" v-model="tableCellClickData.pwd" style="width: 485px"></el-input>
				</el-form-item>
				<el-form-item label="数据连接">
					<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" v-model="tableCellClickData.connect" placeholder="请输入数据库链接URL" style="width: 485px"></el-input>
				</el-form-item>
		  	</el-form>
		  	<span slot="footer" class="dialog-footer right">
		  		<el-button size="small" type="primary" @click="sourceSubmit" v-text="dialog.dataConfigBtn">确 定</el-button>
		  		<el-button size="small" type="primary" plain @click="resetForm('cuform')">重 填</el-button>
		  		<el-button size="small" type="success" plain @click="testConnect">测试连接</el-button>
		    	<el-button size="small" type="info" plain @click="dialog.dataConfigUpdateDialogVisible = false">取 消</el-button>
		  	</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'MenuDataSourceManagement',
		data() {
			return {
				options: [
					{label: '全部', value: '0'},
					{label: 'Oracle', value: '1'},
					{label: 'MySQL', value: '2'},
				],
				selectNums: 0,
				selectDatas: [],
				tableData: [],
				tableCellClickData: {},
				tableIndex: 0,
				formSearch: {
					sysName: '',
					databaseName: '',
					sourceType: '0',
				},
				pagination: {
					pageSizes: [10, 20, 30, 50],
					currentPage: 1,
					pageSize: 10,
					total: 40,
				},
				dialog: {
					dataConfigUpdateDialogVisible: false,
					dataConfigBtn: '',
				},
			}
		},
		methods: {
			tableCellClick(data){
				this.tableCellClickData = JSON.parse(JSON.stringify(data));
			},
			dataConfigCreate(){
				this.dialog.dataConfigBtn = '新 增';
				this.tableCellClickData = {
					sourceType: '1'
				};
				this.dialog.dataConfigUpdateDialogVisible = true;
			},
			dataConfigUpdate(Index){
				this.tableIndex = Index;
				this.dialog.dataConfigBtn = '更 新';
				this.dialog.dataConfigUpdateDialogVisible = true;
			},
			tableSelect(datas){
				this.selectDatas = datas;
				this.selectNums = datas ? datas.length : 0;
			},
			sourceSubmit(){
				var dt = this.tableCellClickData;
            	if(this.dialog.dataConfigBtn == '更 新'){
            		dt.id = this.tableCellClickData.id;
	            	TK_URL.Method.httpAll(TK_URL.Menu.DataSource.UpdateSource, dt, (res)=>{
						this.dialog.dataConfigUpdateDialogVisible = false;
						this.$message({message: '数据源【'+this.tableCellClickData.sysName+'】更新成功', type: 'success'});
						this.getData();
					});
            	}else if(this.dialog.dataConfigBtn == '新 增'){
            		console.log(dt)
            		TK_URL.Method.httpAll(TK_URL.Menu.DataSource.CreateSource, dt, (res)=>{
						this.dialog.dataConfigUpdateDialogVisible = false;
						this.$message({message: '数据源【'+this.tableCellClickData.sysName+'】新增成功', type: 'success'});
						this.getData();
					});
            	}
			},
			dataConfigDelete(){
				this.$confirm('此操作将永久删除数据源, 是否继续?', '提示', {
		          	type: 'warning'
		        }).then(() => {
		        	var arr = [];
		        	for(var i in this.selectDatas){
		        		arr.push({
		        			id: this.selectDatas[i].id
		        		});
		        	}
		        	TK_URL.Method.httpAll(TK_URL.Menu.DataSource.DeleteSource, arr, (res)=>{
						this.dialog.dataConfigUpdateDialogVisible = false;
						this.$message({message: '数据源删除成功', type: 'success'});
						this.getData();
					});
		        }).catch(() => {
		       	  	console.log('取消删除!');
		        });
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
					sysName: this.formSearch.sysName,
					databaseName: this.formSearch.databaseName,
					sourceType: this.formSearch.sourceType,
				};
				TK_URL.Method.http(TK_URL.Menu.DataSource.TableData, data, (res)=>{
					this.tableData = res.tableData;
					for(var i in this.tableData){
						this.tableData[i].sourceType += ""; 
					}
					this.pagination.currentPage = res.currentPage;
					this.pagination.total = res.total;
				});
			},
			resetForm(formName){
				this.tableCellClickData = {
					sourceType: '1'
				};
			},
			testConnect(Index){
				var data;
				if(Index != undefined){
					this.tableCellClickData = JSON.parse(JSON.stringify(this.tableData[Index]));
				}
				data = {
					sourceType: this.tableCellClickData.sourceType,
					userName: this.tableCellClickData.userName,
					pwd: this.tableCellClickData.pwd,
					connect: this.tableCellClickData.connect,
				};
				TK_URL.Method.httpAll(TK_URL.Menu.DataSource.TestConnect, data, (res)=>{
					this.$message({message: '链接成功, 数据源可用!', type: 'success'});
				});
			}
		},
		mounted(){
			this.getData();
		},
		computed: {
			renderSourceType(sourceType){
				return sourceType+"";
			}
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