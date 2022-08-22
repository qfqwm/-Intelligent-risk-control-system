//对axios进行二次封装
import axios from 'axios';
// import { message } from 'ant-design-vue';
// import router from '@/router';
const api = axios.create({
  //服务器
  baseURL: 'http://10.8.21.166:8848',

  //ztc测试环境
  // baseURL: 'http://10.8.21.166:8848',

  // baseURL:"http://172.20.10.10:8080",
  // headers:{"Content-Type":"application/json;charset=utf-8"}
});

// // 添加请求拦截器
// api.interceptors.request.use(
//   function (config) {
//     // 在发送请求之前做些什么
//     console.log(config, 'kjj');

//     return config;
//   },
//   function (error) {
//     // 对请求错误做些什么
//     return Promise.reject(error);
//   },
// );

// // 添加响应拦截器
// api.interceptors.response.use(
//   function (response) {
//     // 2xx 范围内的状态码都会触发该函数。
//     // 对响应数据做点什么
//     // console.log(response, 'jd');
//     if (response.status == 200) {
//       message.success(response.data.msg);
//     }

//     return response;
//   },
//   function (error) {
//     // 超出 2xx 范围的状态码都会触发该函数。
//     // 对响应错误做点什么
//     return Promise.reject(error);
//   },
// );
export default api;
