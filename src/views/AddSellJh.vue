<script setup >
import {onMounted, reactive, ref} from "vue";
import { getCurrentInstance } from "vue";
const axios = getCurrentInstance().proxy.axios;
import {ElMessage} from "element-plus";

//定义销售过程表单
const sellForm=reactive({
  custid:'',
  channelId:'',
  money:0.0,
  nowStep:'',
  empId:100
});
//创建数组，封装客户信息
const custList=ref([]);
//页面挂在发送ajax请求，查询所有客户信息，填充下拉列表框
onMounted(function(){
  axios.get("http://localhost:8080/listAllCust")
      .then((response)=>{
        custList.value=response.data;
      })
      .catch((error)=>{
        console.log(error);
      });
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//发送ajax请求，保存销售过程记录
function saveSellJh(){
  axios.post("http://localhost:8080/saveSell", sellForm)
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
}
</script>

<template>
  <h2>销售开发</h2>
  <el-form :model="sellForm" label-width="120px">
    <el-form-item label="客户名称">
      <el-select
          v-model="sellForm.custid"
          class="m-2"
          placeholder="请选择客户"
          size="large"
          style="width: 80%"
      >
        <el-option
            v-for="item in custList"
            :key="item.id"
            :label="item.custName"
            :value="item.id"
        />
      </el-select>

    </el-form-item>
    <el-form-item label="销售渠道">
      <el-select v-model="sellForm.channelId" placeholder="请选择渠道...." style="width: 80%">
        <el-option label="自媒体" value="0" />
        <el-option label="网络推广" value="1" />
        <el-option label="老客户介绍" value="2" />
        <el-option label="陌拜" value="3" />
        <el-option label="二次客户" value="4" />
      </el-select>
    </el-form-item>
    <el-form-item label="销售金额">
      <el-input v-model="sellForm.money" style="width: 80%"/>
    </el-form-item>
    <el-form-item label="开发阶段">
      <el-select v-model="sellForm.nowStep" placeholder="请选择...." style="width: 80%">
        <el-option label="解除" value="解除" />
        <el-option label="报价" value="报价" />
        <el-option label="签约" value="签约" />
      </el-select>
    </el-form-item>
    <el-form-item label="业务员">
      <el-input v-model="sellForm.empId" style="width: 80%" readonly="readonly"/>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="saveSellJh">保存</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>

</style>