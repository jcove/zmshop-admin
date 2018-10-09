import request from '@/utils/request'
request.setBaseUrl(process.env.ADMIN_API)
export function loginByUsername(username, password) {
  const param = {
    username: username,
    password: password
  }
  return request.post('/login',
    param
  )
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function getUserInfo(admin_token) {
  return request({
    url: '/my/role',
    method: 'get',
    params: { 'Admin-Token': admin_token }
  })
}

