import request from '@/utils/request'
export function list(query) {
  return request.get('/menu/list', {
    params: query
  })
}

export function save(query) {
  const param = new URLSearchParams()
  param.append('id', query.id)
  param.append('name', query.name)
  param.append('duty', query.duty)
  param.append('parent', query.parent)
  return request.post('/menu', param)
}
export function del(query) {
  const param = new URLSearchParams()
  param.append('id', query.id)
  return request.post('/menu/delete', param)
}
