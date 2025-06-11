<template>
  <h2>商品信息</h2>
  <div style="text-align: left">
    <el-form :model="condForm" label-width="120px" :inline="true">
      <el-form-item>
        <el-button type="primary" @click="openItemDialog">添加商品</el-button>
      </el-form-item>
      <el-form-item label="编号"style="width: 20%">
        <el-input v-model="condForm.itemNum" />
      </el-form-item>
      <el-form-item label="名称"style="width: 20%">
        <el-input v-model="condForm.itemName" />
      </el-form-item>
      <el-form-item label="状态" style="width: 20%">
        <el-select v-model="condForm.statue" >
          <el-option label="上架" value="0" />
          <el-option label="下架" value="1" />
          <el-option label="删除" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryCondItem">查询</el-button>
        <!-- 新增的重置按钮 -->
        <el-button type="info" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!-- 添加商品信息的对话框 -->
  <el-dialog
      v-model="dialogItemVisible"
      width="60%">
    <div style="text-align: left">
      商品图片:<!--  上传商品图片控件  -->
      <el-upload
          ref="uploadRef"
          action="http://localhost:8080/uploadImg"
          list-type="picture-card"
          :auto-upload="true"
          method="post"
          :on-success="handleAvatarSuccess">
        <el-icon>
          <Plus/>
        </el-icon>

        <template #file="{ file }">
          <div>
            <img class="el-upload-list__item-thumbnail"
                 v-if="imgUrl"
                 :src="imgUrl"
                 alt=""
                 style="width: 148px;height: 148px"/>
            <span class="el-upload-list__item-actions">
          <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in/></el-icon>
          </span>
            </span>
          </div>
        </template>
      </el-upload>
      <el-image v-for="img in imageUrls" :src="img" style="width: 138px;height: 138px"></el-image>
    </div>
    <el-form :model="itemForm" label-width="120px" :inline="true">

      <el-form-item label="名称">
        <el-input v-model="itemForm.itemName" />
      </el-form-item>
      <el-form-item label="编号">
        <el-input v-model="itemForm.itemNum" readonly/>
      </el-form-item>
      <el-form-item label="种类">
        <el-input v-model="itemForm.typeId" placeholder="请选择类型"
                  @click="openTypeDialog"/>
      </el-form-item>
      <el-form-item label="库存">
        <el-input v-model="itemForm.store" />
      </el-form-item>
      <el-form-item label="品牌" style="width: 34%">
        <el-select
            v-model="itemForm.brandId"
            class="m-2"
            placeholder="请选择供品牌"
        >
          <el-option
              v-for="item in brandList"
              :key="item.brandId"
              :label="item.brandName"
              :value="item.brandId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="仓库" style="width: 34%">
        <el-select
            v-model="itemForm.storeId"
            class="m-2"
            placeholder="请选择供仓库"
        >
          <el-option
              v-for="item in storeList"
              :key="item.storeId"
              :label="item.storeName"
              :value="item.storeId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="供应商" style="width: 34%">
        <el-select
            v-model="itemForm.supplyId"
            class="m-2"
            placeholder="请选择供应商"


        >
          <el-option
              v-for="item in supplyList"
              :key="item.supplyId"
              :label="item.supplyName"
              :value="item.supplyId"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="产地" style="width: 34%">
        <el-select
            v-model="itemForm.placeId"
            class="m-2"
            placeholder="请选择供产地"


        >
          <el-option
              v-for="item in placeList"
              :key="item.placeId"
              :label="item.placeName"
              :value="item.placeId"
          />
        </el-select>

      </el-form-item>
      <el-form-item label="单位" style="width: 34%">
        <el-select
            v-model="itemForm.unitId"
            class="m-2"
            placeholder="请选择商品单位"


        >
          <el-option
              v-for="item in unitList"
              :key="item.unitId"
              :label="item.unitName"
              :value="item.unitId"
          />
        </el-select>

      </el-form-item>
      <el-form-item label="进价">
        <el-input v-model="itemForm.price" />
      </el-form-item>
      <el-form-item label="售价">
        <el-input v-model="itemForm.sellPrice" />
      </el-form-item>
      <el-form-item label="会员价">
        <el-input v-model="itemForm.vipPrice" />
      </el-form-item>
      <el-form-item label="详细介绍" style="width: 72%">
        <el-input v-model="itemForm.itemDesc" type="text"/>
      </el-form-item>
      <el-form-item label="生成日期">
        <el-date-picker
            v-model="itemForm.itemDate"
            type="date"
            placeholder="Pick a day"
            :size="size"
        />
      </el-form-item>
      <el-form-item label="保质期">
        <el-date-picker
            v-model="itemForm.endDate"
            type="date"
            placeholder="Pick a day"
            :size="size"
        />
      </el-form-item>

      <hr/>
      <el-form-item>
        <el-button type="primary" @click="saveItemForm">保存</el-button>
        <el-button @click="clearItemForm">清空</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
  <!-- 图片预览的对话框 -->
  <el-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>

  <!-- 添加选择商品类型的对话框 -->
  <!-- 添加商品信息的对话框 -->
  <el-dialog
      v-model="typeDialog"
      width="40%">
    <h2>选择商品类型</h2>
    <el-tree
        :props="config"
        :data="categoryList"
        default-expand-all
        node-key="id"
        ref="treeRef"
        highlight-current="true"
        :expand-on-click-node="false"
        @node-click="handleClickNode">
    </el-tree>
    <el-button type="primary" @click="saveType">确认</el-button>
  </el-dialog>
  <!-- 表格-->
  <el-table :data="itemList" :border="parentBorder" style="width: 100%">
  <el-table-column type="expand">
    <template #default="props">
      <div m="4">
        <el-image :src="doImgs(props.row.imgs)" style="width: 200px;height: 100px"></el-image>

        <el-table :data="[props.row]" :border="childBorder">
          <el-table-column label="进价" prop="price" />
          <el-table-column label="销售价" prop="sellPrice" />
          <el-table-column label="会员价" prop="vipPrice" />
          <el-table-column label="生成日期" prop="itemDate" />
          <el-table-column label="过期日期" prop="endDate" />
          <el-table-column label="状态">
            <template #default="scope">
              {{toStatue(scope.row.statue)}}
            </template>
          </el-table-column>
          <el-table-column label="库存" prop="store" />
        </el-table>
      </div>
    </template>
  </el-table-column>
    <el-table-column label="编号" prop="itemNum" />
    <el-table-column label="名称" prop="itemName" />
    <el-table-column label="品牌" prop="brandName" />
    <el-table-column label="产地" prop="placeName" />

    <el-table-column label="操作" fixed="right">
      <template #default="scope">
        <el-button type="primary" size="small" @click="editItem(scope.row)">修改</el-button>
        <el-button type="primary" size="small" @click="downItem(scope.row.id)">下架</el-button>
        <el-button type="primary" size="small" @click="delItem(scope.row.id)">删除</el-button>
        <el-button type="primary" size="small" @click="openBuyDialog(scope.row.id)">采购</el-button>
        <el-button type="primary" size="small" @click="openOutDialog(scope.row)">出库</el-button>
      </template>
    </el-table-column>
    <el-table-column label="单位" prop="unitName" />
  </el-table>
  <!-- 分页组件 -->
  <el-pagination
      small
      background
      :page-size="3"
      :pager-count="10"
      layout="prev, pager, next"
      :total="total"
      class="mt-4" @current-change="handlerPageChange"/>
  <!--商品采购对话框-->
  <el-dialog
      v-model="buyDialog"
      width="60%">
    <h2>商品采购</h2>

    <el-form :model="buyForm" label-width="120px">
      <el-form-item label="商品名称">
         <el-input v-model="buyForm.itemName" style="width: 80%" readonly/>
      </el-form-item>
      <el-form-item label="仓库" >
        <el-input v-model="buyForm.storeName" style="width: 80%" readonly/>
      </el-form-item>
      <el-form-item label="供应商">
        <el-input v-model="buyForm.supplyName" style="width: 80%" readonly/>
      </el-form-item>
      <el-form-item label="产地">
        <el-input v-model="buyForm.placeName" style="width: 80%" readonly/>
      </el-form-item>
      <el-form-item label="预计采购量">
        <el-input v-model="buyForm.buyNum" style="width: 80%"/>
      </el-form-item>
      <el-form-item label="采购人">
        <el-input v-model="buyForm.buyUser" style="width: 80%"/>
      </el-form-item>

      <el-form-item label="采购人电话">
        <el-input v-model="buyForm.phone" style="width: 80%"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="saveBuyOrder">保存</el-button>
        <el-button @click="closeBuyDialog">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <!-- 出库对话框组件 -->
  <el-dialog
      v-model="itemOutDialog"
      width="60%">
    <h2>商品采购</h2>

    <el-form :model="outForm" label-width="120px">
      <el-form-item label="商品名称">
        {{outForm.itemName}}
      </el-form-item>
      <el-form-item label="仓库">
        {{outForm.storeName}}
      </el-form-item>
      <el-form-item label="商品库存">
        {{outForm.store}}
      </el-form-item>
      <el-form-item label="出库数量">
        <el-input v-model="outForm.outNum" style="width: 80%"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="saveOutOrder">保存</el-button>
        <el-button @click="closeOutDialog">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>

