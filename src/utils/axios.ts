//对axios进行二次封装
import axios from 'axios';
const api = axios.create({
  baseURL: 'http://10.8.21.172:8080',
  // baseURL:"http://172.20.10.10:8080",
  // headers:{"Content-Type":"application/json;charset=utf-8"}
});

// $axios.interceptors.request.use((config) => {
//     config.headers = config.headers||{}
//     return config
// })
export default api;
