<script setup>
import {onMounted, reactive, ref} from "vue";
import { getCurrentInstance } from "vue";
const axios = getCurrentInstance().proxy.axios;
import {ElMessage} from "element-plus";
const props={
  id:'id',
  label:'label',
  children:'subMenus'
};
//定义tree控件节点的集合
const treeNodeList=ref([]);
//定义添加菜单的form表单
const menuForm=reactive({
  label:''
})
//发送ajax请求，加载菜单节点数
function loadMenuTree(){
  axios.get("http://localhost:8080/listMenus")
      .then((response)=>{
        treeNodeList.value=response.data;
      })
      .catch((error)=>{
        console.log(error);
      })
}
//页面加载发送ajax请求
onMounted(function(){
  loadMenuTree()
});
////////////////////////////////////////////////////////////////////// //////////////////////////////////////////////
//声明变量保存当前选中树节点的id
var id=0;
//声明变量保存处理添加请求和更新请求的url
var url="";
//定义tree控件节点的点击回调函数
function hanldNodeClick(node){
  console.log(node+"========node click========");
  url="http://localhost:8080/saveMenus"; //指定处理添加请求的接口
  id=node.id;
}
//发送保存菜单的请求
function subMenuForm(){
  if(id==0){
    ElMessage("请选择当前新增菜单节点的父节点......");
    return;
  }
  menuForm.pid=id; //指定新增节点的父id
  console.log(menuForm)
  //ElMessage("发送ajax请求包擦新增节点......");
  axios.post(url,menuForm)
      .then((response)=>{
        if(response.data.code==200){
          loadMenuTree();//重新渲染树
          id=0;
        }
        ElMessage(response.data.msg);
      })
      .catch((error)=>{
        console.log(error);
      });
}
//Node 删除节点的Node对象
//Data 删除的节点数据
//发送删除的ajax请求
function delMenus(node,data){
  //console.log(node);
  console.log(data.subMenus);
  //判断当前点击需要删除额节点是不是叶子节点
  if(data.subMenus.length==0){
    let mid=data.id;
    //该节点是叶子节点可以删除
    axios.delete("http://localhost:8080/deleteMenus/"+mid)
        .then((response)=>{
          if(response.data.code==200){
            //重新加载tree控件
            loadMenuTree();//重新渲染树
          }
          ElMessage(response.data.msg);
        })
  }else{
    ElMessage(data.label+",节点存在子节点不能删除.......");
  }
}
//定义函数实现菜单节点的回显
function showMenus(node,data){
  console.log()
  menuForm.label=data.label;
  menuForm.id=data.id;
  //将当前需要修改的节点的父节点id，赋值给变量id
  //console.log(node.parent.data.id,node.parent);
  id=node.parent.data.id
  //指定处理更新请求的接口
  url="http://localhost:8080/updateMenus";
}
</script>

<template>
  <h2>添加菜单</h2>
  <div style="text-align: left">
    <h4>选择新增节点的父节点:</h4>
    <el-tree
        :props="props"
        :data="treeNodeList"
        node-key="id"
        ref="treeRef"
        @node-click="hanldNodeClick"
        default-expand-all

        highlight-current="true"
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span>
            <a @click.stop="showMenus(node,data)" > 修改 </a>
            <a style="margin-left: 8px" @click.stop="delMenus(node, data)"> 删除 </a>
          </span>
        </span>
      </template>
    </el-tree>

  </div>
  <hr/>
  <!-- 添加表单控件 -->
  <el-form :model="menuForm" label-width="120px">
    <el-form-item label="菜单名称">
      <el-input v-model="menuForm.label" style="width: 50%"/>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="subMenuForm">保存</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>
::v-deep .el-tree-node.is-current > .el-tree-node__content {
  background-color:#3A8EE6 !important; /* 修改为你想要的颜色 */
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>