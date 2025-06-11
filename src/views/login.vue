<template>
  <div class="login">
    <el-card class="box-card" shadow="always">
      <div
          style="
          padding: 40px 0px 60px 0px;
          text-align: center;
          color: #409eff;
          font-size: 50px;
          font-weight: bold;
          letter-spacing: 3px;
        "
      >ERP系统
      </div>
      <el-form
          ref="loginForm"
          :model="loginUser"
          size="large"
          label-position="right"
          label-width="70px"
          style="width: 360px; margin: 0px auto"
      >
        <el-form-item label="账号">
          <el-input v-model="loginUser.uname"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="loginUser.upwd" show-password></el-input>
        </el-form-item>

      </el-form>
      <div style="text-align: right; width: 360px; margin: 40px auto 0px">
        <el-button
            @click="userLogin"
            type="primary"
            size="large"
            style="width: 300px"
        >登录</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>


import { reactive, ref } from "vue";
import { useRouter } from 'vue-router'
import {getCurrentInstance} from "vue";
import {ElMessage} from "element-plus";

const axios=getCurrentInstance().proxy.axios;
const router = useRouter(); // 获取路由器
const loginForm = ref();

const loginUser = reactive({
  uname:"admin",
  upwd:"0000",

});

//定义函数发生登录请求
function userLogin(){
  axios.post("http://localhost:8080/userLogin",loginUser)
      .then((response)=>{
        if(response.data.code==200){
          //进行路由跳转
          router.push({name:'index'});
        }
        ElMessage(response.data.msg);
      })
      .catch((error)=>{
        console.log(error);
      });
}

</script>


<style scoped>
.login {
  background-image: url("../assets/logo.png");
  background-size: 100% 100%;

  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;

  display: flex;
  justify-content: center;
  align-items: center;
}
.box-card {
  width: 800px;
  height: 500px;
  opacity: 0.92;
}
</style>
