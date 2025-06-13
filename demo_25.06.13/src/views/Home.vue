<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <Dol />
      </el-header>
      <el-main>
        <div class="home">
    <!-- 主容器 -->
    <div class="home-container">
      <!-- 第一行：LOGO + 搜索框 + 活动入口 -->
      <div class="div_1">
        <!-- 左侧 LOGO 区域 -->
        <div class="cv_1" style="display: flex; width: 30%; justify-content: center">
          <div style="height: 100%">
            <!-- LOGO 文字（可替换为图片） -->
            <h1 class="logo_txt">LOGO</h1>
          </div>
        </div>

        <!-- 中间搜索区域 -->
        <div class="cv_2" style="width: 40%">
          <div style="height: 100%">
            <div style="
              height: 100%;
              width: 100%;
              display: flex;
              align-items: center;
            ">
              <div class="cv_2_ssk">
                <!-- 搜索输入框 -->
                <el-input v-model="input1" style="width: 70%" size="large" placeholder="请输入关键字" :prefix-icon="Search"
                  clearable />
                <!-- 搜索按钮 -->
                <el-button type="" style="width: 20%; height: 86%" @click="">搜索</el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧活动入口 -->
        <div class="cv_3" style="display: flex; width: 30%; justify-content: center">
          <div style="height: 100%">
            <h1 class="logo_txt">活动入口</h1>
          </div>
        </div>
      </div>

      <!-- 第二行：分类菜单 + 轮播图 + 推荐 -->
      <div class="div_2" style="display: flex">
        <!-- 左侧分类菜单 -->
        <div class="div_2_fl" style="width: 25%; height: 100%; background-color:white">
          <div style="height: 20%; display: flex; justify-content: center; align-items: center;">
            <div>
              <el-link ref="#">
                <p style=" font-size: 16px;">全部分类</p>
              </el-link>
            </div>
          </div>
          <!-- 左侧分类菜单 -->
          <el-row>
            <el-col :span="24">
              <!-- 递归渲染分类树 -->
              <div v-for="item in father" :key="item.id" style="display: flex; margin-top: 1rem;">
                <div style="width: 20%;display: flex;justify-content: center;;">
                  <el-link @click="handleMenuItemClick(item)">{{ item.name }}</el-link>
                </div>
                <!-- 如果存在子分类，递归渲染 -->
                <div v-if="item.children && item.children.length > 0" style="width: 20%;display: flex;justify-content: center;">
                  <el-link v-for="child in item.children" :key="child.id" @click="handleMenuItemClick(child)">
                    {{ child.name }}
                  </el-link>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 中间轮播图 -->
        <div class="div_2_lpt" style="width: 60%; height: 100%; background-color: gold">
          <el-carousel :interval="5000" arrow="always">
            <el-carousel-item v-for="item in 4" :key="item">
              <h3 text="2xl" justify="center">{{ item }}</h3>
            </el-carousel-item>
          </el-carousel>
        </div>

        <!-- 右侧推荐 -->
        <div class="div_2_rd" style="width: 15%; height: 100%; background-color: green">
          <h1>推荐</h1>
        </div>
      </div>

      <!-- 第三行（占位用，可扩展） -->
      <div class="div_3"></div>
    </div>
  </div>
      </el-main>
    </el-container>
  </div>
  
</template>

<script setup>
import Dol from "../components/Dol.vue";
import { ref, onMounted } from "vue";
import { Search } from "@element-plus/icons-vue"; // 引入 Element Plus 的搜索图标
import { get, post, postForm, postFormData } from "../axios/index.js"; // 引入封装好的请求方法

// 图片路径处理（使用相对路径加载本地资源）
const imgUrl = new URL("../assets/logo2.jpg", import.meta.url).href;

// 搜索输入框绑定的数据
var input1 = ref("");

// 分类菜单数据（模拟后端返回结构）
const fl = ref([
  {
    name: "家用电器",
    id: 1,
    date: 0
  }, {
    name: "生活用品",
    id: 2,
    date: 0
  }, {
    name: "食品",
    id: 3,
    date: 0
  }, {
    name: "书籍",
    id: 4,
    date: 0
  }, {
    name: "手机",
    id: 5,
    date: 1
  }, {
    name: "酒水",
    id: 6,
    date: 3
  }, {
    name: "图书",
    id: 7,
    date: 4
  },
])


/**
 * 构建分类树形结构
 * @param {Array} categories - 分类数组，每个分类包含 id 和 date 属性，date 表示父分类的 id
 * @returns {Array} - 返回分类的树形结构数组
 */
