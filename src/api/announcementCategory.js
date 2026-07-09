import request from './index'

export function getAnnouncementCategoryList() {
  return request({
    url: '/announcementcategory',
    method: 'get'
  })
}