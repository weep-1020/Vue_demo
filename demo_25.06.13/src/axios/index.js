import axios from 'axios';
import qs from 'qs';
import router from "../router/index.js";
import { ElMessage } from 'element-plus';
import { useUserStore } from '../store/user.js';

// 创建axios实例
const service = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:9023',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
});

// 检查API_BASE_URL是否配置
if (!import.meta.env.VITE_API_BASE_URL) {
    console.warn('[请求封装] 未配置VITE_API_BASE_URL,使用默认值:', service.defaults.baseURL);
}

// 请求拦截器 - 添加 Token
service.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    console.log("axios的请求头token:" + token);
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    console.log("axios的请求头:" + config.headers['Authorization']);
    return config;
}, error => Promise.reject(error));

// 响应拦截器 - 处理业务状态码
service.interceptors.response.use(response => {
    const res = response.data;
    // 允许通过配置选项控制是否显示错误消息
    const showError = (response.config && response.config.showError !== false);

    if (res.code !== 200) {
        if (showError) {
            ElMessage.error({ message: res.message || '操作失败', offset: 150 });
        }

        if ([401, 403].includes(res.code)) {
            ElMessage.error("认证失败，请重新登录");
            const userStore = useUserStore();
            userStore.token = '';
            userStore.orLogin = false;
            localStorage.removeItem('token');
            router.push('/login');
        }

        return Promise.reject(new Error(res.message));
    }

    return res.data;
}, error => {
    console.error('请求失败:', error);

    // 允许通过配置选项控制是否显示错误消息
    const showError = error.config?.showError !== false;

    if (showError) {
        ElMessage.error({ message: '网络异常，请稍后重试', offset: 150 });
    }

    return Promise.reject(error);
});

/**
 * GET请求
 * @param {string} url 请求URL
 * @param {object} params 请求参数
 * @param {object} config 请求配置
 * @returns {Promise}
 */
export function get(url, params = {}, config = {}) {
    return service.get(url, {
        params,
        paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'brackets' }),
        ...config
    });
}

/**
 * POST请求 - JSON格式
 * @param {string} url 请求URL
 * @param {object} data 请求数据
 * @param {object} config 请求配置
 * @returns {Promise}
 */
export function post(url, data = {}, config = {}) {
    return service.post(url, data, {
        ...config,
        headers: {
            ...service.defaults.headers,
            ...config.headers,
            'Content-Type': 'application/json'
        }
    });
}

/**
 * POST请求 - FORM表单格式
 * @param {string} url 请求URL
 * @param {object} data 请求数据
 * @param {object} config 请求配置
 * @returns {Promise}
 */
export function postForm(url, data = {}, config = {}) {
    return service.post(url, qs.stringify(data), {
        ...config,
        headers: {
            ...service.defaults.headers,
            ...config.headers,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
}

/**
 * POST请求 - FORM-DATA格式（用于文件上传）
 * @param {string} url 请求URL
 * @param {object} data 请求数据
 * @param {object} config 请求配置
 * @returns {Promise}
 */
export function postFormData(url, data = {}, config = {}) {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));

    return service.post(url, formData, {
        ...config,
        headers: {
            ...service.defaults.headers,
            ...config.headers,
            'Content-Type': 'multipart/form-data'
        }
    });
}

/**
 * 取消请求的令牌工厂
 */
export const CancelToken = axios.CancelToken;

/**
 * 检查请求是否因取消而失败
 */
export const isCancel = axios.isCancel;

/**
 * 示例用法：
 *
 * get('/api/user', { id: 1 })
 *   .then(data => console.log(data))
 *   .catch(err => console.error(err));
 *
 * post('/api/login', { username: 'admin', password: '123456' })
 *   .then(data => console.log(data));
 */