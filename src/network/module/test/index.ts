import axios from 'axios';

const instance = axios.create({
    baseURL: 'api',
    timeout: 5000,
})

instance.interceptors.request.use((config) => {
    if (config.headers === undefined) return config;
    config.headers['Content-Type'] = 'application/json'
    // 若存在token则带token
    const token = window.localStorage.getItem('token');
    if (token) {
        config.headers.token = token;
    }
    // 放行
    return config;
}, err => {
    console.log("请求拦截错误=>", err);
})

instance.interceptors.response.use((res): any => {
    console.log("响应拦截=>", res.data);
    return res.data;

}, (err: any) => {
    console.log(err.response);
    throw err
})


export function getList() {
    return instance({
        url: `/help`,
        method: 'get'
    })
}