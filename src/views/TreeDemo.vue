<template>
  <!-- div用来显示echarts控件的DOM容器 -->
  <div ref="chartContainer" style="width: 100%; height: 400px;"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import {onMounted, ref} from "vue";
import { getCurrentInstance } from "vue";
const axios = getCurrentInstance().proxy.axios;
//声明dom容器的引用
const chartContainer = ref(null);

//定义函数完成图表的渲染
function countSellData() {
  //创建echars对象
  const myCharts = echarts.init(chartContainer.value);


  //发送ajax请求，获得需要渲染的数据
  axios.get("http://localhost:8080/countSell")
      .then((response) => {

        const option = {
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
        //渲染图表
        myCharts.setOption(option);

      })
      .catch((error) => {
        console.log(error)
      });
}

onMounted(function () {
  countSellData();
});
</script>