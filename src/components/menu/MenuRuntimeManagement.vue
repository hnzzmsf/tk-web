<template>
	<div class="data-config">
		<div class="main">
			<div class="data-config-header1">
				<span class="data-config-header1-left"><i class="el-icon-menu"></i> 数据接入任务运行监控</span>
				<!--<span class="data-config-header1-right">
					<el-button type="info" size="mini" plain @click="dataConfigCreate">增加</el-button>
					<el-button v-show="selectNums==0" type="info" size="mini" plain disabled>生成配置文件</el-button>
					<el-button v-show="selectNums!=0" type="info" size="mini" plain>生成配置文件</el-button>
				</span>-->
			</div>
			<div class="data-config-header2">
				<el-form ref="form" :inline="true" size="small">
					<el-form-item label="任务名称：">
					    <el-input placeholder="请输入全部或部分任务名称" v-model="formSearch.taskname"></el-input>
					</el-form-item>
					<el-form-item label="执行结果：">
					    <el-select v-model="formSearch.result" placeholder="请选择">
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
				<el-table size="mini" border class="loadingTable" :data="tableData" @cell-click="tableCellClick">
					<el-table-column prop="index" label="序号" width="80" align="center"></el-table-column>
					<el-table-column prop="taskname" label="任务名称" align="center" width="200" ></el-table-column>
					<el-table-column prop="startTime" label="执行开始时间" align="center" width="150"></el-table-column>
					<el-table-column prop="endTime" label="执行结束时间" align="center" width="150" ></el-table-column>
					<el-table-column prop="execTime" label="执行用时（分）" align="center" width="150"></el-table-column>
					<el-table-column prop="result" label="执行结果" width="100" align="center"></el-table-column>
					<el-table-column prop="info" label="摘要" align="center"></el-table-column>
					
					<el-table-column label="操作" width="150" align="center">
						<template slot-scope="scope">
					        <el-button type="text" size="small" @click="getTaskInfo">详情</el-button>
					        <el-button type="text" size="small" >日志</el-button>
					        <el-button type="text" size="small" >导出</el-button>
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
		
		<el-dialog title="任务运行详情" width="1200px" top="5vh" :visible.sync="dialog.dataConfigUpdateDialogVisible">
			<el-row style="margin-top: -30px;">
				<el-col :span="3" >任务名称：</el-col>
				<el-col :span="5">20171201_0点任务</el-col>
				
				<el-col :span="3" >执行结果：</el-col>
				<el-col :span="5">成功</el-col>
			</el-row>
			<el-row style="margin-bottom: 10px;">
				<el-col :span="3" >执行开始时间：</el-col>
				<el-col :span="5">2017/10/17 00:05:03</el-col>
				
				<el-col :span="3" >执行结束时间：</el-col>
				<el-col :span="5">2017/10/17 00:56:03</el-col>
				
				<el-col :span="2" style="text-align: right;">执行用时：</el-col>
				<el-col :span="5">51.11（分）</el-col>
			</el-row>
		  	<el-table size="mini" border class="loadingTable" :data="dialog.taskInfoTableData" max-height="473" style="margin-bottom: -20px;">
				<el-table-column prop="index" label="序号" width="50" align="center"></el-table-column>
				<el-table-column prop="tablename" label="表名" align="center"></el-table-column>
				<el-table-column prop="startTime" label="开始时间" align="center" width="150"></el-table-column>
				<el-table-column prop="endTime" label="结束时间" align="center" width="150"></el-table-column>
				<el-table-column prop="execTime" label="用时（秒）" align="center" width="90"></el-table-column>
				<el-table-column prop="queryCount" label="查询记录数" width="100" align="center"></el-table-column>
				<el-table-column prop="exportCount" label="导入记录数"  width="100" align="center"></el-table-column>

				<el-table-column prop="result" label="执行结果" fixed="right" width="90" align="center"></el-table-column>
				<el-table-column prop="diff" label="数据顺差" fixed="right" width="90" align="center"></el-table-column>
			</el-table>
		  	<span slot="footer" class="dialog-footer right">
		  		<el-button size="small" type="primary" @click="dialog.dataConfigUpdateDialogVisible = false">查看日志</el-button>
		  		<el-button size="small" type="primary" plain>导 出</el-button>
		    	<el-button size="small" type="info"    @click="dialog.dataConfigUpdateDialogVisible = false">返 回</el-button>
		  	</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'MenuRuntimeManagement',
		data() {
			return {
				options: [
					{label: '全部', value: '0'},
					{label: '成功', value: '1'},
					{label: '部分成功', value: '2'},
					{label: '失败', value: '3'},
				],
				tableData: [],
				tableCellClickData: {},
				formSearch: {
					taskname: '',
					result: '0',
				},
				pagination: {
					pageSizes: [10, 20, 30, 50],
					currentPage: 1,
					pageSize: 10,
					total: 40,
				},
				dialog: {
					dataConfigUpdateDialogVisible: false,
					taskInfoTableData: [],
				},
			}
		},
		methods: {
			tableCellClick(data){
				this.tableCellClickData = data;
			},
			getTaskInfo(){
				this.dialog.dataConfigUpdateDialogVisible = true;
				this.getTaskInfoData();
			},
			sizeChange(pageSize){
				this.pagination.pageSize = pageSize;
			},
			currentChange(currentPage){
				this.pagination.currentPage = currentPage;
			},
			getData(){
				var data = {
					currentPage: this.pagination.currentPage,
					pageSize: this.pagination.pageSize,
					taskname: this.formSearch.taskname,
					result: this.formSearch.result,
				};
				
				TK_URL.Method.http(TK_URL.Menu.Runtime.TableData, data, (res)=>{
					this.tableData = res.tableData;
					this.pagination.currentPage = res.currentPage;
					this.pagination.total = res.total;
				});
			},
			getTaskInfoData(){
				var data = {};
				TK_URL.Method.http(TK_URL.Menu.Runtime.TaskInfo, data, (res)=>{
					this.dialog.taskInfoTableData = res.tableData;
				});
			}
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