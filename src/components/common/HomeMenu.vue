<template>
	<div class="homemenu">
		<el-menu class="homemenu-main" :default-active="activeIndex" mode="horizontal" @select="menuSelect"
			background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
			<el-menu-item index="1">数据源</el-menu-item>
			<el-menu-item index="2">数据接入</el-menu-item>
			<el-menu-item index="3">任务管理</el-menu-item>
			<el-menu-item index="4">运行监控</el-menu-item>
			<div v-if="adminFlag">
				<el-menu-item index="5">用户管理</el-menu-item>
				<el-submenu index="6">
					<template slot="title">平台日志</template>
				    <el-menu-item index="61">登录日志</el-menu-item>
				    <el-menu-item index="62">操作日志</el-menu-item>
				</el-submenu>
			</div>
		</el-menu>
	</div>
</template>

<script>
	export default {
		name: 'HomeMenu',
		data() {
			return {
				activeIndex: '1',
			}
		},
		methods: {
			menuSelect(Index){
				this.$emit('sendIndex', Index);
				localStorage.setItem('menuIndex', Index);
			}
		},
		computed: {
			adminFlag(){
				return this.$store.state.admin == 1;
			},
		},
		created (){
			var Index = localStorage.getItem('menuIndex');
			if(Index){
				this.activeIndex = Index;
			}
		}
	}
</script>

<style>
.homemenu-main{padding-left: 200px;}
</style>