<template>
  <h2>请选择年份</h2>
  <el-form :model="yearForm" label-width="120px" :inline="true">
    <el-form-item label="年份" style="width: 34%">
      <el-select
          v-model="yearForm.year"
          class="m-2"
          placeholder="请选择年份"
          @change="handleYearMthSell"
      >
        <el-option
            v-for="item in yearList"
            :key="item.year"
            :label="item.label"
            :value="item.year"
        />
      </el-select>
    </el-form-item>
  </el-form>
  <div id="sellCharts" style="width: 100%; height: 500%"></div>
</template>

<script setup>

import {onMounted, reactive, ref} from "vue";
import { getCurrentInstance } from "vue";
const axios = getCurrentInstance().proxy.axios;
import * as echarts from "echarts";
//声明表单数据
const yearForm=reactive({
  year:''
});
//声明选项集合
const yearList=ref([]);
//定义发送请求，加载年份数据
function loadYear(){
  axios.get("http://localhost:8080/queryYear")
      .then((response)=>{
        yearList.value=response.data;
      })
      .catch((error)=>{
        console.log(error);
      })
}
//页面加载调用函数
onMounted(function(){
  loadYear();
});
//下拉列表框选择内容发生变化的回调函数
function handleYearMthSell(year){
  console.log(year);
  //发生请求加载数据
  axios.get("http://localhost:8080/countSell?year="+year)
      .then((response)=>{

        var sellDom = document.getElementById('sellCharts');
        var sellChart = echarts.init(sellDom);

        var option = {
          xAxis: {
            type: 'category',
            data: response.data.xdata
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: response.data.ydata,
              type: 'bar',
              showBackground: true,
              backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
              }
            }
          ]
        };


        option && sellChart.setOption(option);


      })
      .catch((error)=>{})

}
</script>

<style scoped>

</style>