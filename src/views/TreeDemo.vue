<script setup >

import {onMounted, reactive, ref} from "vue";
import axios from "axios";
const props={
  id:'id',
  label:'name',
  children:'zones'
};
//定义tree控件上需要显示的节点数据
const treeNodeList=ref([]);
function hanldNodeClick(x){
  console.log("--------------");
  console.log(x);
}
const treeRef=ref(null);
/*定义tree控件复选框选中状态发生变化的时候回调函数*/
function hanldNodeChange(x,y,z){
  let nodes = treeRef.value.getCheckedNodes(true);
  console.log(nodes);
  nodes.forEach((item)=>{ //item表单选中的节点对象

    console.log(treeRef.value.getNode(item).parent);
  })
}
//页面加载发送ajax请求
onMounted(function(){
  axios.get("http://localhost:8080/loadTree")
      .then((response)=>{
        treeNodeList.value=response.data;
      })
      .catch((error)=>{
        console.log(error);
      })
});
</script>

<template>
  <h2>tree</h2>
  <!-- props:用来实现tree控件的配置，指定给tree控件提供数据的对象的key
       data:提供tree控件节点数据，数据的定义需要符合props的配置
       show-checkbox 是否选项否选框
       node-key:需要唯一一般使用id
    -->
  <el-tree
      :props="props"
      :data="treeNodeList"
      show-checkbox
      node-key="id"
      ref="treeRef"
      @node-click="hanldNodeClick"
      @check-change="hanldNodeChange"
  />
</template>

<style scoped>

</style>