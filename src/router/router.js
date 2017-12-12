export default [
	{
		path: '/',
		redirect: '/Home'
	},
	{
		path: '/Login',
		component: r => require.ensure([], () => r(require('../components/Login')), 'Login')
	},
	
	{
		path: '/Home',
		component: r => require.ensure([], () => r(require('../components/common/Home')), 'Home')
	},
	
	
	{
		path: '*',
		component: r => require.ensure([], () => r(require('../components/common/Home')), 'Home')
	}
]