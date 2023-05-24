import { request } from '../../request';

export function login(data: { uphone: string, upassword: string }) {
    return request({
        url: `/user/login`,
        method: 'post',
        data
    })
}

export function getInfo() {
    return request({
        url: `/user/getInfo`,
        method: 'get',
    })
}