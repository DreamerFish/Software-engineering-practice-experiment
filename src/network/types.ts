// 定义请求返回值内容类型
export interface ApiResponse<T = any> {
    data: T,
    success: boolean,
    code: 20000 | 20001,
    message:string
}