</template>

<script setup>

import {onMounted,reactive, ref} from "vue";
import { Plus ,ZoomIn } from '@element-plus/icons-vue'
import { getCurrentInstance } from "vue";
const axios = getCurrentInstance().proxy.axios;
import {ElMessage, ElMessageBox} from "element-plus";


//定义对话框状态
const dialogItemVisible = ref(false);
function closeOutDialog() {
  itemOutDialog.value = false;
}

// 定义表单的初始状态，方便重置
const initialItemFormState = {
  id: '',
  itemNum:'',
  itemName:'',
  typeId:'',
  store:0,
  brandId:'',
  storeId:'',
  supplyId:'',
  placeId:'',
  unitId:'',
  price:'0.0',
  sellPrice:0.0,
  vipPrice:'0.0',
  itemDesc:'',
  itemDate:'',
  endDate: '',
  imgs:'',
  imgArr:[]
};

//声明表单
const itemForm = reactive({...initialItemFormState}); // 使用扩展运算符创建副本
//声明变量保存处理添加和更新请求接口的url
var url="";
//定义函数打开添加商品对话框
function openItemDialog() {
  clearItemForm(); // 打开对话框时先清空一次表单
  url="http://localhost:8080/addItem"; //处理新增请求的接口
  dialogItemVisible.value = true;
  //调用函数加载供应商列表
  loadSupplyList();
  //加载商品产地选项
  loadPlaceList();
  //加载商品单位选项
  queryUnitList();
  //加载商品品牌选项
  queryBrandList();
  //加载仓库选项
  queryStoreList();
  //调用函数获得商品编码
  getItemCode();
}
//声明变量保存需要预览的图片路径
const dialogImageUrl=ref(null);
//预览图片对话框的状态
const dialogVisible=ref(false);
function handlePictureCardPreview(file){
  console.log("======================"+file);
  dialogImageUrl.value = file.url;
  dialogVisible.value = true
}
//定义图片上传成功后的回调函数
function handleAvatarSuccess(path){
  console.log(path)
  itemForm.imgArr=[]; //如果重新上传图片清空原来的值
  //将响应的图片路径保存表单的imgs数组中
  itemForm.imgArr.push(path);
  //将原来回显的图片路径清空
  imageUrls.value=null;
}
//声明供应商列表
const supplyList=ref([]);
function loadSupplyList(){
  axios.get("http://localhost:8080/supplyList")
      .then((response)=>{
        supplyList.value=response.data;
      })
      .catch((error)=>{
        console.log(error);
      })
}
//声明产地列表集合数据
const placeList=ref([]);
function loadPlaceList(){
  axios.get("http://localhost:8080/placeList")
      .then((response)=>{
        placeList.value=response.data;
      })
      .catch((error)=>{
        console.log(error);
      });
}
//声明单位集合
const unitList=ref([]);
function queryUnitList(){
  axios.get("http://localhost:8080/unitList")
      .then((response)=>{
        unitList.value=response.data;
      })
      .catch((error)=>{
        console.log(error);
      });
}
//声明品牌选项集合
const brandList=ref([]);
function queryBrandList(){
  axios.get("http://localhost:8080/brandList")
      .then((response)=>{
        brandList.value=response.data;
      })
      .catch((error)=>{
        console.log(error);
      });
}
//声明仓库列表集合
const storeList=ref([])
function queryStoreList(){
  axios.get("http://localhost:8080/storeList")
      .then((response)=>{
        storeList.value=response.data;
      })
      .catch((error)=>{
        console.log(error);
      });
}
//定义选择商品类目的对话框状态
const typeDialog=ref(false);
function openTypeDialog(){
  typeDialog.value=true;
  itemCategoryTree();//打开对话框显示类目树
}

