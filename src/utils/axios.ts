//对axios进行二次封装
import axios from 'axios';
const api = axios.create({
  //服务器
  // baseURL: 'http://120.26.203.148:8848',

  //ztc测试环境
  baseURL: 'http://120.26.203.148:8848',

  // baseURL:"http://172.20.10.10:8080",
  // headers:{"Content-Type":"application/json;charset=utf-8"}
});

// $axios.interceptors.request.use((config) => {
//     config.headers = config.headers||{}
//     return config
// })
export default api;
