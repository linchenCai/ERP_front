<template>
  <h2>入库单列表</h2>
  <!-- table列表组件 -->
  <el-table :data="inStoreList" style="width: 100%">
    <el-table-column  prop="storeName" label="仓库名称"/>
    <el-table-column prop="itemName" label="商品名称" />
    <el-table-column prop="inNum" label="实际采购数量" />
    <el-table-column prop="createBy" label="采购人"  />
    <el-table-column prop="createTime" label="采购时间"  width="200px"/>
    <el-table-column prop="isIn" label="状态" >
      <template #default="scope">
        <span v-if="scope.row.isIn==1" style="color:green">未确认</span>
        <span v-else style="color:red">已确认</span>
      </template>
    </el-table-column>

    <el-table-column fixed="right" label="操作" width="240">
      <template #default="scope">
        <el-button link type="primary" size="small" v_if="scope.row.isIn==1"
                   @click="confirmIsIn(scope.row.insId)">确认入库</el-button>
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
      class="mt-4" @current-change="handlerInStorePageChange"/>
</template>

<script setup>
//定义函数发生请求，加载入库单列表
import { getCurrentInstance } from "vue";
const axios = getCurrentInstance().proxy.axios;
import {onMounted, ref} from "vue";
//声明列表集合
const inStoreList=ref([]);
const total=ref(0);
function queryInStoreList(pageNum){
  axios.get("http://localhost:8080/queryInList?pageNum="+pageNum)
      .then((response)=>{
        inStoreList.value=response.data.inStores;
        total.value=response.data.total;
      })
      .catch((error)=>{
        console.log(error);
      })
}
//页面加载调用函数
onMounted(function(){
  queryInStoreList(1);
});
//定义分页按钮的回调函数
function handlerInStorePageChange(pageNum){
  //调用分页查询
  queryInStoreList(pageNum)
}
//定义函数发生入库单确认请求
function confirmIsIn(id){
  axios.post("http://localhost:8080/updateInStore/"+id)
      .then((response)=>{
        if(response.data.code==200){
          queryInStoreList(1);//刷新
        }
      })
      .catch((error)=>{
        console.log(error);
      })
}
</script>

<style scoped>

</style>