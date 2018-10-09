import api from '@/api/api'
api.setPath('country')
const countryApi = {
  list: Function,
  save: Function,
  api: api,
  children: Function
}
countryApi.list = function(query) {
  api.setPath('country')
  return api.list(query)
}
countryApi.get = function(id) {
  api.setPath('bran')
  return api.get(id)
}
countryApi.save = function(query) {
  api.setPath('country')
  return api.save(query)
}
countryApi.children = function(query) {

}
export default countryApi
