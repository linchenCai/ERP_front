<script setup>
import AddCustomer from "@/views/AddCustomer.vue"
import ListCustomer from "@/views/ListCustomer.vue";
import {markRaw, onMounted, ref, shallowRef} from "vue";
import axios from "axios";
import AddSellJh from "@/views/AddSellJh.vue";
import ListSellJh from "@/views/ListSellJh.vue";
import ListCustOrder from "@/views/ListCustOrder.vue";
import ListAfterSale from "@/views/ListAfterSale.vue";

// 导入 Element Plus 图标 (你需要先安装: npm install @element-plus/icons-vue)
import {
  DocumentAdd,
  Tickets,
  Service,
  Goods,
  Memo,
  Setting, // 这是一个通用图标，你可以替换
  HomeFilled, // 示例图标
  Promotion, // 示例图标
  User, // 示例图标
  List,// 示例图标
  Search, Plus, Aim
} from '@element-plus/icons-vue'
import AddMenus from "@/views/AddMenus.vue";
import RolerManager from "@/views/RolerManager.vue";
import UserManager from "@/views/UserManager.vue";
import TreeDemo from "@/views/TreeDemo.vue";
import CategoryManager from "@/views/CategoryManager.vue";
import ItemManger from "@/views/ItemManger.vue";
import BuyListManager from "@/views/BuyListManager.vue";
import InStoreList from "@/views/InStoreList.vue";
import ListOutStore from "@/views/ListOutStore.vue";
import ListStore from "@/views/ListStore.vue";
//声明数组保存所有组件
const views=[markRaw(AddCustomer),markRaw(ListCustomer),markRaw(ListAfterSale),
  markRaw(ListCustOrder),markRaw(AddSellJh),,,markRaw(ListSellJh),markRaw(AddMenus),
  markRaw(UserManager),markRaw(RolerManager),markRaw(TreeDemo),markRaw(CategoryManager),
  markRaw(AddMenus),markRaw(ItemManger),markRaw(BuyListManager),markRaw(InStoreList),markRaw(ListOutStore)
,markRaw(ListStore)]
//声明变量保存当前需要显示的组件名
const currentComponent=shallowRef(AddCustomer);
const menus =ref([])

const isLoading = ref(false); // 用于加载状态

// 为菜单项动态分配图标 (示例)
// 实际应用中，后端返回的菜单数据最好能包含icon字段
const getIconComponent = (menuId) => {
  // 你可以根据 menu.id 或 menu.label 来决定使用哪个图标
  // 这是一个简单的示例，你可以扩展它
  const iconMap = {
      '1': User,
      '2': Plus,
      '3': Search,
      '4': Service,
      '5':List,
       '6':Aim,
  };
  // 作为一个通用后备图标
  return iconMap[String(menuId)] || Setting;
};

/*menu组件选中叶子节点触发的函数，参数index：菜单节点的index值，对应数据库菜单节点的id*/
const  handlerSelect=function(index){
  console.log(index);
  axios.get("http://localhost:8080/compIndex?id="+index)
      .then((response)=>{
        console.log(response);
        currentComponent.value=views[response.data];
      })
      .catch((error)=>{
        console.log(error);
      })
  //动态该currentComponent赋值,从组件集合views中获取的组件名字
  currentComponent.value=views[index];
}
onMounted(function (){
  axios .get("http://localhost:8080/listMenus")
      .then((response)=>{
        console.log(response);
        menus.value=response.data;
      })
      .catch((error)=>{
        console.log(error);
      })

})
</script>
<template>
  <div class="common-layout">
    <el-container class="full-height-container">
      <el-header class="app-header">
        <div class="logo-title">
          <el-icon :size="30" style="margin-right: 10px;"><HomeFilled /></el-icon> <!-- 你可以换成自己的Logo -->
          <span>ERP - ikun小组</span>
        </div>

      </el-header>
      <el-container class="main-content-container">
        <el-aside width="240px" class="app-aside">
          <div class="menu-title">系统菜单</div>
          <el-menu
              class="el-menu-vertical-custom"
              @select="handlerSelect"
              :default-openeds="menus.map(menu => String(menu.id))"
              active-text-color="#409EFF"
              background-color="#ffffff"
              text-color="#303133"
          >
            <el-sub-menu v-for="menu in menus" :key="menu.id" :index="String(menu.id)">
              <template #title>
                <el-icon><component :is="getIconComponent(menu.id)" /></el-icon>
                <span>{{ menu.label }}</span>
              </template>
              <el-menu-item
                  v-for="subMenu in menu.subMenus"
                  :key="subMenu.id"
                  :index="String(subMenu.id)"
              >
                <el-icon><component :is="getIconComponent(subMenu.id)" /></el-icon>
                <span>{{ subMenu.label }}</span>
              </el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-aside>
        <el-main class="app-main">
          <div v-if="isLoading" class="loading-placeholder">
            <el-skeleton :rows="5" animated />
          </div>
          <div v-else>
            <component :is="currentComponent"></component>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
/* 全局和基础布局 */
.common-layout {
  height: 100vh; /* 占据整个视口高度 */
  display: flex;
  flex-direction: column;
}

.full-height-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.main-content-container {
  flex: 1; /* 中间内容区域占据剩余空间 */
  overflow: hidden; /* 防止内容溢出导致滚动条出现在不期望的地方 */
}

/* 头部 */
.app-header {
  background-color: #3A8EE6; /* 更深邃的蓝色 */
  color: white;
  font-size: 22px; /* 调整字体大小 */
  font-weight: 600; /* 略微加粗 */
  display: flex;
  align-items: center;
  justify-content: space-between; /* 两端对齐 */
  padding: 0 20px;
  height: 60px; /* 固定头部高度 */
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); /* 添加细微阴影 */
  line-height: 60px; /* 确保内容垂直居中 */
}

.logo-title {
  display: flex;
  align-items: center;
}

/* 侧边栏 */
.app-aside {
  background-color: #ffffff; /* 干净的白色背景 */
  border-right: 1px solid #e6e6e6; /* 细边框分隔 */
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* 如果菜单过长，允许滚动 */
}

.menu-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  padding: 20px 20px 10px 20px; /* 上下左右边距 */
  text-align: left;
}

.el-menu-vertical-custom {
  border-right: none; /* 移除 el-menu 自带的右边框，因为 el-aside 已经有了 */
  flex-grow: 1; /* 菜单占据剩余空间 */
}

.el-menu-vertical-custom {
  height: 50px; /* 统一菜单项高度 */
  line-height: 50px;
}
.el-menu-vertical-custom :hover {
  background-color: #ecf5ff !important; /* 悬停背景色 */
}

/* 主内容区域 */
.app-main {
  background-color: #f4f6f8; /* 浅灰色背景，内容更突出 */
  padding: 20px; /* 内容区域内边距 */
  overflow-y: auto; /* 如果内容过长，允许主区域滚动 */
}

.loading-placeholder {
  padding: 20px;
}
</style>