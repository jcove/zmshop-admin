import api from '@/api/api'
api.setPath('goodsModel')
const goodsModel = {
  list: Function,
  api: api
}
goodsModel.list = function(query) {
  api.setPath('goodsModel')
  return api.list(query)
}
goodsModel.get = function(id) {
  api.setPath('goodsModel')
  return api.get(id)
}
export default goodsModel
