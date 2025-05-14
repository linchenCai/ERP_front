<script setup>
import {onMounted, reactive, ref} from "vue";
import axios from "axios";
import {ElMessage} from "element-plus";

// 定义客户列表集合数据
const custList = ref([]);
const total=ref();
// 定义函数发送ajax请求加载列表数据
function custListQeury(pageNum) {
  axios.get( "http://localhost:8080/listCust?pageNum="+pageNum)
      .then((response)=>{
        custList.value=response.data.custList;
        total.value=response.data.total;
      })
      .catch((error)=>{
        console.log(error);
      });
}
//页面挂在加载客户列表数据
onMounted(function(){
  custListQeury(1);
});
/*处理上一页，下一页按钮回调,value绑定需要提交的页码*/
function handlerPageChange(value){
  custListQeury(value)
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const dialogCustVisible = ref(false)
//声明客户对象数据，实现表单的双向绑定
const custForm = reactive({
  custName: '',
  address: '',
  phone: '',
  custType: '',
  grade: 1,
  hisTotal: 0
});

//定义函数打开客户信息回显的对话框
/*
* index 表示修改按钮所在行的所以
* row 表示修改按钮所在的行的对象
* */
function openCustDialog(index,row) {
  dialogCustVisible.value = true;
  //console.log(index);
  //console.log(row);
  //将点击的行对象数据赋值给表单，进行回显
  custForm.custName=row.custName;
  custForm.address=row.address;
  custForm.phone=row.phone;
  custForm.grade=row.grade;
  custForm.custType=row.custType;
  custForm.id=row.id; //id不能修改，不需要显示

}
//定义函数提交修改客户信息表单
function subUpdateCustForm(){
  axios.post("http://localhost:8080/updateCust",custForm)
      .then((response)=>{
        if(response.data.code==200){
          ElMessage(response.data.msg);
          //修改成功，关闭对话框
          dialogCustVisible.value=false;
          custListQeury(1)//调用分页查询函数，重新刷新视图
        }else{
          ElMessage(response.data.msg);
        }
      })
      .catch((error)=>{
        console.log(error);
      })
}
//定义函数发生客户信息删除的ajax请求
function deleteCust(id) {
  axios.get("http://localhost:8080/delCust?id=" + id)
      .then((response) => {
        if (response.data.code == 200) {
          ElMessage(response.data.msg);
          custListQeury(1)//调用分页查询函数，重新刷新视图
        } else {
          ElMessage(response.data.msg);
        }
      })
      .catch((error) => {
        console.log(error);
      })
}
</script>

<template>
  <h2>客户列表</h2>
  <el-table :data="custList" stripe style="width: 100%">
    <el-table-column prop="id" label="客户编号" width="180" />
    <el-table-column prop="custName" label="客户姓名" width="180" />
    <el-table-column prop="address" label="客户地址" />
    <el-table-column prop="phone" label="客户电话" />
    <el-table-column prop="custType" label="客户职业" />
    <el-table-column prop="grade" label="客户等级" />
    <el-table-column prop="hisTotal" label="消费总额" />
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
  <hr />

  <el-pagination
      small
      background
      :page-size="10"
      :pager-count="10"
      layout="prev, pager, next"
      :total="total"
      class="mt-4" @current-change="handlerPageChange"/>
  <!-- 回显客户信息的对话框 -->
  <el-dialog
      v-model="dialogCustVisible"
      width="80%"
  >
    <h2>修改客户信息</h2>

    <!-- 对话框中添加form -->
    <el-form :model="custForm" label-width="120px">
      <el-form-item label="客户名称">
        <el-input v-model="custForm.custName" style="width: 80%"/>
      </el-form-item>
      <el-form-item label="联系地址">
        <el-input v-model="custForm.address" style="width: 80%"/>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="custForm.phone" style="width: 80%"/>
      </el-form-item>
      <el-form-item label="客户职业">
        <el-select v-model="custForm.custType" placeholder="请选择职业...." style="width: 80%">
          <el-option label="保密" value="保密"/>
          <el-option label="金融" value="金融"/>
          <el-option label="互联网" value="互联网"/>
          <el-option label="IT" value="IT"/>
          <el-option label="能源" value="能源"/>
        </el-select>
      </el-form-item>
      <el-form-item label="客户等级">
        <el-input v-model="custForm.grade" style="width: 80%"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="subUpdateCustForm">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>

<style scoped>

</style>