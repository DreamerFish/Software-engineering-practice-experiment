import { request } from '../../request';

export function getPhone(params: { phone: string}) {
    return request({
        url: `/user/getPhone`,
        method: 'get',
        params
    })
}

export function register(data: any) {
    return request({
        url: `/user/register`,
        method: 'post',
        data
    })
}