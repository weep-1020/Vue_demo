// 引入依赖模块
import axios from "axios"; // Axios 是用于发起 HTTP 请求的核心库
import qs from "qs"; // qs 模块用于序列化对象为 x-www-form-urlencoded 格式
import router from "../router/index.js"; // Vue Router 实例，用于页面跳转
import { Message } from "@element-plus/icons-vue"; // Element Plus 的消息提示组件
import { store } from "../store"; // Vuex 状态管理实例

// 设置默认不携带跨域凭证（如 Cookie）
axios.defaults.withCredentials = false;

/**
 * 创建一个自定义的 Axios 实例
 * 所有请求将基于该实例配置发送
 */
const instance = axios.create({
  baseURL: "http://127.0.0.1:8080", // 所有请求的基础路径
});

/**
 * 请求拦截器：在请求发送前添加 Token 到 Header
 */
instance.interceptors.request.use(
  (config) => {
    const storedToken = window.localStorage.getItem("token"); // 从本地存储获取 token
    if (storedToken) {
      config.headers.Authorization = `Bearer ${storedToken}`;
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // 请求出错时拒绝 Promise
  }
);

/**
 * 响应拦截器：统一处理响应结果或错误
 */
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      handleErrorResponse(error.response.status);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error:", error.message);
    }

    return Promise.reject(error.response?.data || error.message);
  }
);

/**
 * 统一错误处理函数
 * @param {number} statusCode - HTTP 状态码
 */
function handleErrorResponse(statusCode) {
  switch (statusCode) {
    case 401:
      store.commit("show", "账号或密码有误....");
      clearTokenAndRedirect();
      break;
    case 403:
      store.commit("show", "禁止访问, 没有权限-403....");
      Message.error({ message: "禁止访问, 没有权限-403", offset: 150 });
      clearTokenAndRedirect();
      break;
    case 404:
      store.commit("show", "找不到请求的资源 404....");
      Message.error({ message: "找不到请求的资源 404", offset: 150 });
      break;
    default:
      store.commit("show", "操作失败 ...");
      Message.error({ message: "操作失败 ....", offset: 150 });
  }
}

/**
 * 清除 token 并跳转到登录页
 */
function clearTokenAndRedirect() {
  localStorage.removeItem("token");
  router.push("/login");
}

/**
 * GET 请求封装
 * @param {string} url - 请求地址
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export const $get = (url, params) => {
  return instance.get(url, { params });
};

/**
 * POST 请求（x-www-form-urlencoded）
 * @param {string} url - 请求地址
 * @param {Object} data - 请求数据
 * @returns {Promise}
 */
export const $postx = (url, data) => {
  const formData = qs.stringify(data, { arrayFormat: "brackets" });
  return instance.post(url, formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf8",
    },
  });
};

/**
 * POST 请求（JSON）
 * @param {string} url - 请求地址
 * @param {Object} data - 请求数据
 * @returns {Promise}
 */
export const $postj = (url, data) => {
  return instance.post(url, data, {
    headers: {
      "Content-Type": "application/json;charset=utf8",
    },
  });
};

/**
 * POST 请求（FormData，适用于文件上传等场景）
 * @param {string} url - 请求地址
 * @param {FormData} formData - 表单数据
 * @returns {Promise}
 */
export const $postf = (url, formData) => {
  return instance.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};