<template>
	<div class="data-config">
		<div class="main">
			<div class="data-config-header1">
				<span class="data-config-header1-left"><i class="el-icon-menu"></i> 数据接入配置</span>
				<span class="data-config-header1-right">
					
					<el-button type="info" size="mini" plain @click="dataConfigCreate">增 加</el-button>
					<el-button v-show="selectNums==0" type="info" size="mini" plain disabled>删 除</el-button>
					<el-button v-show="selectNums!=0" type="info" size="mini" plain>删 除</el-button>
					<el-button v-show="selectNums==0" type="info" size="mini" plain disabled>生成配置文件</el-button>
					<el-button v-show="selectNums!=0" type="info" size="mini" plain>生成配置文件</el-button>
				</span>
			</div>
			<div class="data-config-header2">
				<el-form ref="form" :inline="true" size="small">
					<el-form-item label="源系统名：">
					    <el-input placeholder="请输入全部或部分系统英文名" v-model="formSearch.name"></el-input>
					</el-form-item>
					<el-form-item label="源数据库名：">
					    <el-input placeholder="请输入全部或部分源数据库名" v-model="formSearch.dbName"></el-input>
					</el-form-item>
					<el-form-item label="源表名：">
					    <el-input placeholder="请输入全部或部分表英文名" v-model="formSearch.tableName"></el-input>
					</el-form-item>
					<el-form-item label="所属任务：">
					    <el-select v-model="formSearch.task" placeholder="请选择">
					    	<el-option v-for="item in options"
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
					<el-table-column prop="index" label="序号" width="80" align="center"></el-table-column>
					<el-table-column prop="name" label="源系统名" align="center"></el-table-column>
					<el-table-column prop="dbName" label="源数据库名" align="center"></el-table-column>
					<el-table-column prop="tableName" label="源表名" align="center"></el-table-column>
					<el-table-column prop="hbaseName" label="HBASE表名" align="center"></el-table-column>
					<el-table-column label="接入类型" width="100" align="center">
						<template slot-scope="scope">
					        <span v-if="scope.row.type == 1">全量</span>
					        <span v-if="scope.row.type == 2">增量</span>
					    </template>
					</el-table-column>
					<el-table-column prop="taskname" label="所属任务" width="100" align="center"></el-table-column>
					<el-table-column prop="updateuser" label="最近更新人" align="center"></el-table-column>
					<el-table-column prop="updatetime" label="最近更新时间" width="150" align="center"></el-table-column>
					
					<el-table-column label="操作" width="80" align="center">
						<template slot-scope="scope">
					        <el-button type="text" size="small" @click="dataConfigUpdate">配置</el-button>
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
		
		<el-dialog title="数据接入配置" width="640px" top="5vh" :visible.sync="dialog.dataConfigUpdateDialogVisible" @open="dialogOpen">
		  	<el-form :inline="true" label-width="100px" size="mini" ref="cuform" style="margin-bottom: -20px;"> <!--:model="form" -->
		  		<el-form-item label="源系统名">
		  			<el-select style="width:185px;" :value="tableCellClickData.nameValue" placeholder="请选择">
				    	<el-option v-for="item in dialog.names"
					      	:key="item.value" :label="item.label" :value="item.value">
					    </el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label="所属任务">
		  			<el-select style="width:185px;" :value="tableCellClickData.taskValue" placeholder="请选择">
				    	<el-option v-for="item in dialog.tasks"
					      	:key="item.value" :label="item.label" :value="item.value">
					    </el-option>
				    </el-select>
				</el-form-item>
				<el-row>
					<el-form-item label="schema">
					    <el-input placeholder="schema"></el-input>
					</el-form-item>
				</el-row>
				<el-form-item label="源表名">
				    <el-input placeholder="源表名" v-model="tableCellClickData.tableName"></el-input>
				</el-form-item>
				<el-form-item label="HBASE表名">
				    <el-input placeholder="HBASE表名" v-model="tableCellClickData.hbaseName"></el-input>
				</el-form-item>
				<el-form-item label="colums">
				    <el-input placeholder="colums"></el-input>
				</el-form-item>
				<el-form-item label="map数量">
				    <el-input placeholder="map数量"></el-input>
				</el-form-item>
				<el-form-item label="列族">
				    <el-input placeholder="hbase列族"></el-input>
				</el-form-item>
				<el-form-item label="ROWKEY">
				    <el-input placeholder="hbase主键"></el-input>
				</el-form-item>
				<el-form-item label="分块ID">
				    <el-input placeholder="分块ID"></el-input>
				</el-form-item>
				<el-form-item label="ADDROWKEY">
				    <el-input placeholder="ADDROWKEY" value="0" disabled></el-input>
				</el-form-item>
				<el-form-item label="前置执行">
					<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="执行前置before_import" style="width: 485px"></el-input>
				</el-form-item>
				<el-form-item label="接入类型">
		  			<el-select style="width:185px;" value="1" placeholder="请选择">
				    	<el-option label="全量" key="1" value="1"></el-option>
				    	<el-option label="增量" key="2" value="2"></el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label="增量条件">
					<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="增量条件" style="width: 485px"></el-input>
				</el-form-item>
		  	</el-form>
		  	<span slot="footer" class="dialog-footer right">
		  		<el-button size="small" type="primary" @click="dialog.dataConfigUpdateDialogVisible = false" v-text="dialog.dataConfigBtn">确 定</el-button>
		  		<el-button size="small" type="primary" plain @click="resetForm('cuform')">重 填</el-button>
		    	<el-button size="small" type="info"    @click="dialog.dataConfigUpdateDialogVisible = false">取 消</el-button>
		  	</span>
		</el-dialog>
		
		<el-dialog width="440px" :visible.sync="dialog.config.dataConfigUpdateDialogVisible" :show-close='dialog.config.showClose' @open="dialogConfigOpen" style="-webkit-user-select: none;">
			<el-steps class="dialog-title left" slot="title" :active="dialog.config.stepActive" finish-status="success" >
			  	<el-step title="确认生成方式"></el-step>
			  	<el-step title="生成配置文件"></el-step>
			</el-steps>
			<div v-show="dialog.config.stepActive == 0 && dialog.config.step1" style="margin-top: -20px; margin-bottom: -30px;">
				<el-row>
					<el-radio v-model="dialog.config.onlyConfig" label="1">仅生成配置文件</el-radio>
				</el-row>
				<el-row>
					<el-radio v-model="dialog.config.onlyConfig" label="2">生成配置文件并发布到线上</el-radio>
				</el-row>
				<el-row v-for="item in options" :key="item.value">
					<el-col :span="21" :offset="3">
						<el-radio v-model="dialog.config.task" :label="item.value" :disabled="dialog.config.onlyConfig != 2">
							发布到 -
							<span v-text="item.label"></span>
						</el-radio>
					</el-col>
				</el-row>
			</div>
			<div v-show="dialog.config.stepActive == 2 && dialog.config.step2" style="margin-top: -20px; margin-bottom: -30px;">
				<div style="margin-left: 50px;margin-bottom: 20px;">
					<span style="display: inline-block; margin-right: 30px;">配置文件已生成</span>
					<span style="color: #0000FF; text-decoration: underline;cursor: pointer;">下载>></span>
					<div v-show="nextShow">正在发布【<span v-text="dialog.config.task"></span>】，请注意验证！</div>
				</div>
			</div>
			<span slot="footer" class="dialog-footer right">
		  		<el-button size="small" type="danger" @click="stepActiveNext" :disabled="sendDis" v-show="sendShow" v-text="sendBtn">一键发布</el-button>
		  		<el-button size="small" type="primary" plain @click="stepActiveNext" v-show="nextShow" v-text="nextBtn">下一步</el-button>
		    	<el-button size="small" type="info"    @click="dialog.config.dataConfigUpdateDialogVisible = false" v-text="calcelBtn">取 消</el-button>
		  	</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'MenuDataAccessManagement',
		data() {
			return {
				options: [
					{label: '全部', value: '0'},
					{label: '0点任务', value: '1'},
					{label: '6点任务', value: '2'},
					{label: '10点任务', value: '3'},
				],
				nextShow: true,
				sendShow: false,
				sendDis: true,
				sendId: -1,
				sendBtn: '一键发布',
				sendCount: 10,
				calcelBtn: '取 消',
				nextBtn: '下一步',
				selectNums: 0,
				selectDatas: [],
				tableData: [],
				tableCellClickData: {},
				formSearch: {
					name: '',
					dbName: '',
					tableName: '',
					task: '0',
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
					names: [],
					tasks: [],
					config: {
						dataConfigUpdateDialogVisible: true,
						onlyConfig: '1',
						task: '0',
						stepActive: 0,
						step1: true,
						step2: false,
						showClose: false
					}
				},
			}
		},
		methods: {
			tableCellClick(data){
				this.tableCellClickData = JSON.parse(JSON.stringify(data));
			},
			dataConfigCreate(){
				this.dialog.dataConfigBtn = '新 增';
				this.tableCellClickData = {};
				this.dialog.dataConfigUpdateDialogVisible = true;
			},
			dataConfigUpdate(){
				this.dialog.dataConfigBtn = '更 新';
				this.dialog.dataConfigUpdateDialogVisible = true;
			},
			tableSelect(datas){
				this.selectDatas = datas;
				this.selectNums = datas ? datas.length : 0;
			},
			sizeChange(pageSize){
				this.pagination.pageSize = pageSize;
			},
			currentChange(currentPage){
				this.pagination.currentPage = currentPage;
			},
			dialogOpen(){
				new Promise((resolve, reject)=>{
					TK_URL.Method.http(TK_URL.Menu.DataSource.Names, {}, (res)=>{
						this.dialog.names = res.names;
						resolve("success");
					});
				}).then(()=>{
					TK_URL.Method.http(TK_URL.Menu.Task.tasks, {}, (res)=>{
						this.dialog.tasks = res.tasks;
					});
				});
				
			},
			dialogConfigOpen(){
				TK_URL.Method.http(TK_URL.Menu.Task.tasks, {}, (res)=>{
					this.dialog.tasks = res.tasks;
				});
			},
			stepActiveNext(){
				if(this.dialog.config.stepActive == 0){
					this.dialog.config.stepActive = 2;
					this.dialog.config.step1 = false;
					setTimeout(()=>{
						this.dialog.config.step2 = true;
					}, 100);
					
					if(this.dialog.config.onlyConfig == 1){
						this.nextShow = false;
						this.calcelBtn = '关 闭';
					}else{
						this.sendShow = true;
						this.nextBtn = '上一步';
						
						this.sendCount = 10;
						clearInterval(this.sendId);
						this.sendId = setInterval(() => {
							this.sendBtn = '一键发布( '+this.sendCount+' )';
							if(this.sendCount <= 0){
								clearInterval(this.sendId);
								this.sendBtn = '一键发布';
								this.sendDis = false;
								return ;
							}
							this.sendCount--;
						}, 1000);
					}
				}else{
					this.dialog.config.stepActive = 0;
					this.dialog.config.step2 = false;
					setTimeout(()=>{
						this.dialog.config.step1 = true;
					}, 100);
					
					this.sendShow = false;
					this.nextBtn = '下一步';
					this.sendDis = true;
					this.sendBtn = '一键发布';
				}
			},
			getData(){
				var data = {
					currentPage: this.pagination.currentPage,
					pageSize: this.pagination.pageSize,
					name: this.formSearch.name,
					dbName: this.formSearch.dbName,
					tableName: this.formSearch.tableName,
					task: this.formSearch.task,
				};
				
				TK_URL.Method.http(TK_URL.Menu.DataAccess.TableData, data, (res)=>{
					this.tableData = res.tableData;
					this.pagination.currentPage = res.currentPage;
					this.pagination.total = res.total;
				});
			},
			resetForm(formName){
				this.tableCellClickData = {};
			}
		},
		mounted(){
			/*new Promise((resolve, reject)=>{
				TK_URL.Method.http(TK_URL.Menu.Task.tasks, {}, (res)=>{
					this.options = res.tasks;
					resolve("success");
				});
			}).then(()=>{
				this.getData();
			});*/
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