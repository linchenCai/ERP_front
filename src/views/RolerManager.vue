<script setup>
import {onMounted, reactive, ref} from "vue";
import { getCurrentInstance } from "vue";
const axios = getCurrentInstance().proxy.axios;
import {ElMessage, ElMessageBox} from "element-plus";
//定义角色集合列表数据
const rolerList=ref([]);
const total=ref(0);
let currentPage = ref(1);
//发送请求加载角色列表
function queryRoleList(pageNum){
  axios.get("http://localhost:8080/rolerList?pageNum="+pageNum)
      .then((response)=>{
        rolerList.value=response.data.rolerList;
        total.value=response.data.total;
      })
      .catch((error)=>{
        console.log(error);
      });
}
//加载页码调用函数
onMounted(function(){
  queryRoleList(1);
})

//定义分页按钮函数
function rolerPageChange(pageNum){
  currentPage.value = pageNum;
  queryRoleList(pageNum);
}
//定义编辑按钮函数
function handleEdit(row){
  row.edit=true;
}
//定义保存按钮函数
function handleSave(row){
  axios.post("http://localhost:8080/updateRoler",row)
      .then((response)=>{
        if(response.data.code==200){
          row.edit=false;
        }
        ElMessage(response.data.msg);
      })
      .catch((error)=>{
        console.log(error);
      });
}
//////////////////////////////////////////////////////
//定义对话框状态
const dialogRoleVisible=ref(false);
//定义form表单
const roleForm=reactive({
  rname:"",
  rdesc:""
});
//定义打开添加角色信息的对话框
function openRoleDialog(){
  dialogRoleVisible.value=true;
}
//定义函数提交角色信息保存的ajax请求
function saveRoleForm() {
  axios.post("http://localhost:8080/saveRoler", roleForm)
      .then((response) => {
        if (response.data.code == 200) {
          dialogRoleVisible.value = false;
          roleForm.rname = "";
          roleForm.rdesc = "";
          queryRoleList(currentPage.value)
        }
        ElMessage(response.data.msg);
      })
      .catch((error) => {
        console.log(error);
      })
}
// 定义删除按钮函数
function handleDelete(row) {
  ElMessageBox.confirm('确定要删除该角色吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 发送删除请求
    axios.get(`http://localhost:8080/deleteRoler/${row.id}`)
        .then((response) => {
          if (response.data.code === 200) {
            // 删除成功，刷新当前页数据
            queryRoleList(currentPage.value);
          }
          ElMessage(response.data.msg);
        })
        .catch((error) => {
          console.error("删除失败", error);
          ElMessage.error("删除失败，请重试");
        });
  }).catch(() => {
    // 用户点击取消
    ElMessage.info("已取消删除");
  });
}

////////////////////////////////////////////////////
//授权
const dialogRoleMenusVisible=ref(false);
//tree控件参数配置
const props2 = {
  label: 'label',
  children: 'subMenus',
  id: 'id'
};
//定义授权树节点集合数据
const treeNodeList2=ref([]);
//定义树对象的引用
const treeRef=ref(null);
//声明变量保存角色id，在完成授权的时候使用
var global_rid=0;
//定义函数打开角色授权对话框
function roleAndMenus(rid){
  global_rid=rid;
  dialogRoleMenusVisible.value=true;
  //发送ajax请求获得树节点数据
  axios.get("http://localhost:8080/listMenus")
      .then((response)=>{
        treeNodeList2.value=response.data;
        //发送ajax请求，根据角色id，获得所有该角色对应的菜单id
        axios.get("http://localhost:8080/loadRoleMid/"+rid)
            .then((response)=>{
              //实现tree回显
              treeRef.value.setCheckedKeys(response.data);
            })
            .catch((error)=>{
              console.log(error);
            })
      })
      .catch((error)=>{
        console.log(error);
      })
}
//定义实现角色菜单关闭保存的函数
function saveRoleMenus(){
  //获得tree控件中被选中的节点,包含父节点
  var nodes=treeRef.value.getCheckedNodes(false,true);
  //声明数组
  var arr=[global_rid];
  nodes.forEach((item)=>{
  arr.push(item.id);
  });
  console.log(arr);
  axios.post("http://localhost:8080/grantRoleMenus",arr)
      .then((response)=>{
        if(response.data.code==200){
          //关闭对话框
          dialogRoleMenusVisible.value=false;
        }
        ElMessage(response.data.msg);
})
  .catch((error)=>{
    console.log(error);
  })
}
</script>

<template>
  <h2>角色管理</h2>
  <div>
    <el-button type="primary" @click="openRoleDialog">
      添加角色
    </el-button>
  </div>
  <el-table :data="rolerList" stripe style="width: 100%">
    <el-table-column prop="id" label="编号" width="180"/>
    <el-table-column prop="rname" label="角色" width="180">
      <template #default="scope">
        <el-input v-if="scope.row.edit" v-model="scope.row.rname" ></el-input>
        <span v-else>{{scope.row.rname}}</span>
      </template>
    </el-table-column>

    <el-table-column prop="rdesc" label="描述">
      <template #default="scope">
        <el-input v-if="scope.row.edit" v-model="scope.row.rdesc" ></el-input>
        <span v-else>{{scope.row.rdesc}}</span>
      </template>
    </el-table-column>
    <el-table-column align="right">
      <template #header>
        <span>操作</span>

      </template>
      <template #default="scope">
        <el-button v-if="!scope.row.edit" size="mini"
                   @click="handleEdit(scope.row)">编辑</el-button>
        <el-button v-else  size="mini" type="success"
                   @click="handleSave(scope.row)">保存</el-button>
        <!-- 新增：删除按钮 -->
        <el-button size="mini" type="danger" style="margin-left: 8px"
                   @click="handleDelete(scope.row)">删除</el-button>

        <el-button @click="roleAndMenus(scope.row.id)">授权</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- 分页组件 -->
  <el-pagination
      small
      background
      :page-size="3"
      :pager-count="10"
      layout="prev, pager, next"
      :total="total"
      class="mt-4" @current-change="rolerPageChange"/>

<!--角色信息对话框-->
  <el-dialog
  v-model="dialogRoleVisible" width="80%">
<h2>
  角色信息
</h2>
    <el-form :model="roleForm" label-width="120px">
      <el-form-item label="角色名称">
        <el-input v-model="roleForm.rname" style="width: 80%"></el-input>
      </el-form-item>
      <el-form-item label="角色描述">
        <el-input v-model="roleForm.rdesc" style="width: 80%"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveRoleForm">保存</el-button>
        <el-button>取消</el-button>
</el-form-item>
    </el-form>
  </el-dialog>
<!--角色授权对话框-->
  <el-dialog
      v-model="dialogRoleMenusVisible"
      width="50%">
    <h2>
      角色授权
    </h2>
<!--添加tree组件-->
    <el-tree
        ref="treeRef"
        :data="treeNodeList2"
        node-key="id"
        default-expand-all
        :props="props2"
        show-checkbox
    >
    </el-tree>
<!--    添加按钮组件-->
    <el-button type="primary" @click="saveRoleMenus">保存权限</el-button>
    <el-button @click="dialogRoleMenusVisible = false">关闭授权</el-button>  </el-dialog>
</template>

<style scoped>

</style>