import { request } from '../../request';


export function getAllSites() {
  return request({
    url: `/site/getAllSites`,
    method: 'get',
  })
}


export function querySite(params: any, data: any) {
  return request({
    url: `/site/querySite`,
    method: 'post',
    params,
    data
  })
}
export function getInfoSite(params: { sId: string }) {
  return request({
    url: `/site/getInfoSite`,
    method: 'get',
    params
  })
}
export function deleteSite(params: { sId: string }) {
  return request({
    url: `/site/deleteSite`,
    method: 'delete',
    params,
  })
}
export function insertSite(data: any) {
  return request({
    url: `/site/insertSite`,
    method: 'post',
    data
  })
}
export function updateSite(data: any) {
  return request({
    url: `/site/updateSite`,
    method: 'put',
    data
  })
}

export function getFreeTime(params: { date: string }) {
  return request({
    url: `/reservation/getFreeTime`,
    method: 'get',
    params,
  })
}

export function queryReservation(params: any, data: any) {
  return request({
    url: `/reservation/queryReservation`,
    method: 'post',
    params,
    data
  })
}

export function insertReservation(data: any) {
  return request({
    url: `/reservation/insertReservation`,
    method: 'post',
    data
  })
}
export function deleteReservation(params: { rId: string }) {
  return request({
    url: `/reservation/deleteReservation`,
    method: 'delete',
    params
  })
}
export function getInforReservation(params: { rId: string }) {
  return request({
    url: `/reservation/getInforReservation`,
    method: 'get',
    params
  })
}
export function updateReservation(data: any) {
  return request({
    url: `/reservation/updateReservation`,
    method: 'put',
    data
  })
}
