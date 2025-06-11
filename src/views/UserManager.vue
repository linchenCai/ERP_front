<script setup >
/*声明user列表集合数据*/
import {onMounted, reactive, ref} from "vue";
import { getCurrentInstance } from "vue";
const axios = getCurrentInstance().proxy.axios;
import {ElMessage} from "element-plus";
//声明user列表集合数据
const userList=ref([]);
/*声明总记录数*/
const total=ref(0);
let currentPage = ref(1);
//定义函数发送请求获取用户列表数据
function queryUserList(pageNum){
  axios.get("http://localhost:8080/userList?pageNum="+pageNum)
  .then((response)=>{
    userList.value=response.data.userList;
    total.value=response.data.total;
  }).catch((error)=>{
    console.log(error);
  })
}

//加载调用函数
onMounted( function (){
  queryUserList(1);
})
//定义分页改变时调用
function handlerPageChange(pageNum){
  currentPage.value = pageNum;
  queryUserList(pageNum);
}
//////////////////////////////////////////////////////////////
//添加用户信息
//定义添加用户信息对话框状态
const dialogUserVisible=ref(false);
const userForm=reactive({
  uname:"",
  phone:"",
  edu:"",
  age:"",
  title:"",
  rids:[],
});
//声明变量保存添加用户信息和更新用户信息的url
var url="";
//声明角色的集合
const optRoles=ref([]);
function openUserDialog(){

  dialogUserVisible.value=true;
  url = "http://localhost:8080/saveUser";//保存用户接口的url
  //发送请求获取角色信息
  axios.get("http://localhost:8080/loadAllRoles")
      .then((response)=>{
        optRoles.value=response.data;
      })
  .catch((error)=>{
    console.log(error);
  })
}
////////////////////////////保存用户信息/////////////////////////////
function subUserForm(){
axios.post(url,userForm)
    .then((response)=>{
      if(response.data.code==200){
        //关闭对话框
        dialogUserVisible.value=false;
      }
      ElMessage(response.data.msg)
    })
    .catch((error)=>{
      console.log(error);
    })
}
//打开对话框实现用户信息回显
function showUserDialog(row){
  dialogUserVisible.value=true;
  //url赋值为更新用户信息接口的地址
  url="http://localhost:8080/updateUser"
  //将row赋值给userForm表单
  userForm.id=row.id;
  userForm.uname=row.uname;
  userForm.phone=row.phone;
  userForm.edu=row.edu;
  userForm.age=row.age;
  userForm.title=row.title;
  //打开对话框实现用户信息回显
  axios.get("http://localhost:8080/loadAllRoles")
  .then((response)=>{
    optRoles.value=response.data;
    //发送ajax请求，加载某个用户所有角色信息
    axios.get("http://localhost:8080/queryUserRids/"+row.id)
    .then((response)=>{
      //将用户对应的角色id赋值给userForm.rids
      userForm.rids=response.data;
    })
  })
  .catch((error)=>{
    console.log(error);
  })

}
//删除用户信息
function deleteUser(id){
  axios.get("http://localhost:8080/delUser/"+id)
      .then((response)=>{
        if(response.data.code==200){
          //删除成功，刷新当前页数据
          queryUserList(currentPage.value);//刷新列表
        }
        ElMessage(response.data.msg);
      }).catch((error)=>{
        console.log(error);
  })
}
</script>

<template>
<h2>用户列表</h2>
<!--添加用户-->
  <div>
  <button  @click="openUserDialog">添加用户</button>
  </div>
  <!-- table组件 -->
  <el-table :data="userList" stripe style="width: 100%">
    <el-table-column prop="id" label="用户编号" width="180"/>
    <el-table-column prop="uname" label="用户名" width="180"/>
    <el-table-column prop="phone" label="电话"/>
    <el-table-column prop="edu" label="学历"/>
    <el-table-column prop="age" label="年龄"/>
    <el-table-column prop="title" label="部门"/>
    <el-table-column fixed="right" label="操作" width="120">
    <template  #default="scope">
      <el-button link type="primary"size="small"   @click="showUserDialog(scope.row)">编辑</el-button>
      <el-button  link type="primary" size="small"  @click="deleteUser(scope.row.id)">删除</el-button>
    </template>
    </el-table-column>
  </el-table>
  <hr/>
  <el-pagination
      small
      background
      :page-size="3"
      :pager-count="10"
      layout="prev, pager, next"
      :total="total"
      class="mt-4" @current-change="handlerPageChange"/>
  <!-- 添加用户信息对话框 -->
  <el-dialog
      v-model="dialogUserVisible"
      width="80%"
  >
    <h2>修改客户信息</h2>

    <!-- 对话框中添加form -->
    <el-form :model="userForm" label-width="120px">
      <el-form-item label="用户名">
        <el-input v-model="userForm.uname" style="width: 80%"/>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="userForm.phone" style="width: 80%"/>
      </el-form-item>
      <el-form-item label="学历">
        <el-input v-model="userForm.edu" style="width: 80%"/>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="userForm.age" style="width: 80%"/>
      </el-form-item>
      <el-form-item label="部门">
        <el-input v-model="userForm.title" style="width: 80%"/>
      </el-form-item>

      <el-form-item label="角色">
        <el-select v-model="userForm.rids"
                   placeholder="请选择角色...."
                   style="width: 80%"
                   multiple>
          <el-option v-for=" opt in optRoles" :label="opt.rname"
                     :value="opt.id"
                     :key="opt.id"/>

        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="subUserForm">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped>

</style>