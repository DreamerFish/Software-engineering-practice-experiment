import { request } from '../../request';

export function updateNotice(data: { content: string, markdown: string, type:number }) {
    return request({
        url: `/notice/updateNotice`,
        method: 'put',
        data
    })
}

export function selectNotice(type:number) {
    return request({
        url: `/notice/selectNotice?type=${type}`,
        method: 'get',
    })
}