import api from '@/api/api'

const goodsModelSpecification = {
  list: Function,
  api: api
}

goodsModelSpecification.list = function(modelId) {
  api.setPath('goodsModelSpecification')
  const query = { model_id: modelId }
  return api.list(query)
}
goodsModelSpecification.save = function(query) {
  api.setPath('goodsModelSpecification')
  return api.save(query)
}
export default goodsModelSpecification
