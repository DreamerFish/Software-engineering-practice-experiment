import { request } from '../../request';

export function equipment(params: any, data: any) {
    return request({
        url: `/download/equipment`,
        method: 'post',
        params,
        data
    })
}

export function game(params: any, data: any) {
    return request({
        url: `/download/game`,
        method: 'post',
        params,
        data
    })
}
export function hire(params: any, data: any) {
    return request({
        url: `/download/hire`,
        method: 'post',
        params,
        data
    })
}
export function reservation(params: any, data: any) {
    return request({
        url: `/download/reservation`,
        method: 'post',
        params,
        data
    })
}
export function site(params: any, data: any) {
    return request({
        url: `/download/site`,
        method: 'post',
        params,
        data
    })
}
export function user(params: any, data: any) {
    return request({
        url: `/download/user`,
        method: 'post',
        params,
        data
    })
}
export function transaction() {
    return request({
        url: `/download/transaction`,
        method: 'get',
    })
}

