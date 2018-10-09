import api from '@/api/api'
const goodsApi = {
  list: Function,
  createSpecificationParams: Function,
  get: Function,
  api: api
}
goodsApi.list = function(query) {
  api.setPath('goods')
  return api.list(query)
}
goodsApi.createSpecificationParams = function(query) {
  api.setPath('goods/createSpecificationParams')
  return api.post(query)
}
goodsApi.save = function(query) {
  api.setPath('goods')
  return api.save(query)
}
goodsApi.get = function(id) {
  api.setPath('goods')
  return api.get(id)
}
goodsApi.relations = function(id) {
  api.setPath('goods/relation')
  return api.get(id)
}
export default goodsApi