//////////////////////////////////////////////////////////////////
//声明tree的配置
const config={
  id:'id',
  label:'label',
  children:'children'
};
//声明tree的引用
const treeRef=ref(null);
//声明树节点数据
const categoryList=ref([]);
//发送请求加载树
function itemCategoryTree(){
  axios.get("http://localhost:8080/categoryList")
      .then((response)=>{
        categoryList.value=response.data;
      })
      .catch((error)=>{
        console.log(error);
      })
}

var pnode=null;//记录当前选中的节点对象
//树节点单击的回调函数
function handleClickNode(node,data){
  pnode=node;
}
//当选择某个类型节点确认关闭对话框
function saveType(){
  if(!(pnode && pnode.children.length==0)){
    ElMessage("必选选中叶子节点........");
    return;
  }
  typeDialog.value=false;
  itemForm.typeId=pnode.id;
}
//向后台发送请求获得商品编码
function getItemCode(){
  axios.get("http://localhost:8080/getCode")
      .then((response)=>{
        itemForm. itemNum=response.data;
      })
      .catch((error)=>{
        console.log(error);
      })
}
const itemFormRef = ref(null); // 用于 el-form
const uploadRef = ref();
function clearItemForm() {
  // 重置 itemForm 对象到初始状态
  Object.assign(itemForm, initialItemFormState);
  // 特别处理数组，确保它们被重置为空数组
  // (对于 reactive 对象，直接赋值新数组 itemForm.imgArr = [] 也是可以的)
  itemForm.imgArr = []; // 确保 imgArr 被清空

  // 清空已上传的文件列表
  if (uploadRef.value) {
    uploadRef.value.clearFiles();
  }

  // 如果表单有验证规则，也需要重置验证状态
  if (itemFormRef.value) {
    itemFormRef.value.resetFields(); // 清除验证提示，并将表单项重置为初始值（如果定义了 prop）
  }
  // 如果希望每次清空后都获取新的商品编码，可以在这里调用
  // getItemCode(); // 例如，如果编号是自动生成的
}
//发送请求提交form表单
function saveItemForm(){
  //处理表单中的数组,将数组转化为字符，赋值给imgs
  itemForm.imgs=itemForm.imgArr.toString();
  console.log(itemForm)
  axios.post("http://localhost:8080/addItem",itemForm)
      .then((response)=>{
        if(response.data.code==200){
          dialogItemVisible.value=false; //关闭对话框
          clearItemForm(); // 保存成功后也调用清空函数
          queryItemList(1); // 建议: 保存成功后重新加载列表
        }
        ElMessage(response.data.msg);
      })
      .catch((error)=>{
        console.log(error);
      })
}
////////////////////////////////////////分页//////////////////////////////////
const parentBorder = ref(false)
const childBorder = ref(false)
//声明商品列表集合
const itemList=ref([]);
//声明总记录数
const total=ref(0);
const currentPage=ref(1);
//封装查询条件
const condForm=reactive({
  itemNum:'',
  itemName:'',
  statue:''
});
//定义函数发送请求加载商品列表
function queryItemList(pageNum){
  //axios.get("http://localhost:8080/itemList?pageNum="+pageNum)
  condForm.pageNum=pageNum; //给封装查询条件的form表单对象中扩展属性值
  axios.post("http://localhost:8080/itemList",condForm)
      .then((response)=>{
        itemList.value=response.data.items;
        total.value=response.data.total;
      })
      .catch((error)=>{
        console.log(error);
      })
}
//定义函数处理图片路径
function doImgs(path){

  return (path+"").split(",")[0];

}
//转化商品状态
function toStatue(statue){
  switch (statue){
    case 0:
      return "上架";
    case 1:
      return "下架";
    case 2:
      return "删除";
  }
}
//定义分页按钮回调函数
function handlerPageChange(pageNum){
  currentPage.value=pageNum;
  queryItemList(pageNum);
}
//加载调用函数
onMounted(function(){
  queryItemList(1)
})
////////////////////////////定义form表单封装查询条件/////////////////////////
function  queryCondItem(){
  queryItemList(1);
  currentPage.value=1;
  //queryItemList()
}
//定义函数发生商品的下架请求
function downItem(id){
  axios.get("http://localhost:8080/downItem/"+id)
      .then((response)=>{
        if(response.data.code==200){
          //刷新列表
          queryItemList(1);
        }
        ElMessage(response.data.msg);
      })
      .catch((error)=>{
        console.log(error);
      })
}
//定义函数发生商品的删除请求
function delItem(id){
  ElMessageBox.confirm(
    '确定要删除该商品吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    axios.get("http://localhost:8080/DelItem/"+id)
      .then((response)=>{
        if(response.data.code==200){
          //刷新列表
          queryItemList(1);
        }
        ElMessage(response.data.msg);
      })
      .catch((error)=>{
        console.log(error);
      })
  }).catch(() => {
    // 取消删除操作
  });
}
// 定义函数重置查询条件
function resetQuery() {
  // 清空查询条件表单
  condForm.itemNum = '';
  condForm.itemName = '';
  condForm.statue = '';

  // 重新加载商品列表
  queryItemList(1);
}
//声明集合保存需要回显的图片路径
const imageUrls=ref([]);
//打开商品信息回显对话框
function editItem(row){
  dialogItemVisible.value=true;
  //调用函数加载供应商列表
  loadSupplyList();
  //加载商品产地选项
  loadPlaceList();
  //加载商品单位选项
  queryUnitList();
  //加载商品品牌选项
  queryBrandList();
  //加载仓库选项
  queryStoreList();

  //给imageUrls赋值
  imageUrls.value=row.imgs.split(",");
  //imgArr保存原始的图片路径，如果不修改图片，即不重新上传图片
  itemForm.imgArr=row.imgs.split(",");
  itemForm.id=row.id;
  itemForm.itemNum=row.itemNum;
  itemForm.itemName=row.itemName;
  itemForm.typeId=row.typeId;
  itemForm.placeId=row.placeId;
  itemForm.brandId=row.brandId;
  itemForm.supplyId=row.supplyId;
  itemForm.storeId=row.storeId;
  itemForm.itemDesc=row.itemDesc;
  itemForm.itemDate=row.itemDate;
  itemForm.endDate=row.endDate;
  itemForm.price=row.price;
  itemForm.store=row.store;
  itemForm.sellPrice=row.sellPrice;
  itemForm.vipPrice=row.vipPrice;
  itemForm.unitId=row.unitId;
}
///////////////////////////////商品采购部分///////////////////////////////
//声明商品采购表单
const buyForm=reactive({
  productId:'',
  storeId:'',
  supplyId:'',
  placeId:'',
  itemName:'',
  storeName:'',
  supplyName:'',
  placeName:'',
  buyNum:'',
  buyUser:'',
  phone:''
})
//声明变量控制对话框状态
const buyDialog=ref(false);
//定义函数打开采购对话框
function openBuyDialog(id){
  console.log("====="+id);
  buyDialog.value=true;
  //发送ajax请求，获得需要带入的数据
  axios.get("http://localhost:8080/buyAutoInfo/"+id)
      .then((response)=>{
        //获得响应数据对象
        var item=response.data;
        //将响应数据赋值给buyForm表单
        buyForm.productId=item.id;
        buyForm.itemName=item.itemName;
        buyForm.storeId=item.storeId;
        buyForm.storeName=item.storeName;
        buyForm.supplyId=item.supplyId;
        buyForm.supplyName=item.supplyName;
        buyForm.placeId=item.placeId;
        buyForm.placeName=item.placeName;

      })
      .catch((error)=>{
        console.log(error);
      });
}
//定义函数发生保存采购单的请求
function saveBuyOrder(){
  axios.post("http://localhost:8080/saveBuyList",buyForm)
      .then((response)=>{
        if(response.data.code==200){
          buyDialog.value=false;//关闭对话框
          //清空buyForm表单
          buyForm.productId='';
          buyForm.itemName="";
          buyForm.storeId='';
          buyForm.storeName='';
          buyForm.supplyId='';
          buyForm.supplyName='';
          buyForm.placeId='';
          buyForm.placeName='';
          buyForm.buyUser='';
          buyForm.phone='';
          buyForm.buyNum='';;

        }
        ElMessage(response.data.msg);
      })
      .catch((error)=>{
        console.log(error);
      })
}
//声明出库对话框状态
const itemOutDialog=ref(false);
//声明商品出库form表单
const outForm=reactive({
  itemName:'',
  storeName:'',
  store:0,
  outNum:0
});

//定义函数打开商品出库对话框
function openOutDialog(row){
  itemOutDialog.value=true;
  //outForm表单赋值实现数据带入
  outForm.itemName=row.itemName;
  outForm.store=row.store;
  outForm.storeName=row.storeName;
  outForm.id=row.id;
  outForm.productId = row.id;
}
//定义函数发生商品出库请求
function saveOutOrder() {
  axios.post("http://localhost:8080/doItemOutStore", outForm)
      .then((response) => {
        if (response.data.code == 200) {
          itemOutDialog.value = false;
        }
        ElMessage(response.data.msg);
      })
      .catch((error) => {
        console.log(error);
      })
}
</script>
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

</style>


<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

::v-deep .el-tree-node.is-current > .el-tree-node__content {
  background-color:darkblue !important; /* 修改为你想要的颜色 */
}


.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>