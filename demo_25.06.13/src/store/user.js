// src/store/user.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        username: '',
        account:'',
        token: '',
        orLogin: false,
    }),
    actions: {
        // 设置 Token
        setToken(token) {
            this.token = token;
        },
        // 设置 Username
        setUsername(username) {
            this.username = username;
        },
        setAccount(account) {
            this.account = account;
        },
        setOrLogin(orLogin) {
            this.orLogin = orLogin;
        },
    },
    getters: {
        // 获取 Token
        getToken: (state) => state.token,
        // 获取 Username
        getUsername: (state) => state.username,
    }
});