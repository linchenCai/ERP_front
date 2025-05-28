<template>
  <h2>商品信息</h2>
  <div style="text-align: left">
    <el-button type="primary" @click="openItemDialog">添加商品</el-button>
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
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt=""/>
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
    </div>
    <el-form :model="itemForm" label-width="120px" :inline="true">

      <el-form-item label="名称">
        <el-input v-model="itemForm.itemName" />
      </el-form-item>
      <el-form-item label="编号">
        <el-input v-model="itemForm.itemNumer" />
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
        <el-button>清空</el-button>
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
</template>

<script setup>

import {reactive, ref} from "vue";
import { Plus ,ZoomIn } from '@element-plus/icons-vue'
import axios from "axios";
import {ElMessage} from "element-plus";


//定义对话框状态
const dialogItemVisible = ref(false);
//声明表单
const itemForm = reactive({
  id: '',
  itemNumer:'',
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
  vipPrice:'',
  itemDesc:'',
  itemDate:'',
  endDate: '',
  imgs:'',
  imgArr:[]

})

//定义函数打开添加商品对话框
function openItemDialog() {
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
  //将响应的图片路径保存表单的imgs数组中
  itemForm.imgArr.push(path);
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
        itemForm.itemNumer=response.data;
      })
      .catch((error)=>{
        console.log(error);
      })
}
const uploadRef = ref();
//发送请求提交form表单
function saveItemForm(){
  //处理表单中的数组,将数组转化为字符，赋值给imgs
  itemForm.imgs=itemForm.imgArr.toString();
  console.log(itemForm)
  axios.post("http://localhost:8080/addItem",itemForm)
      .then((response)=>{
        if(response.data.code==200){
          dialogItemVisible.value=false; //关闭对话框
          // 清空表单数据
          for (let key in itemForm) {
            if (Array.isArray(itemForm[key])) {
              itemForm[key] = [];
            } else if (typeof itemForm[key] === 'object') {
              Object.assign(itemForm[key], {});
            } else {
              itemForm[key] = '';
            }
          }
          itemForm.store = 0;
          itemForm.price = '0.0';
          itemForm.sellPrice = 0.0;
          itemForm.vipPrice = '';
          // 清空图片数组和上传控件
          itemForm.imgArr = [];
          if (uploadRef.value) {
            uploadRef.value.clearFiles();
          }
        }
        ElMessage(response.data.msg);
      })
      .catch((error)=>{
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