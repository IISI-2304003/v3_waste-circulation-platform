import request from './index'

export function getProcessList(announcementCategoryCode) {
  return request({
    url: '/process',
    method: 'get',
    params:{
        announcementCategoryCode
    }
  })
}