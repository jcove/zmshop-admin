<template>
  <div>
    <egrid border
           column-type="selection"
           :path="path"
           :withForm="true"
           :columns="columns"
           :with-detail="withDetail"
           :params="params"
           :filters="filters"
           :columns-schema="columnsSchema"
    >
    </egrid>
  </div>
</template>

<script>
  import goodsModelApi from '@/api/goodsModel'
  import Vue from 'vue'
  export default {
    name: 'attribute',
    data() {
      const that = this
      return {
        columns: [
          { label: 'ID', prop: 'id', align: 'center', disabled: true, formType: 'input', sortable: true },
          { label: '名称', prop: 'name', align: 'center' },
          { label: '商品模型', prop: 'model_id', align: 'center', display: 'none', options: that.models, formType: 'select' }
        ],
        filters: [
          {
            name: 'model_id',
            type: 'select',
            model_id: that.model_id,
            options: []
          }
        ],
        columnsSchema: {
          '商品模型': {
            width: 'auto',
            propsHandler({ col, row }) {
              return { model_id: row.name }
            },
            component: Vue.extend({
              props: ['model_id'],
              render(h) {
                return h('span', {
                  style: {
                    width: '100px'
                  }
                }, this.model_id)
              }
            })
          }
        },
        path: 'goodsModelAttribute',
        params: {
          model_id: 0
        },
        withDetail: false,
        models: []
      }
    },
    created() {
      const id = this.$route.params.model_id
      this.params.model_id = id === ':model_id' ? '' : id
      this.getModels()
    },
    methods: {
      getModels() {
        const that = this
        goodsModelApi.list({ all: 1 }).then(response => {
          var array = []
          response.data.forEach(function(item) {
            const e = { label: item.name, value: item.id }
            array.push(e)
          })
          that.columns[2].options = array
          that.filters[0].options = array
        })
      }
    }
  }
</script>

<style scoped>

</style>
