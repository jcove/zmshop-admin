import api from '@/api/api'
api.setPath('ad')
const adApi = {
  list: Function,
  save: Function,
  api: api
}
adApi.list = function(query) {
  api.setPath('ad')
  return api.list(query)
}
adApi.get = function(id) {
  api.setPath('ad')
  return api.get(id)
}
adApi.getByPosition = function(position) {
  api.setPath('ad')
  return api.get(position)
}
adApi.save = function(query) {
  api.setPath('ad')
  return api.save(query)
}
adApi.search = function(query) {
  api.setPath('ad')
  return api.search(query)
}
export default adApi
