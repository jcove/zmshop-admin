import api from '@/api/api'
api.setPath('admin')
const adminApi = {
  list: Function,
  save: Function,
  api: api
}
adminApi.list = function(query) {
  api.setPath('admin')
  return api.list(query)
}
adminApi.get = function(id) {
  api.setPath('admin')
  return api.get(id)
}
adminApi.getByPosition = function(position) {
  api.setPath('admin')
  return api.get(position)
}
adminApi.save = function(query) {
  api.setPath('admin')
  return api.save(query)
}
adminApi.search = function(query) {
  api.setPath('admin')
  return api.search(query)
}
export default adminApi
