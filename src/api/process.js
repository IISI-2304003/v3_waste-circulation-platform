import request from './index'

export function getProcessList(announcementCategoryId) {
  return request({
    url: '/process',
    method: 'get',
    params:{
        announcementCategoryId
    }
  })
}