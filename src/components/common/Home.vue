<template>
	<div class="home">
		<HomeHeader @sendIndex="showIndex"></HomeHeader>
		<div class="homebody" :style="{height: client.height+'px'}">
			<!-- 数据源-->
			<transition name="el-zoom-in-center">
				<MenuDataSourceManagement v-if="showMenu('MenuDataSourceManagement')"></MenuDataSourceManagement>
      		</transition>
      		<!-- 数据接入-->
			<transition name="el-zoom-in-center">
				<MenuDataAccessManagement v-if="showMenu('MenuDataAccessManagement')"></MenuDataAccessManagement>
      		</transition>
      		<!-- 任务管理-->
			<transition name="el-zoom-in-center">
				<MenuTaskManagement v-if="showMenu('MenuTaskManagement')"></MenuTaskManagement>
      		</transition>
			<!-- 运行监控 -->
			<transition name="el-zoom-in-center">
				<MenuRuntimeManagement v-if="showMenu('MenuRuntimeManagement')"></MenuRuntimeManagement>
      		</transition>
      		<!-- 用户管理 -->
			<transition name="el-zoom-in-center">
				<MenuUserManagement v-if="showMenu('MenuUserManagement')"></MenuUserManagement>
      		</transition>
      		<!-- 登录日志 -->
			<transition name="el-zoom-in-center">
				<MenuLogLogin v-if="showMenu('MenuLogLogin')"></MenuLogLogin>
      		</transition>
      		<!-- 操作日志 -->
			<transition name="el-zoom-in-center">
				<MenuLogOperation v-if="showMenu('MenuLogOperation')"></MenuLogOperation>
      		</transition>
      		
		</div>
		<HomeFooter></HomeFooter>
	</div>
</template>

<script>
	import HomeHeader from './HomeHeader'
	import HomeFooter from './HomeFooter'
	
	export default {
		name: 'Home',
		data() {
			return {
				activeIndex: "1",
				client: {
					width: 0,
					height: 0,
				},
				menuData: {
					MenuDataSourceManagement: 	1,
					MenuDataAccessManagement:	2,
					MenuTaskManagement:			3,
					MenuRuntimeManagement: 		4,
					MenuUserManagement: 		5,
					MenuLogManagement: 			6,
					MenuLogLogin: 				61,
					MenuLogOperation: 			62,
				}
			}
		},
		methods: {
			showIndex(Index){
				this.activeIndex = -1;
				setTimeout(()=>{
					this.activeIndex = Index;
				}, 100);
			},
			showMenu(menu){
				return this.menuData[menu] == this.activeIndex;
			},
			relogin(){
				if(this.$store.state.id &&  
				   this.$store.state.name && 
				   this.$store.state.account &&
				   this.$store.state.admin &&
				   this.$store.state.token
				){
					localStorage.setItem('storeState', JSON.stringify({
						id: this.$store.state.id,
						name: this.$store.state.name,
						account: this.$store.state.account,
						admin: this.$store.state.admin,
						token: this.$store.state.token
					}));
				}else{
					var ld = localStorage.getItem('storeState');
					if(ld){
						ld = JSON.parse(ld);
						this.$store.state.id = ld.id;
						this.$store.state.name = ld.name;
						this.$store.state.account = ld.account;
						this.$store.state.admin = ld.admin;
						this.$store.state.token = ld.token;
						localStorage.removeItem('storeState');
						this.relogin();
						return ;
					}
					setTimeout(()=>{
						this.$router.push('/Login');
					}, 100);
					return true;
				}
			}
		},
		created (){
			var Index = localStorage.getItem('menuIndex');
			if(Index){
				this.activeIndex = Index;
			}
		},
		mounted(){
			if(this.relogin()){
				return ;
			}
			window.onresize = () => {
				//document.documentElement.clientWidth
				//document.documentElement.clientHeight
				this.client.height = document.documentElement.clientHeight - 100;
			}
			window.onresize();
		},
		components: {
			HomeHeader,
			HomeFooter,
			
			MenuDataSourceManagement: 	resolve => {require(['../menu/MenuDataSourceManagement'], resolve)},
			MenuDataAccessManagement: 	resolve => {require(['../menu/MenuDataAccessManagement'], resolve)},
			MenuTaskManagement: 		resolve => {require(['../menu/MenuTaskManagement'], resolve)},
			MenuRuntimeManagement: 		resolve => {require(['../menu/MenuRuntimeManagement'], resolve)},
			MenuUserManagement: 		resolve => {require(['../menu/MenuUserManagement'], resolve)},
			
			MenuLogLogin: 				resolve => {require(['../menu/MenuLogLogin'], resolve)},
			MenuLogOperation: 			resolve => {require(['../menu/MenuLogOperation'], resolve)},
		}
	}
</script>

<style>
body{overflow: hidden;}
.home{position: relative;}
.homebody{margin-top: 60px; margin-bottom: 30px;padding-bottom: 30px;overflow: auto;}

/*滚动条样式*/
.homebody::-webkit-scrollbar {/*滚动条整体样式*/
    width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
}
.homebody::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
}
.homebody::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0);
    border-radius: 0;
    background: rgba(0,0,0,0);
}
</style>