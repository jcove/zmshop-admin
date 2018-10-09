import api from '@/api/api'
api.setPath('adPosition')
const adPositionApi = {
  list: Function,
  save: Function,
  api: api
}
adPositionApi.list = function(query) {
  api.setPath('adPosition')
  return api.list(query)
}
adPositionApi.get = function(id) {
  api.setPath('adPosition')
  return api.get(id)
}
adPositionApi.getByPosition = function(position) {
  api.setPath('adPosition')
  return api.get(position)
}
adPositionApi.save = function(query) {
  api.setPath('adPosition')
  return api.save(query)
}
adPositionApi.search = function(query) {
  api.setPath('adPosition')
  return api.search(query)
}
export default adPositionApi
