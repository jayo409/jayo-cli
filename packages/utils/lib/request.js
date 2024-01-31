import axios from 'axios';

// 创建 axios 实例
const request = axios.create({
  baseURL: '', // 基础 URL，请求地址会自动在这个地址后面拼接
  timeout: 10000, // 请求超时时间
});

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么，例如加入 token
    return config;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response;
  },
  error => {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default request;