import { request } from '../../request';

export function searchGame(params: any, data: any) {
  return request({
    url: `/game/searchGame`,
    method: 'post',
    params,
    data
  })
}

export function getInforGame(params: { gId: string }) {
  return request({
    url: `/game/getInforGame`,
    method: 'get',
    params
  })
}

export function insertGame(data: any) {
  return request({
    url: `/game/insertGame`,
    method: 'post',
    data
  })
}

export function deleteGame(params: { gId: any }) {
  return request({
    url: `/game/deleteGame`,
    method: 'delete',
    params
  })
}

export function updateGame(data: any) {
  return request({
    url: `/game/updateGame`,
    method: 'put',
    data
  })
}



