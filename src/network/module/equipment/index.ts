import { request } from '../../request';

export function selectEquipment(params:any,data: any) {
    return request({
        url: `/equipment/selectEquipment`,
        method: 'post',
        params,
        data
    })
}

export function getInfo(params: { eId: string}) {
    return request({
        url: `/equipment/getInfo`,
        method: 'get',
        params
    })
}

export function insertEquipment(data: any) {
    return request({
        url: `/equipment/insertEquipment`,
        method: 'post',
        data
    })
}

export function deleteEquipment(params: { eId: any }) {
    return request({
        url: `/equipment/deleteEquipment`,
        method: 'delete',
        params
    })
}

export function updateEquipment(data: any) {
    return request({
        url: `/equipment/updateEquipment`,
        method: 'put',
        data
    })
}

export function getInfoIsHire(params: { eId: string }) {
    return request({
        url: `/hire/getInfoIsHire`,
        method: 'get',
        params
    })
}