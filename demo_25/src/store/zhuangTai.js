import { defineStore } from 'pinia';

export const useZTStore = defineStore('zhuangTai', {
    state: () => ({
        ifLogin: false,
        items: []
    }),
    actions: {
        setIfLogin(value) {
            this.ifLogin = value;
        },
        addItem(item) {
            this.items.push(item);
        },
        removeItem(index) {
            this.items.splice(index, 1);
        }
    }
});