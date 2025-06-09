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

const useStore = useUserStore();

// 显示登录提示
function login() {
  ElMessage.warning("请先登录！")
}

function goHome() {
  router.push("/home");
}

function goLogin() {
  // 参数验证
  if (!formData.username || !formData.password) {
    ElMessage.warning("请输入用户名和密码");
    return;
  }
  // 发起登录请求
  get("api/login", {
    username: formData.username,
    password: formData.password
  }).then(data => {
    // 处理响应数据
    console.log("响应Token:", data);

    if (data !== "") {
      ElMessage.success("登录成功");
      useStore.orLogin = true;
      useStore.token = data;
      localStorage.setItem("token", data);
      console.log("orLogin:" + useStore.orLogin);
      router.push("/home");
    }
  });

}
// get("api/user/info").then(data => {
//     console.log("响应用户信息:", data);
//   });

</script>

<style>
.el-input__wrapper {
  width: 200px;
}

.el-form {
  margin: 0 21%;
}
</style>