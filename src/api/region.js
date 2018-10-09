import api from '@/api/api'
api.setPath('region')
const regionApi = {
  list: Function,
  save: Function,
  api: api,
  children: Function
}
regionApi.list = function(query) {
  api.setPath('region')
  return api.list(query)
}
regionApi.get = function(id) {
  api.setPath('region')
  return api.get(id)
}
regionApi.save = function(query) {
  api.setPath('region')
  return api.save(query)
}
regionApi.children = function(id) {
  api.setPath('region/children')
  return api.get(id)
}
regionApi.del = function(id) {
  api.setPath('region')
  return api.del(id)
}
export default regionApi
