import { clearToken } from '@/utils/auth';
import axios, { type AxiosRequestConfig, type AxiosError, type AxiosResponse } from 'axios';
import type { ApiResponse } from './types';

const instance = axios.create({
  baseURL: 'http://192.168.186.54:8081',
  timeout: 5000,
})

instance.defaults.headers.post['Content-Type'] = 'application/json';
instance.interceptors.request.use(config => {
  const token = window.localStorage.getItem('token');
  if (token) {
    (config.headers)!.Authorization = token;
  }
  return config;
}, err => {
  console.log("请求拦截=>", err);
  return err;
})


// 创建 request() 自定义响应拦截
// 设置泛型 T ,用于定义内容 message 数据类型
export const request = async <T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const res: AxiosResponse<ApiResponse<T>> = await instance(config)
    console.log('完整响应信息=>', res);
    return res.data
  } catch (err) {
    console.log("响应报错=>", (err as AxiosError).response)
    if ((err as AxiosError).response?.status === 401) clearToken();
    throw err;
  }
}