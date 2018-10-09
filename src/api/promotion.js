import api from '@/api/api'
api.setPath('ad')
const promotionApi = {
  list: Function,
  save: Function,
  api: api
}
promotionApi.list = function(query) {
  api.setPath('promotion')
  return api.list(query)
}
promotionApi.get = function(id) {
  api.setPath('promotion')
  return api.get(id)
}
promotionApi.getByPosition = function(position) {
  api.setPath('promotion')
  return api.get(position)
}
promotionApi.save = function(query) {
  api.setPath('promotion')
  return api.save(query)
}
promotionApi.search = function(query) {
  api.setPath('promotion')
  return api.search(query)
}
promotionApi.deleteProduct = function(id) {
  api.setPath('promotion/product')
  return api.del(id)
}
promotionApi.query = function(query) {
  api.setPath('promotion/query')
  return api.list(query)
}
promotionApi.register = function(query) {
  api.setPath('promotion/register', query)
  return api.post(query)
}
export default promotionApi
