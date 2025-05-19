<script setup>
import {onMounted, reactive, ref} from "vue";
import axios from "axios";
import {ElMessage} from "element-plus";
//声明销售机会列表集合
const sellJhList=ref([]);
//声明total
const total=ref(0);

//定义函数发生ajax请求加载列表
function querySellJhList(pageNum){
  axios.get("http://localhost:8080/sellJhList?pageNum="+pageNum)
      .then((response)=>{
        sellJhList.value=response.data.sellJhList;
        total.value=response.data.total;
      })
      .catch((error)=>{
        console.log(error);
      });
}

//页面加载发送ajax请求
onMounted(function(){
  querySellJhList(1);
});
//定义分页按钮的回调函数
function selljHPageChange(pageNum){
  querySellJhList(pageNum);
}
//定义函数，将数字表示的渠道转化为渠道名字
function getChannelName(channelId){
  switch (channelId){
    case 0:
      return "自媒体";
    case 1:
      return "网络推广";
    case 2:
      return "老客户介绍"
    case 3:
      return "陌拜"
    case 4:
      return "二次客户"

  }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 添加对话框
const  dialogSellVisible=ref(false);
//声明表单对象数据
const sellJhForm=reactive({
  custid:'',
  channelId:'',
  money:0,
  nowStep:'',
  empId:''
});
//声明客户列表
const custList=ref([]);
//定义函数打开数据回显的对话框
function openSellDialog(row){
  dialogSellVisible.value=true;
  axios.get("http://localhost:8080/listAllCust")
      .then((response)=>{
    custList.value=response.data;
    //下拉列表框渲染结束后，再实现回显
        sellJhForm.custid=row.custid;
        sellJhForm.channelId=row.channelId;
        sellJhForm.money=row.money;
        sellJhForm.nowStep=row.nowStep;
        sellJhForm.empId=row.empId;
        sellJhForm.id=row.id;
        console.log(sellJhForm);

      }).catch((error)=>{
        console.log(error);
  })
}
//声明对象数组保存销售渠道选项
const channelList=ref([{id:0,label:'自媒体'},
  {id:1,label:'网络推广'},
  {id:2,label:'老客户介绍'},
  {id:3,label:'陌拜'},
  {id:4,label:'二次客户'}]);
//定义函数，发送ajax请求
function subUpdateCustForm(){
  axios.post("http://localhost:8080/updateSellJh",sellJhForm)
      .then((response)=> {
        if (response.data.code == 200) {
          ElMessage(response.data.msg);
          dialogSellVisible.value = false;
          querySellJhList(1);
        } else {
          ElMessage(response.data.msg);
        }
      }).catch ((error)=>{
          console.log(error);
        });

}
//发送ajax请求删除客户销售信息
function deleteSellJh(id){
  axios.get("http://localhost:8080/delSellJh?id="+id)
  .then((response)=>{
    if(response.data.code==200){
      ElMessage(response.data.msg);
      querySellJhList(1);
    }else{
      ElMessage(response.data.msg);
    }
    }).catch((error)=>{
      console.log(error);
    });
}
</script>

<template>
  <h2>客户销售过程列表</h2>
  <el-table :data="sellJhList" stripe style="width: 100%">
    <el-table-column prop="id" label="编号" width="180"/>
    <el-table-column prop="custName" label="客户" width="180"/>
    <el-table-column prop="channelId" label="销售渠道">
      <template #default="scope">
        {{getChannelName(scope.row.channelId)}}
      </template>
    </el-table-column>
    <el-table-column prop="money" label="销售金额"/>
    <el-table-column prop="nowStep" label="销售阶段"/>
    <el-table-column prop="empId" label="业务员"/>


    <el-table-column fixed="right" label="操作" width="120">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="deleteSellJh(scope.row.id)">删除
        </el-button>
        <el-button link type="primary" size="small" @click="openSellDialog(scope.row)">修改
        </el-button>
      </template>
    </el-table-column>

  </el-table>

  <hr/>
  <!-- 分页组件 -->
  <el-pagination
      small
      background
      :page-size="3"
      :pager-count="10"
      layout="prev, pager, next"
      :total="total"
      class="mt-4" @current-change="selljHPageChange"/>
<!--  添加对话框组件-->
  <el-dialog v-model="dialogSellVisible" width="80%">
    <h2>修改客户销售信息</h2>
    <el-form-item label="客户名称">
      <el-select
        v-model="sellJhForm.custid"
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
      <el-select v-model="sellJhForm.channelId " placeholder="请选择渠道..." style="width: 80%">
        <el-option v-for="opt in  channelList"
                   :value="opt.id"
                   :label="opt.label"
                   :key="opt.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="销售金额">
      <el-input v-model="sellJhForm.money" style="width: 80%"></el-input>
    </el-form-item>
    <el-form-item label="开发阶段">
      <el-select v-model="sellJhForm.nowStep" placeholder="请选择..." style="width: 80%">
        <el-option label="解约" value="解约"/>
        <el-option label="报价" value="报价"/>
        <el-option label="签约" value="签约"/>
      </el-select>
    </el-form-item>
    <el-form-item label="业务员">
      <el-select v-model="sellJhForm.empId" style="width: 80%" readonly="readonly"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="subUpdateCustForm">保存</el-button>
    </el-form-item>
  </el-dialog>
</template>

<style scoped>

</style>