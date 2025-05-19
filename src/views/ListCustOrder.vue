<script setup>
import axios from "axios";
import {onMounted, reactive, ref} from "vue";

const orderList = ref([]);
const total=ref(0);
//发生请求加载订单列表
function loadOrderList(pageNum){
  condForm.pageNum=pageNum;
  axios.post("http://localhost:8080/listOrder",condForm)
      .then((response)=>{
        orderList.value=response.data.orderList;
        total.value=response.data.total;
      })
      .catch((error)=>{
        console.log(error);
      });
}
//加载事件调用函数
onMounted(function(){
  loadOrderList(1);
});
//声明保存查询条件的表单数据
const condForm=reactive({
  id:'',
  state:'',
  custName:'',
  itemName:''
})
//定义函数提交动态查询条件
function subQueryCond(){
  condForm.pageNum=1; //将原来页码重置为1
  axios.post("http://localhost:8080/listOrder",condForm)
      .then((response)=>{
        orderList.value=response.data.orderList;
        total.value=response.data.total;
      })
      .catch((error)=>{
        console.log(error);
      });
}
//定义提交分页参数的函数
function handlerOrderPageChange(pageNum){
  console.log(pageNum);
  loadOrderList(pageNum);
}
</script>

<template>
  <h2>客户订单列表</h2>
  <el-form :inline="true" :model="condForm"
  >
    <el-form-item label="订单号">
      <el-input v-model="condForm.id" />
    </el-form-item>
    <el-form-item label="订单状态" style="width: 22%">
      <el-select
          v-model="condForm.state"
          placeholder="请选择订单状态....">
        <el-option label="未出库" value="未出库" />
        <el-option label="已出库" value="已出库" />
        <el-option label="配送中" value="配送中" />
        <el-option label="已收货" value="已收货" />

      </el-select>
    </el-form-item>
    <br/>
    <el-form-item label="客户姓名">
      <el-input v-model="condForm.custName" />
    </el-form-item>
    <el-form-item label="商品名称">
      <el-input v-model="condForm.itemName" />
    </el-form-item>
    <br/>

    <el-form-item>
      <el-button type="primary" @click="subQueryCond">查询</el-button>
    </el-form-item>
  </el-form>




  <hr/>
  <el-table :data="orderList" stripe style="width: 100%">
    <el-table-column prop="id" label="订单编号"  />
    <el-table-column prop="custName" label="客户姓名" />
    <el-table-column prop="itemName" label="商品名称"/>
    <el-table-column prop="orderDate" label="订单日期" width="180"/>
    <el-table-column prop="state" label="订单状态"/>
    <el-table-column prop="num" label="数量"/>
    <el-table-column prop="pay" label="支付方式"/>
    <el-table-column prop="payMoney" label="支付金额"/>

    <el-table-column fixed="right" label="操作" width="120">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="deleteCust(scope.row.id)">删除
        </el-button>
        <el-button link type="primary" size="small"
                   @click="openCustDialog(scope.$index,scope.row)">修改
        </el-button>
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
      class="mt-4" @current-change="handlerOrderPageChange"/>

</template>

<style scoped>

</style>