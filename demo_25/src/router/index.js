// 导入 Vue Router 的相关函数和组件
import { createWebHashHistory, createRouter } from 'vue-router'
import App from '../App.vue'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue';

// 定义路由配置数组，每个对象代表一个路由
const routes = [
	{ path: '/', component: App },
	{ path: '/home', component: Home },
	{ path: '/login', component: Login },
]

// 注册路由表 告诉Vue-router 路由数组
const router = createRouter({
	history: createWebHashHistory(import.meta.env.BASE_URL),
	routes
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
	// 定义无需认证的公共页面数组
	const publicPages = ['/login', '/home'];
	// 判断目标页面是否需要认证
	const authRequired = !publicPages.includes(to.path);
	// 检查本地存储中是否存在 token 以判断用户是否已登录
	const loggedIn = !!window.localStorage.getItem('token');

	// 如果目标页面需要认证且用户未登录，则重定向到登录页面，否则继续执行导航
	if (authRequired && !loggedIn) {
		return next('/login');
	} else {
		next();
	}
});

// 导出配置好的路由实例
export default router;