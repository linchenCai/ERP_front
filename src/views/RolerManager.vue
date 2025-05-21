<script setup>
import {onMounted, reactive, ref} from "vue";
import axios from "axios";
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
</template>

<style scoped>

</style>