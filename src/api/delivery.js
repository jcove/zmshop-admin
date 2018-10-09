import api from '@/api/api'
api.setPath('delivery')
const deliveryApi = {
  list: Function,
  delivery: Function,
  api: api
}
deliveryApi.list = function(query) {
  api.setPath('delivery')
  return api.list(query)
}
deliveryApi.get = function(id) {
  api.setPath('delivery')
  return api.get(id)
}

deliveryApi.delivery = function(query) {
  api.setPath('delivery/delivery/' + query.id)
  return api.post(query)
}

export default deliveryApi
