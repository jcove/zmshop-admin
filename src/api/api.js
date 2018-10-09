import request from '@/utils/request'

var api = {
  path: '',
  list: Function,
  search: Function,
  save: Function,
  del: Function,
  post: Function,
  setPath: Function,
  base: process.env.BASE,
  baseApi: process.env.BASE_API,
  fileApi: process.env.FILE_API,
  adminApi: process.env.ADMIN_API,
  cdnHost: process.env.CDN_HOST
}
api.list = function(query) {
  var path = api.path
  if (query && query.id !== undefined && query.id !== null) {
    path += '/' + query.id
  }
  return request.get('/' + path, {
    params: query
  })
}
api.get = function(id, query) {
  var path = api.path
  if (id !== null) {
    path += '/' + id
  }
  const res = request.get('/' + path, {
    params: query
  })
  return res
}
api.search = function(query) {
  return request.get('/' + api.path + '/search', {
    params: query
  })
}
api.save = function(query) {
  var path = api.path
  var params = {}
  const keys = Object.keys(query)
  keys.forEach(function(key) {
    params[key] = query[key]
  })
  if (params.id && parseInt(params.id) !== 0) {
    params._method = 'put'
    path = api.path + '/' + params.id
  } else {
    if (params._method) {
      params._method = undefined
    }
  }
  return request.post('/' + path, params)
}
api.del = function(id) {
  return request.post('/' + api.path + '/' + id, { _method: 'delete' })
}
api.post = function(query) {
  return request.post('/' + api.path, query)
}
api.setPath = function(path) {
  api.path = path
}
api.getFileUrl = function(path) {
  if (path) {
    if (path.indexOf('http') < 0) {
      return api.cdnHost + path
    }
  }
  return path
}
api.download = function(query) {
  return request.get('/' + api.path, {
    params: query
  })
}
export default api
