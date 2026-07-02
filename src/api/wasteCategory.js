import request from './index'

export function getWasteCategoryList() {
  return request({
    url: '/wastecategory',
    method: 'get'
  })
}