//对axios进行二次封装
import axios from 'axios';
const api = axios.create({
  //服务器
  // baseURL: 'http://10.255.70.21:8848',
  
  //ztc测试环境
  baseURL: 'http://10.8.21.137:8848',

  // headers:{"Content-Type":"application/json;charset=utf-8"}
});

// $axios.interceptors.request.use((config) => {
//     config.headers = config.headers||{}
//     return config
// })
export default api;
