import axios from 'axios';
//自己创建service对象，用来完成对系统的axios进行封装，自己创建service可以和系统的axios
//发送ajax请求，和系统axios默认不一样的是自定义的service可以携带凭证信息
const service = axios.create({
    //baseURL: process.env.VUE_APP_BASE_API || '/api', // 设置基础 URL
    //timeout: 10000, // 超时时间
    withCredentials:true,
    /*headers: {
        'Content-Type': 'application/json',
    },*/
});


export default service;