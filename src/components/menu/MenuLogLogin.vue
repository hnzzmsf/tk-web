<template>
	<div class="data-config">
		<div class="main">
			<div class="data-config-header1">
				<span class="data-config-header1-left"><i class="el-icon-menu"></i> 登录日志</span>
			</div>
			<div class="data-config-header2">
				<el-form ref="form" :inline="true" size="small">
					<el-form-item label="姓名：">
					    <el-input placeholder="请输入全部或部分姓名" clearable v-model="formSearch.username"></el-input>
					</el-form-item>
					<el-form-item label="登录账号：">
					    <el-input placeholder="请输入全部或部分登录账号" clearable v-model="formSearch.account"></el-input>
					</el-form-item>
					<el-form-item label="登录时间：">
					    <el-date-picker
					    	v-model="formSearch.logDate"
					      	type="datetimerange"
					      	:picker-options="pickerOptions"
					      	range-separator="-"
					      	start-placeholder="开始日期"
					      	end-placeholder="结束日期"
					      	align="right"
					    >
					    </el-date-picker>
					</el-form-item>
					<el-form-item label="">
						<el-button class="btn-search" type="primary" size="mini" plain @click="getData">搜索</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="data-config-main">
				<el-table size="mini" border class="loadingTable" :data="tableData">
					<el-table-column label="序号" width="80" align="center">
						<template slot-scope="scope">
							<span v-text="scope.$index + 1"></span>
					    </template>
					</el-table-column>
					<el-table-column prop="logindate" label="登录时间" align="center"></el-table-column>
					<el-table-column prop="name" label="姓名" align="center"></el-table-column>
					<el-table-column prop="account" label="登录账号" align="center"></el-table-column>
					<el-table-column prop="ip" label="IP" align="center"></el-table-column>
					<el-table-column label="结果" align="center">
						<template slot-scope="scope">
							<span v-if="scope.row.state != 1" style="color: red;">登录失败</span>
							<span v-else="">登录成功</span>
					    </template>
					</el-table-column>
					<el-table-column prop="desc" label="描述" align="center"></el-table-column>
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
		
	</div>
</template>

<script>
	export default {
		name: 'MenuLogLogin',
		data() {
			return {
				tableData: [],
				formSearch: {
					username: '',
					account: '',
					logDate: '',
				},
				pagination: {
					pageSizes: [10, 20, 30, 50],
					currentPage: 1,
					pageSize: 10,
					total: 40,
				},
				pickerOptions: {
		          	shortcuts: [{
				            text: '最近一周',
				            onClick(picker) {
					            const end = new Date();
					            const start = new Date();
					            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
					            picker.$emit('pick', [start, end]);
				            }
			          	}, {
				            text: '最近一个月',
				            onClick(picker) {
				              	const end = new Date();
				              	const start = new Date();
				              	start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
				              	picker.$emit('pick', [start, end]);
				            }
			          	}, {
				            text: '最近三个月',
				            onClick(picker) {
				              	const end = new Date();
				              	const start = new Date();
				              	start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
				              	picker.$emit('pick', [start, end]);
			            }
		          	}]
		        },
			}
		},
		methods: {
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
					name: this.formSearch.username,
					account: this.formSearch.account
				};
				if(this.formSearch.logDate && this.formSearch.logDate.length != 0){
					try{
						data.stdate = this.formSearch.logDate[0].getTime();
						data.enddate = this.formSearch.logDate[1].getTime();
					}catch(e){}
				}
				
				TK_URL.Method.http(TK_URL.Menu.Log.Login.TableData, data, (res)=>{
					
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
@media only screen and (min-width: 100px) and (max-width: 1235px) {
	.data-config .btn-search{position: absolute; left: -165px; top: -29px;}
	.data-config .el-form-item:nth-child(3){margin-right: 300px; margin-top: 10px;}
}
@media only screen and (min-width: 1235px) and (max-width: 1285px) {
	.data-config .btn-search{position: absolute; top: 4.5px;}
}
</style>