function buildCategoryTree(categories) {
  // 创建一个映射表，用于快速查找分类
  const categoryMap = {};
  // 初始化最终的树形结构数组
  const tree = [];

  // 构建映射表
  categories.forEach(category => {
    // 为每个分类初始化 children 属性，用于存放子分类
    category.children = [];
    // 将分类以 id 为键存入映射表中
    categoryMap[category.id] = category;
  });

  // 构建树形结构
  categories.forEach(category => {
    // 如果分类的 date 为 0，则说明它是根分类
    if (category.date === 0) {
      // 将根分类添加到树形结构中
      tree.push(categoryMap[category.id]);
    } else {
      // 如果当前分类有父分类
      if (categoryMap[category.date]) {
        // 将当前分类添加到父分类的 children 列表中
        categoryMap[category.date].children.push(categoryMap[category.id]);
      }
    }
  });

  // 返回构建好的树形结构
  return tree;
}

// 调用构建树形结构的函数
const categoryTree = buildCategoryTree(fl.value);

// 提取根分类和子分类
const father = categoryTree; // 根分类
const son = fl.value.filter(item => item.date > 0); // 子分类


// const categoryTree = buildCategoryTree(fl.value);

// console.log(categoryTree);
// /**
//  * 构建分类树形结构
//  * @param {Array} categories - 分类数组，每个分类包含 id 和 date 属性，date 表示父分类的 id
//  * @returns {Array} - 返回分类的树形结构数组
//  */
// function buildCategoryTree(categories) {
//   // 创建一个映射表，用于快速查找分类
//   const categoryMap = {};
//   // 初始化最终的树形结构数组
//   const tree = [];

//   // 构建映射表
//   categories.forEach(category => {
//     // 为每个分类初始化 children 属性，用于存放子分类
//     category.children = [];
//     // 将分类以 id 为键存入映射表中
//     categoryMap[category.id] = category;
//   });

//   // 构建树形结构
//   categories.forEach(category => {
//     // 如果分类的 date 为 0，则说明它是根分类
//     if (category.date === 0) {
//       // 将根分类添加到树形结构中
//       tree.push(categoryMap[category.id]);
//     } else {
//       // 如果当前分类有父分类
//       if (categoryMap[category.date]) {
//         // 将当前分类添加到父分类的 children 列表中
//         categoryMap[category.date].children.push(categoryMap[category.id]);
//       }
//     }
//   });

//   // 返回构建好的树形结构
//   return tree;
// }


// 菜单项点击事件处理函数
function handleMenuItemClick(item) {
  console.log("你选择了:", item);
}

onMounted(() => {
  get
});
</script>


<style>
/* 页面整体布局 */
.home {
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

/* 内容容器 */
.home-container {
  height: 100%;
  position: absolute;
  /* 绝对定位，宽度由左右控制 */
  left: 5rem;
  right: 5rem;
  justify-content: space-around;
}

/* 第一行高度及样式 */
.div_1 {
  display: flex;
  justify-content: space-between;
  height: 120px;
}

/* 第二行高度及背景色 */
.div_2 {
  height: 300px;
  background-color: blue;
}

/* LOGO 标题样式 */
.logo_txt {
  font-size: 2.5rem;
  font-weight: 500;
  color: #2c3e50;
  text-decoration: none;
}

/* 搜索区域样式 */
.cv_2_ssk {
  height: 40%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0;
}

/* 轮播图样式 */
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}



.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
  background-color: #2c3e50;
}

/* ========================================================================= */
/* 全局布局 */
.el-header {
  color: #d3d1d1;
  height: 30px;
  padding: 0 !important;
  position: sticky;
  /* 启用粘性定位 */
  top: 0;
  /* 滚动到距顶部 0px 时开始“粘住” */
  background: white;
  /* 设置背景色防止内容透过 */
  z-index: 100;
  /* 设置堆叠层级，确保显示在其他内容之上 */
}

.el-main {
  height: 1200px;
  border-radius: 4px;
  /* background: linear-gradient(to bottom, #ff003c, #ffffff); */
  padding: 0 !important;
}

.el-table {
  border: 0 !important;
  /* 清除外部边框 */
}

/* 文本居中 */
.center-text {
  text-align: center;
}

.common-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  /* 页面最小高度为视口高度 */
  background-color: #f5f5f5;
  /* background-image: url('./assets/bj.jpg'); */
  /* 控制背景图片的尺寸适应方式（contain:完整显示，cover:覆盖整个元素） */
  background-size: cover;
  /* 可选值：contain | cover | auto */

  /* 设置背景图片的对齐方式，center 表示居中 */
  background-position: center;

  /* 禁止背景图片重复 */
  background-repeat: no-repeat;
}
</style>
