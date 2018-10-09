import api from '@/api/api'
api.setPath('case')
const caseApi = {
  list: Function,
  save: Function,
  api: api
}
caseApi.list = function(query) {
  api.setPath('case')
  return api.list(query)
}
caseApi.get = function(id) {
  api.setPath('case')
  return api.get(id)
}
caseApi.getByPosition = function(position) {
  api.setPath('case')
  return api.get(position)
}
caseApi.save = function(query) {
  api.setPath('case')
  return api.save(query)
}
caseApi.search = function(query) {
  api.setPath('case')
  return api.search(query)
}
export default caseApi
