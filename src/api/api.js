import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseURL = 'https://jsonplaceholder.typicode.com';

// 创建axios实例
const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  async (config) => {
    // 从AsyncStorage获取token
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    // 处理错误
    if (error.response) {
      // 服务器返回了错误状态码
      console.error('API错误:', error.response.status, error.response.data);
      
      // 如果是401未授权，可能是token过期，清除本地token并重定向到登录页
      if (error.response.status === 401) {
        await AsyncStorage.removeItem('token');
        // 这里可以通过事件通知应用跳转到登录页
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('网络错误，无法连接到服务器');
    } else {
      // 请求配置出错
      console.error('请求错误:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api; 