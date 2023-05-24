import { request } from '../../request';

export function getInforParticipants(params: { pId: string }) {
  return request({
    url: `/participants/getInforParticipants`,
    method: 'get',
    params
  })
}

export function getListBygId(params: { gId: string }) {
  return request({
    url: `/participants/getListBygId`,
    method: 'get',
    params
  })
}

export function insertParticipants(data: any) {
  return request({
    url: `/participants/insertParticipants`,
    method: 'post',
    data
  })
}

export function deleteParticipants(params: { pId: any }) {
  return request({
    url: `/participants/deleteParticipants`,
    method: 'delete',
    params
  })
}

export function updateParticipants(data: any) {
  return request({
    url: `/participants/updateParticipants`,
    method: 'post',
    data
  })
}
export function getIsParticipants() {
  return request({
    url: `/participants/getIsParticipants`,
    method: 'get',
  })
}
