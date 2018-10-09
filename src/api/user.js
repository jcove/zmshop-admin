import api from '@/api/api'
api.setPath('user')
const userApi = {
  list: Function,
  save: Function,
  api: api
}
userApi.list = function(query) {
  api.setPath('user')
  return api.list(query)
}
userApi.get = function(id) {
  api.setPath('user')
  return api.get(id)
}
userApi.getByPosition = function(position) {
  api.setPath('user')
  return api.get(position)
}
userApi.save = function(query) {
  api.setPath('user')
  return api.save(query)
}
userApi.search = function(query) {
  api.setPath('user')
  return api.search(query)
}
export default userApi
