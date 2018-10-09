import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (store.getters.admin_token) {
    config.headers['Admin-Token'] = getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  }
  if (config.method === 'post') {
    config.headers['Content-Type'] = 'application/json; charset=utf-8'
  }
  config.headers['Accept'] = 'application/json'
  config.headers['X-Requested-With'] = 'XMLHttpRequest'
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
    if (response.status !== 200) {
      /** 统一错误处理**/
      Message({
        message: response.message,
        type: 'error',
        duration: 3000
      })
      return Promise.reject('网络请求错误')
    }
    return response.data
  },
  error => {
    if (error.response.status === 422) {
      const keys = Object.keys(error.response.data.errors)
      const errors = error.response.data.errors
      keys.forEach(function(key) {
        Message({
          message: errors[key][0],
          type: 'error',
          duration: 5 * 1000
        })
      })
    } else if (error.response.status === 401) {
      MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload()// 为了重新实例化vue-router对象 避免bug
        })
      })
    } else {
      Message({
        message: error.response.data.message,
        type: 'error',
        duration: 5 * 1000
      })
    }

    return Promise.reject(error)
  })
service.setBaseUrl = function(baseUrl) {
  service.defaults.baseURL = baseUrl
}
export default service
