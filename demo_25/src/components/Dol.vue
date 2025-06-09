<template>
    <!-- 顶部导航栏，包含首页链接、用户登录、注册以及用户相关链接 -->
    <div style="padding: 0 5rem ;">
        <div style="display: flex; height: 30px; justify-content: space-between;">
            <!-- 首页链接和图标 -->
            <div style="display: flex;">
                <div>
                    <el-icon size="30">
                        <House />
                    </el-icon>
                </div>
                <el-link @click="goHome()">首页</el-link>
            </div>
            <!-- 用户登录和注册链接 -->
            <div style="display: flex" v-show="!or">
                <div>
                    <el-link @click="goLogin">你好，请登录!</el-link>
                </div>
                <div style="margin-left: 10px">
                    <el-link @click="">免费注册</el-link>
                </div>
            </div>
            <!-- 用户相关链接：我的、购物车、我的订单 -->
            <div>
                <el-popover :visible="visible" placement="bottom" :width="180" v-show="or">
                    <!-- <p>头像</p> -->
                    <div>
                        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                    </div>
                    <div style="text-align: right; margin: 0" v-show="or">
                        <el-button size="small" type="primary" @click="clearToken()">
                            退出
                        </el-button>
                    </div>
                    <template #reference v-show="or">
                        <el-link @click="visible = true" v-show="or">我的</el-link>
                    </template>
                </el-popover>
                <el-link @click="goLogin()" v-show="!or">
                    我的
                </el-link>
                <el-link @click="">购物车</el-link>
                <el-link @click="">我的订单</el-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import router from '@/router';
import { onMounted, ref, computed } from 'vue';
import { useUserStore } from '@/store/user.js';
import { useZTStore } from '../store/zhuangTai.js';


const visible = ref(false);
const userStore = useUserStore();
const userZT = useZTStore();

// 使用计算属性来始终获取最新的store值
const or = computed(() => userStore.orLogin);
const ifLogin = computed(() => userZT.ifLogin);


/**
 * 导航到首页
 */
function goHome() {
    userZT.setIfLogin(false);
    router.push("/home");
}

/**
 * 导航到登录页面
 */
function goLogin() {
    userZT.setIfLogin(true);
    router.push("/login");
}


/**
 * 清除 Token
 */
function clearToken() {
    userStore.token = '';
    userStore.orLogin = false;
    localStorage.removeItem('token');
    visible.value = false;
    router.push("/login");
}
</script>

<style scoped>
/* ========================================================================= */
/* 导航栏列间距 */

/* 设置导航栏中每个链接之间的间距 */
.el-link {
    margin-right: 60px;
}

/* 确保最后一个链接没有右边距 */
.el-link:last-child {
    margin-right: 0;
}
</style>