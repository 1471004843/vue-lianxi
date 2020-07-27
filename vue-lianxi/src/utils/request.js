import axios from "axios";

// 创建axios，赋给变量service
// 手把手撸码前端API，地址 http://www.web.jshtml.cn/productapi

const BASEURL = process.env.NODE_ENV === "production" ? "" : "/devApi";
const service = axios.create({
  baseURL: BASEURL,
  timeout: 1000
});

// console.log(process.env.NODE_ENV);j
// console.log(process.env.VUE_APP_ABC);
// 添加请求拦截器
service.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么
    return response;
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

service.request({
  method: "post",
  url: "/LoginVertify/",
  data: {
      UserID:'1000',
      PassWord:'a15312981111'
  }
});
export default service;
// 使用export default(只能暴露一个节点),引入文件时import不需要用花括号；
// 使用export(可以暴露多个节点),引入文件时import需要用花括号。
