<template>
  <div>
    <egrid border
           column-type="selection"
           :path="path"
           :withForm="true"
           :columns="columns"
           :columns-schema="columnsSchema"
           :with-detail="false"
           :with-edit="false"
           :with-add="false"
           :delete-handler="deleteHandler"
           :filters="filters"
           :params="params"
           :time="time"
           >
    </egrid>
  </div>
</template>

<script>
  import Vue from 'vue'
  import promotionApi from '@/api/promotion'
  export default {
    name: 'product',
    data() {
      const that = this
      return {
        path: 'promotion/query',
        promotion_id: 0,
        time: 0,
        params: {
          promotion_id: 0
        },
        columns: [
          { label: 'ID', prop: 'id', align: 'center', disabled: true, formType: 'input', sortable: true },
          { label: '商品名称', prop: 'product_name', align: 'center' },
          { label: '促销类型', prop: 'type', align: 'center' },
          { label: '开始时间', prop: 'start_time', align: 'center' },
          { label: '结束时间', prop: 'end_time', align: 'center' }

        ],
        columnsSchema: {
          '促销类型': {
            width: 'auto',
            propsHandler({ col, row }) {
              var type = ''
              switch (row.type) {
                case 'fullSubtraction':
                  type = '满减'
                  break
              }
              return { type: type }
            },
            component: Vue.extend({
              props: ['type'],
              render(h) {
                return h('span', {}, this.type)
              }
            })
          }
        },
        filters: [
          {
            name: 'promotion_id',
            type: 'select',
            promotion_id: '',
            size: 'medium',
            width: '160px',
            placeholder: '促销活动关键词',
            loading: false,
            attrs: {
              remoteMethod: function(q) {
                if (q !== '') {
                  that.filters[0].loading = true
                  promotionApi.search({ q: q }).then(response => {
                    if (response) {
                      var array = []
                      response.data.forEach(function(item) {
                        const option = { label: item.name, value: item.id }
                        array.push(option)
                      })
                      that.filters[0].options = array
                    }
                  })
                } else {
                  that.filters[0].options = []
                }
              },
              remote: true,
              clearable: true
            },
            options: []
          }
        ]
      }
    },
    created() {
      const id = this.$route.params.id
      this.id = id !== undefined && id !== ':id' ? id : 0
      this.filters[0].promotion_id = parseInt(this.id)
      if (id > 0) {
        this.params.promotion_id = parseInt(this.id)
        this.getPromotion()
      }
    },
    watch: {
      '$route'(to, from) {
        const id = to.params.id
        this.id = id !== undefined && id !== ':id' ? id : 0
        this.filters[0].promotion_id = parseInt(this.id)
        if (id > 0) {
          this.params.promotion_id = parseInt(this.id)
          this.getPromotion()
        }
      }
    },
    methods: {
      getPromotion() {
        promotionApi.get(this.id).then(response => {
          if (response) {
            const option = { label: response.data.name, value: response.data.id }
            this.filters[0].options = [option]
          }
        })
      },
      deleteHandler(index, row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          promotionApi.deleteProduct(row.id).then(response => {
            if (response) {
              this.time = (new Date()).getTime()
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 1500
              })
            }
          })
        }).catch((e) => {
          console.log(e)
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
