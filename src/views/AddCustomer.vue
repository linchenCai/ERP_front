<script setup>
import { reactive } from "vue";
import { getCurrentInstance } from "vue";
const axios = getCurrentInstance().proxy.axios;
import {ElMessage} from "element-plus";
// 声明客户对象数据，实现表单的双向绑定
const custForm = reactive({
  custName: '',
  address: '',
  phone: '',
  custType: '',
  grade: 1,
  hisTotal: 0
});
function subCustForm(){
  //console.log(custForm);
  axios.post("http://localhost:8080/saveCust", custForm)
      .then((response) => {
        console.log(response.data);
        if (response.data.code === 200) {
          ElMessage(response.data.msg);
        } else {
          ElMessage(response.data.msg);
        }
      })
      .catch((error) => {
        console.log(error);
      });
};

</script>
<template>
  <h2>添加客户信息</h2>
  <el-form :model="custForm" label-width="120px">
    <el-form-item label="客户名称">
      <el-input v-model="custForm.custName" />
    </el-form-item>
    <el-form-item label="联系地址">
      <el-input v-model="custForm.address" />
    </el-form-item>
    <el-form-item label="客户电话">
      <el-input v-model="custForm.phone" />
    </el-form-item>
    <el-form-item label="客户职业">
      <el-select v-model="custForm.custType" placeholder="请选择职业...">
        <el-option label="保密" value="保密" />
        <el-option label="金融" value="金融" />
        <el-option label="互联网" value="互联网" />
        <el-option label="IT" value="IT" />
        <el-option label="能源" value="能源" />
      </el-select>
    </el-form-item>
    <el-form-item label="客户等级">
      <el-input v-model="custForm.grade" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="subCustForm">保存</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>

</style>