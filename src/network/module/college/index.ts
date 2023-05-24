import { request } from '../../request';

export function queryColleges() {
    return request({
        url: `/college/queryColleges`,
        method: 'get',
    })
}