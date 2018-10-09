import { loginByUsername, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken, getUser, setUser, removeUser, getCountry, setCountry, removeCountry } from '@/utils/auth'

const user = {
  state: {
    user: getUser(),
    status: '',
    code: '',
    admin_token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    userId: 0,
    country: getCountry(),
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_USER: (state, user) => {
      state.user = user
      state.userId = user.id
      state.country = user.country
    },
    SET_TOKEN: (state, token) => {
      state.admin_token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          const data = response
          commit('SET_TOKEN', data.admin_token)
          setToken(data.admin_token)
          setUser(data)
          setCountry(data.country)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_USER', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户角色
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        console.log(state.admin_token)
        getUserInfo(state.admin_token).then(response => {
          const data = response
          if (data && data.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          resolve(response)
        }).catch(error => {
          reject(error)
          console.log(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      removeUser()
      removeCountry()
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    }
  }
}

export default user
