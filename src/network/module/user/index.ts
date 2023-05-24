import { request } from '../../request';

export function updateRoles(params: { roles: string, uid: string }) {
  return request({
    url: `/user/updateRoles`,
    method: 'put',
    params
  })
}

export function inforSreach(params: any, data: any) {
  return request({
    url: `/user/inforSreach`,
    method: 'post',
    params,
    data
  })
}

export function deleteUser(params: any) {
  return request({
    url: `/user/deleteUser`,
    method: 'delete',
    params,
  })
}

export function insertUser(data: any) {
  return request({
    url: `/user/insertUser`,
    method: 'post',
    data
  })
}

export function getInfoByNumber(params: { uNumber: string }) {
  return request({
    url: `/user/getInfoByNumber`,
    method: 'get',
    params
  })
}

export function modifiedPwd(params: any) {
  return request({
    url: `/user/modifiedPwd`,
    method: 'post',
    params
  })
}