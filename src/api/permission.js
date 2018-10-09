import api from '@/api/api'
api.setPath('permission')
const permissionApi = {
  list: Function,
  save: Function,
  api: api
}
permissionApi.list = function(query) {
  api.setPath('permission')
  return api.list(query)
}
permissionApi.get = function(id) {
  api.setPath('permission')
  return api.get(id)
}
permissionApi.getByPosition = function(position) {
  api.setPath('permission')
  return api.get(position)
}
permissionApi.save = function(query) {
  api.setPath('permission')
  return api.save(query)
}
permissionApi.search = function(query) {
  api.setPath('permission')
  return api.search(query)
}
export default permissionApi
