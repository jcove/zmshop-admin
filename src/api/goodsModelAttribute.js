import api from '@/api/api'

const goodsModelAttribute = {
  list: Function,
  api: api
}
goodsModelAttribute.list = function(modelId) {
  api.setPath('goodsModelAttribute')
  const query = { model_id: modelId }
  return api.list(query)
}
export default goodsModelAttribute
