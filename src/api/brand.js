import api from '@/api/api'
api.setPath('goodsModel')
const brandApi = {
  list: Function,
  save: Function,
  api: api
}
brandApi.list = function(query) {
  api.setPath('brand')
  return api.list(query)
}
brandApi.get = function(id) {
  api.setPath('bran')
  return api.get(id)
}
brandApi.save = function(query) {
  api.setPath('brand')
  return api.save(query)
}
export default brandApi
