<template>
  <div>
  <egrid border
         column-type="selection"
         :path="path"
         :withForm="false"
         :columns="columns"
         :with-detail="withDetail"
         :with-edit="false"
         :with-delete="false"
         :filters="filters"
         :columns-schema="columnsSchema"
         :with-add="false"
         :withExport="true"
         :export-props="exportProps"
         :buttons="buttons"
         :time="time"
         :export-handler="exportHandler"
  >
  </egrid>
  </div>
</template>

<script>
  import Vue from 'vue'
  import api from '@/api/api'
  import countryApi from '@/api/country'
  import { parseTime } from '@/utils'
  import regionApi from '@/api/region'
  import { getToken } from '@/utils/auth'
  export default {

    name: 'order-index',
    data() {
      const that = this
      return {
        api: api,
        time: 0,
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        depots: [],
        imageUrl: '',
        exportProps: {
          fileName: '订单',
          columns: ['id', 'order_sn', 'consignee', 'phone', 'country', 'province', 'city', 'district', 'address', 'order_goods'],
          header: ['Id', '订单号', '收货人', '联系电话', '国家', '省份', '城市', '区县', '详细地址', '商品'],
          merge: 'order_goods',
          mergeFunc: function(rows) {
            var str = ''
            rows.forEach(function(item) {
              str += item.goods_name
              str += ' '
              str += item.num
              str += '\r\n'
            })
            console.log(str)
            return str
          }
        },
        form: {
          id: 0,
          express_code: '',
          express_sn: ''
        },
        order: '',
        expresses: [],
        columns: [
          { label: 'ID', prop: 'id', align: 'center', disabled: true, formType: 'input', sortable: true },
          { label: '订单编号', prop: 'order_sn', align: 'center' },
          { label: '订单状态', prop: 'order_status', align: 'center' },
          { label: '收货人', prop: 'consignee', align: 'center' },
          { label: '联系电话', prop: 'phone', align: 'center', display: 'none' },
          { label: '收货地址', prop: 'address', align: 'center', display: 'none' },
          { label: '商品金额', prop: 'goods_amount', align: 'center', display: 'none', options: that.models, formType: 'input' }
        ],
        filters: [
          {
            name: 'phone',
            type: 'input',
            phone: '',
            size: 'medium',
            width: '120px',
            placeholder: '联系电话'
          },
          {
            name: 'order_sn',
            type: 'input',
            order_sn: '',
            size: 'medium',
            width: '180px',
            placeholder: '订单号'
          },
          {
            name: 'consignee',
            type: 'input',
            consignee: '',
            size: 'medium',
            width: '120px',
            placeholder: '收货人'
          },
          {
            name: 'order_status',
            type: 'select',
            order_status: '',
            size: 'medium',
            width: '120px',
            placeholder: '订单状态',
            options: [
              {
                label: '全部',
                value: ''
              },
              {
                label: '已取消',
                value: -1
              },
              {
                label: '待付款',
                value: 0
              },
              {
                label: '待发货',
                value: 2
              },
              {
                label: '待确认',
                value: 4
              },
              {
                label: '待评价',
                value: 6
              },
              {
                label: '已完成',
                value: 8
              }
            ]
          },
          {
            name: 'depot',
            type: 'select',
            consignee: '',
            size: 'medium',
            width: '120px',
            depot: '',
            placeholder: '发货地',
            options: [],
            attrs: {
              clearable: true
            }
          },
          {
            name: 'country',
            type: 'select',
            consignee: '',
            size: 'medium',
            width: '80px',
            placeholder: '国家',
            options: [],
            onChange: function(id) {
              regionApi.children(id).then(response => {
                if (response) {
                  var array = [{ label: '全部', value: '' }]
                  response.data.forEach(function(item) {
                    const option = { label: item.name, value: item.name }
                    array.push(option)
                  })
                  that.filters[5].options = array
                }
              })
            }
          },
          {
            name: 'province',
            type: 'select',
            consignee: '',
            size: 'medium',
            width: '80px',
            placeholder: '省份',
            options: [],
            onChange: function(id) {
              regionApi.children(id).then(response => {
                if (response) {
                  var array = [{ label: '全部', value: '' }]
                  response.data.forEach(function(item) {
                    const option = { label: item.name, value: item.name }
                    array.push(option)
                  })
                  that.filters[6].options = array
                }
              })
            }
          },
          {
            name: 'city',
            type: 'select',
            consignee: '',
            size: 'medium',
            width: '80px',
            placeholder: '城市',
            options: [],
            onChange: function(id) {
              regionApi.children(id).then(response => {
                if (response) {
                  var array = [{ label: '全部', value: '' }]
                  response.data.forEach(function(item) {
                    const option = { label: item.name, value: item.name }
                    array.push(option)
                  })
                  that.filters[7].options = array
                }
              })
            }
          },
          {
            name: 'district',
            type: 'select',
            consignee: '',
            size: 'medium',
            width: '120px',
            placeholder: '区县',
            options: []
          }
        ],
        columnsSchema: {
          '收货地址': {
            width: 'auto',
            propsHandler({ col, row }) {
              return { address: row.country + row.province + row.city + row.district + row.address }
            },
            component: Vue.extend({
              props: ['address'],
              render(h) {
                return h('span', {}, this.address)
              }
            })
          },
          '订单状态': {
            width: 'auto',
            propsHandler({ col, row }) {
              var status = ''
              switch (row.order_status) {
                case -1:
                  status = '已取消'
                  break
                case 0:
                  status = '待付款'
                  break
                case 2:
                  status = '待发货'
                  break
                case 4:
                  status = '待确认'
                  break
                case 6:
                  status = '待评价'
                  break
                case 8:
                  status = '已完成'
                  break
                default:
                  status = ''
              }
              return { order_status: status }
            },
            component: Vue.extend({
              props: ['order_status'],
              render(h) {
                return h('span', {}, this.order_status)
              }
            })
          }
        },
        path: 'order',
        withDetail: false,
        models: [],
        dialogVisible: false,
        tableData: [],
        buttons: [
          {
            label: '查看',
            handle(index, row) {
              that.$router.push({ name: 'order-detail', params: { id: row.id }})
            }
          },
          {
            label: '病例',
            handle: function(index, row) {
              that.$router.push({ name: 'case', params: { id: row.user_id }})
            }
          }
        ]
      }
    },
    created() {
      this.getCountries()
      this.getDepot()
    },
    methods: {
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      getCountries() {
        const that = this
        countryApi.list({ all: 1 }).then(response => {
          if (response) {
            var array = []
            response.data.forEach(function(item) {
              const option = { label: item.name, value: item.name }
              array.push(option)
            })
            that.filters[4].options = array
          }
        })
      },
      getDepot() {
        countryApi.list({ all: 1 }).then(response => {
          if (response) {
            this.depots = response.data
            var array = []
            const that = this
            response.data.forEach(function(item) {
              const option = { label: item.name, value: item.id }
              array.push(option)
            })
            that.filters[4].options = array
          }
        })
      },
      exportHandler(data) {
        window.open(api.adminApi + '/order/export?Admin-Token=' + getToken())
      }
    }
  }
</script>

<style scoped>

</style>
