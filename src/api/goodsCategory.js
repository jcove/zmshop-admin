import api from '@/api/api'
const goodsCategoryApi = {
  list: Function,
  children: Function,
  tree: Function,
  path: 'goodsCategory'
}
goodsCategoryApi.list = function(query) {
  api.setPath('goodsCategory')
  return api.list(query)
}
goodsCategoryApi.get = function(id) {
  api.setPath(goodsCategoryApi.path)
  return api.get(id)
}
goodsCategoryApi.children = function(id) {
  api.setPath(goodsCategoryApi.path + '/' + 'children')
  return api.get(id)
}
goodsCategoryApi.brand = function(id) {
  api.setPath(goodsCategoryApi.path + '/' + 'brand')
  return api.get(id)
}
goodsCategoryApi.tree = function() {
  api.setPath(goodsCategoryApi.path + '/' + 'tree')
  return api.get(null)
}
goodsCategoryApi.save = function(query) {
  api.setPath(goodsCategoryApi.path)
  return api.save(query)
}
goodsCategoryApi.delete = function(id) {
  api.setPath(goodsCategoryApi.path)
  return api.del(id)
}
export default goodsCategoryApi
