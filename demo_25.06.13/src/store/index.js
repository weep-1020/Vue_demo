import { createPinia } from 'pinia';
import { useUserStore } from '@/store/user.js';
import { useZTStore } from '@/store/zhuangTai.js';

// 创建Pinia实例
const pinia = createPinia();

export function useStore(moduleName) {
    const stores = {
        user: useUserStore(),
        zhuangTai: useZTStore(),
    };
    return stores[moduleName];
}

// 挂载到全局（Vue app）
export default pinia;

// 导出常用 store 供组件使用
export { useUserStore, useZTStore };