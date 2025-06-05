<template>
  <h2>仓库列表</h2>
  <div style="text-align: left">
    <el-button type="primary" @click="openStoreDialog">添加仓库</el-button>
  </div>
<!--table组件-->
  <el-table :data="storeList" style="width: 100%">
    <el-table-column  prop="storeName" label="仓库名称"/>
    <el-table-column prop="storeNum" label="仓库编号" />
    <el-table-column prop="storeAddress" label="仓库地址" />
    <el-table-column prop="concat" label="联系人"  />
    <el-table-column prop="phone" label="联系电话" />
    <el-table-column fixed="right" label="操作" width="240">
      <template #default="scope">
        <el-button link type="primary" size="small"
                   @click="openEditStore(scope.row)">修改</el-button>
        <el-button link type="danger" size="small"
                   @click="handleDeleteStore(scope.row.storeId)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
<!--  分页组件-->
  <el-pagination
    small
    background
    :page-size="3"
    :pager-count="10"
    layout="prev, pager, next"
    :total="total"
    class="mt-4"
    @current-change="handlerStorePageChange"
    v-model:current-page="currentPage"
  />
  <!--  添加仓库信息对话框 -->
  <el-dialog title="添加仓库信息" v-model="dialogStoreVisible"
             width="80%">
    <!-- 对话框中添加form -->
    <el-form :model="storeForm" label-width="120px">
      <el-form-item label="仓库名称">
        <el-input v-model="storeForm.storeName" style="width: 80%"/>
      </el-form-item>
      <el-form-item label="仓库编号">
        <el-input v-model="storeForm.storeNum" style="width: 80%"/>
      </el-form-item>
      <el-form-item label="仓库地址">
        <el-input v-model="storeForm.storeAddress" style="width: 80%"/>
      </el-form-item>

      <el-form-item label="联系人">
        <el-input v-model="storeForm.concat" style="width: 80%"/>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="storeForm.phone" style="width: 80%"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="subStoreForm">保存</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script setup>
//声明列表集合数据
import {onMounted, reactive, ref} from "vue";
import axios from "axios";
import {ElMessage, ElMessageBox} from "element-plus";

//声明列表集合数据
const storeList=ref([]);
//声明分页总数量
const total=ref(0);
// 当前页码
const currentPage = ref(1);
//定义函数发生请求，加载列表
function queryStoreList(pageNum){
  axios.get("http://localhost:8080/storePageList?pageNum="+pageNum)
      .then((response)=>{
        storeList.value=response.data.storeList;
        total.value=response.data.total;
        currentPage.value = pageNum; // 更新当前页码的ref
      })
      .catch((error)=>{
        console.log(error);
      })
}
//加载调用
onMounted(function (){
  queryStoreList(currentPage.value); // 使用currentPage.value进行初始化加载
})
//定义分页按钮回调函数
function handlerStorePageChange(pageNum){
  queryStoreList(pageNum);
}
/////////////////////////添加仓库信息//////////////////////////////////
//声明对话框状态
const dialogStoreVisible=ref(false);
const storeForm=reactive({
  storeName:'',
  storeNum:'',
  storeAddress:'',
  concat:'',
  phone:''
});
//声明函数打开添加仓库信息对话
function openStoreDialog(){
  dialogStoreVisible.value=true;
  //保存添加接口
  url="http://localhost:8080/saveStore"
}
var url="";
//定义函数保存仓库信息
function subStoreForm(){
  axios.post(url,storeForm)
  .then((response)=>{
    if(response.data.code==200){
      //刷新列表
      queryStoreList(1);
      //关闭对话框
      dialogStoreVisible.value=false;
      //清空表单
      storeForm.storeName='';
      storeForm.storeNum='';
      storeForm.storeAddress='';
      storeForm.concat='';
      storeForm.phone='';
    }ElMessage(response.data.msg);
  })
      .catch((error)=>{
        console.log(error);
      })
}

//实现仓库信息的回显
function openEditStore(row){
  //url保存更新接口
  url="http://localhost:8080/updateStore";
  storeForm.storeName=row.storeName;
  storeForm.storeNum=row.storeNum;
  storeForm.storeAddress=row.storeAddress;
  storeForm.concat=row.concat;
  storeForm.phone=row.phone;
  //表单id属性赋值
  storeForm.storeId=row.storeId;
  dialogStoreVisible.value=true;

}
/////////////////////////删除仓库信息//////////////////////////////////
async function handleDeleteStore(storeId) {
  try {
    // 弹出确认框
    await ElMessageBox.confirm(
        '您确定要删除该仓库信息吗？此操作不可撤销。',
        '警告',
        {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning',
        }
    );

    // 用户点击了“确定删除”
    const response = await axios.delete("http://localhost:8080/deleteStore/"+storeId);
    if (response.data.code === 200) {
      ElMessage.success('仓库信息删除成功！');
      // 删除成功后刷新列表
      // 检查当前页是否只剩一条数据，并且不是第一页，如果是，则请求前一页
      if (storeList.value.length === 1 && currentPage.value > 1) {
        queryStoreList(currentPage.value - 1);
      } else {
        queryStoreList(currentPage.value); // 否则刷新当前页
      }
    } else {
      ElMessage.error(`删除失败：${response.data.msg}`);
    }
  } catch (error) {
    // 如果用户点击了“取消”或者网络等其他错误
    if (error !== 'cancel') { // ElMessageBox的cancel会reject一个'cancel'字符串
      console.error("删除仓库时出错:", error);
      ElMessage.error('删除操作执行失败，请稍后再试。');
    } else {
      ElMessage.info('已取消删除操作');
    }
  }
}
</script>


<style scoped>

</style>