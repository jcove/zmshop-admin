import api from '@/api/api'
const articleCategoryApi = {
  list: Function,
  children: Function,
  tree: Function,
  path: 'articleCategory'
}
articleCategoryApi.list = function(query) {
  api.setPath('articleCategory')
  return api.list(query)
}
articleCategoryApi.get = function(id) {
  api.setPath(articleCategoryApi.path)
  return api.get(id)
}
articleCategoryApi.children = function(id) {
  api.setPath(articleCategoryApi.path + '/' + 'children')
  return api.get(id)
}
articleCategoryApi.tree = function() {
  api.setPath(articleCategoryApi.path + '/' + 'tree')
  return api.get(null)
}
articleCategoryApi.save = function(query) {
  api.setPath(articleCategoryApi.path)
  return api.save(query)
}
articleCategoryApi.delete = function(id) {
  api.setPath(articleCategoryApi.path)
  return api.del(id)
}
export default articleCategoryApi
