import { request } from '../../request';

export function searchDefaulter(params: any, data: any) {
    return request({
        url: `/defaulter/search`,
        method: 'post',
        params,
        data
    })
}

export function getInfo(params: { dId: string }) {
    return request({
        url: `/defaulter/getInfo`,
        method: 'get',
        params
    })
}

export function insert(data: any) {
    return request({
        url: `/defaulter/insert`,
        method: 'post',
        data
    })
}

export function deleteDefaulter (params: { dId: any }) {
    return request({
        url: `/defaulter/delete`,
        method: 'delete',
        params
    })
}

export function update(data: any) {
    return request({
        url: `/defaulter/update`,
        method: 'put',
        data
    })
}

export function getInfoIsDefaulter(params: { uId: string }) {
    return request({
        url: `/defaulter/getInfoIsDefaulter`,
        method: 'get',
        params
    })
}