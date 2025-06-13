<template>
  <div style="display: flex;justify-content: center; ">
    <div class="login" style="margin-top: 150px;">
      <div style="display: flex; width: 400px;height: 300px; border: 1px solid #ccc;  flex-direction: column;">
        <div style="display: flex;justify-content: center; align-items: center;">
          <p>登录</p>
        </div>
        <el-form :inline="true" :model="formData" class="demo-form-inline">
          <el-form-item>
            <el-input v-model="formData.username" placeholder="请输入用户名" clearable />
          </el-form-item>
          <br />
          <el-form-item>
            <el-input v-model="formData.password" placeholder="请输入密码" show-password />
          </el-form-item>
        </el-form>
        <div style="display: flex;justify-content: center; align-items: center;">
          <div style="width: 50%;display: flex;justify-content: center;">
            <el-button type="primary" @click="goLogin()">登录</el-button>
          </div>
          <div style="width: 50%;display: flex;justify-content: center;">
            <el-button type="primary" @click="goHome">取消</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { get } from "../axios/index.js";
import { ElMessage } from "element-plus";
import { useUserStore } from "../store/user.js";
const router = useRouter();

const formData = reactive({
  username: "",
  password: ""
})

const userStore = useUserStore();

// 显示登录提示
function login() {
  ElMessage.warning("请先登录！")
}

function goHome() {
  router.push("/home");
}

// 转换为异步函数
async function goLogin() {
  // 参数验证
  if (!formData.username || !formData.password) {
    ElMessage.warning("请输入用户名和密码");
    return;
  }

  try {
    // 发起登录请求
    const data = await get("api/login", {
      username: formData.username,
      password: formData.password
    });
    
    // 处理响应数据
    console.log("响应Token:", data.token);

    if (data && data.token) {
      // 更新本地存储和状态管理
      userStore.setToken(data.token);
      userStore.orLogin = true;
      localStorage.setItem("token", data.token);
      
      ElMessage.success("登录成功");
      router.push("/home");
      
      // 获取用户信息
      await getUserInfo();
    } else {
      ElMessage.warning("登录失败: 未获取到有效token");
    }
  } catch (error) {
    ElMessage.error("登录失败，请检查用户名和密码");
    console.error("登录错误:", error);
  }
}

// 获取用户信息，转换为异步函数
async function getUserInfo() {
  try {
    const userData = await get("api/user/info");
    console.log("响应用户信息:", userData);
    
    if (userData && userData.username) {
      userStore.setUsername(userData.username);
      userData.account && userStore.setAccount(userData.account);
    }
    
    return userData;
  } catch (error) {
    console.error("获取用户信息失败:", error);
    // 不要在用户信息获取失败时显示错误提示，因为登录已经成功
  }
}
</script>

<style>
.el-input__wrapper {
  width: 200px;
}

.el-form {
  margin: 0 21%;
}
</style>