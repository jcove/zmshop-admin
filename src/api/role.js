import api from '@/api/api'
api.setPath('role')
const roleApi = {
  list: Function,
  save: Function,
  api: api
}
roleApi.list = function(query) {
  api.setPath('role')
  return api.list(query)
}
roleApi.get = function(id) {
  api.setPath('role')
  return api.get(id)
}
roleApi.getByPosition = function(position) {
  api.setPath('role')
  return api.get(position)
}
roleApi.save = function(query) {
  api.setPath('role')
  return api.save(query)
}
roleApi.search = function(query) {
  api.setPath('role')
  return api.search(query)
}
export default roleApi
