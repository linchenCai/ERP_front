<script setup>
import {onMounted, reactive, ref} from "vue";
import axios from "axios";
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
//定义tree控件节点的点击回调函数
function hanldNodeClick(node){
  console.log(node);
  id=node.id;
}
//发送保存菜单的请求
function subMenuForm(){
  if(id==0){
    ElMessage("请选择当前新增菜单节点的父节点......");
    return;
  }
  menuForm.pid=id; //指定新增节点的父id
  axios.post("http://localhost:8080/saveMenus",menuForm)
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
</script>

<template>
<h2>菜单添加</h2>
  <div>
    <h4>选择新增节点的父节点：</h4>
<el-tree
  :props="props"
  :data="treeNodeList"
  node-key="id"
  ref="treeRef"
  show-checkbox
  @node-click="hanldNodeClick"
  highlight-current="true"
/>
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
</style>