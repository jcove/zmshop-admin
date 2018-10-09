import api from '@/api/api'
const articleApi = {
  list: Function,
  save: Function,
  api: api
}
articleApi.list = function(query) {
  api.setPath('article')
  return api.list(query)
}
articleApi.get = function(id) {
  api.setPath('bran')
  return api.get(id)
}
articleApi.save = function(query) {
  api.setPath('article')
  return api.save(query)
}
export default articleApi
