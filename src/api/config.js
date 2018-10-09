import api from '@/api/api'
api.setPath('config')
const configApi = {
  list: Function,
  save: Function,
  api: api
}
configApi.list = function(query) {
  api.setPath('config')
  return api.list(query)
}
configApi.get = function(id) {
  api.setPath('config')
  return api.get(id)
}
configApi.getByPosition = function(position) {
  api.setPath('config')
  return api.get(position)
}
configApi.save = function(query) {
  api.setPath('config')
  return api.save(query)
}
configApi.search = function(query) {
  api.setPath('config')
  return api.search(query)
}
export default configApi
