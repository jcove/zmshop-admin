import api from '@/api/api'
api.setPath('order')
const orderApi = {
  list: Function,
  save: Function,
  api: api
}
orderApi.list = function(query) {
  api.setPath('order')
  return api.list(query)
}
orderApi.get = function(id) {
  api.setPath('order')
  return api.get(id)
}
orderApi.getByPosition = function(position) {
  api.setPath('order')
  return api.get(position)
}
orderApi.save = function(query) {
  api.setPath('order')
  return api.save(query)
}
orderApi.search = function(query) {
  api.setPath('order')
  return api.search(query)
}
orderApi.pay = function(id) {
  api.setPath('order/pay/' + id)
  return api.post(null)
}
orderApi.cancel = function(id) {
  api.setPath('order/cancel/' + id)
  return api.post(null)
}
export default orderApi
