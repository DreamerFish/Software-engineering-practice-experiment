import { request } from '../../request';

export function selectHireByMul(params: any, data: any) {
    return request({
        url: `/hire/selectHireByMul`,
        method: 'post',
        params,
        data
    })
}

export function getInfor(params: { hId: string }) {
    return request({
        url: `/hire/getInfor`,
        method: 'get',
        params
    })
}

export function insertHire(data: any) {
    return request({
        url: `/hire/insertHire`,
        method: 'post',
        data
    })
}

export function deleteHire(params: { hId: any }) {
    return request({
        url: `/hire/deleteHire`,
        method: 'delete',
        params
    })
}

export function updateHire(data: any) {
    return request({
        url: `/hire/updateHire`,
        method: 'put',
        data
    })
}