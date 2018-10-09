import api from '@/api/api'
api.setPath('express')
const expressApi = {
  list: Function,
  save: Function,
  api: api
}
expressApi.list = function(query) {
  api.setPath('express')
  return api.list(query)
}
expressApi.query = function(query) {
  api.setPath('express/query')
  return api.list(query)
}
expressApi.get = function(id) {
  api.setPath('express')
  return api.get(id)
}

expressApi.save = function(query) {
  api.setPath('express')
  return api.save(query)
}

export default expressApi
