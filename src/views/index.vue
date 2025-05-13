<script setup>
import AddCustomer from "@/views/AddCustomer.vue"
import ListCustomer from "@/views/ListCustomer.vue";
import {onMounted, ref} from "vue";
import axios from "axios";

//声明数组保存所有组件
const views=[AddCustomer,ListCustomer]
//声明变量保存当前需要显示的组件名
const currentComponent=ref(views[0]);
const menus =ref([])
/*menu组件选中叶子节点触发的函数，参数index：菜单节点的index值，对应数据库菜单节点的id*/
const  handlerSelect=function(index){
  console.log(index);
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
  <!-- 后台主页布局 -->
  <div class="common-layout">
    <el-container>
      <el-header class="top">ERP-ikun小组</el-header>
      <el-container   >
        <el-aside width="240px" class="left">
          系统菜单

          <!--添加Menu菜单组件-->
          <el-menu
              class="el-menu-vertical-demo" @select="handlerSelect" >
            <el-sub-menu v-for=" menu in menus" index="menu.id">
              <template #title>
                <span>{{ menu.label }}</span>
              </template>
              <el-menu-item   v-for="subMenu in menu.subMenus" :index="subMenu.id">
                  {{subMenu.label}}
              </el-menu-item>
            </el-sub-menu>


          </el-menu>

        </el-aside>
        <el-main class="right">
          <!--通过点击左边菜单，动态显示不同组件 -->
          <!--           <component :is="currentComponent"></component>-->
          <component :is="currentComponent"></component>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.top{
  background-color: azure;
}
.left{
  background-color: blanchedalmond;
  height: 600px;
}
.right{
  background-color: cornsilk;
}
</style>