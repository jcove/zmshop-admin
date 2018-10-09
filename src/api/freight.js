import api from '@/api/api'
api.setPath('freight')
const freightApi = {
  list: Function,
  save: Function,
  api: api
}
freightApi.list = function(query) {
  api.setPath('freight')
  return api.list(query)
}
freightApi.get = function(id) {
  api.setPath('freight')
  return api.get(id)
}
freightApi.getByPosition = function(position) {
  api.setPath('freight')
  return api.get(position)
}
freightApi.save = function(query) {
  api.setPath('freight')
  return api.save(query)
}
freightApi.search = function(query) {
  api.setPath('freight')
  return api.search(query)
}
export default freightApi
