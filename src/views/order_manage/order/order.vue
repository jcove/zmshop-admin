<template>
  <div class="app-container">
    <div class="tools">
      <el-button type="primary" @click="handleExport" v-loading="exportLoading">导出</el-button>
    </div>
    <div class="filter" v-if="filters.length > 0">
      筛选
      <template v-for="filter in filters">
        <el-input v-if="filter.type==='input'" v-model="filter[filter.name]" :placeholder="filter.placeholder" :size="filter.size" :style="{ width: filter.width}"></el-input>
        <el-select v-model="filter[filter.name]" :placeholder="filter.placeholder"  v-if="filter.type ==='select'"  :size="filter.size" filterable @change="search">
          <el-option
            v-for="item in filter.options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

      </template>
      <el-button type="primary" @click="search" >{{ $t('common.search')}}</el-button>
    </div>
    <el-table class="egrid"
              :data="list" ref="grid"
              v-on="$listeners" v-loading="listLoading">
      <template v-for="tp in typesColumns">
        <el-table-column
          v-if="tp.type === 'expand'"
          v-bind="tp.props"
          type="expand"
          :key="tp.type">
          <template slot-scope="props">
            <slot name="expand" v-bind="props"></slot>
          </template>
        </el-table-column>
        <el-table-column v-else
                         :key="tp.type"
                         :type="tp.type"
                         v-bind="tp.props"
                         :sortable="sortable">
        </el-table-column>
      </template>
      <el-table-column v-for="col in renderColumns"
                       :key="col.label" v-bind="getColBind(col)">
        <template slot-scope="scope">
          <component :is="col.component"
                     v-bind="getCptBind(scope, col)"
                     v-on="col.listeners">
          </component>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-if="withEdit"
                     size="mini"
                     @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button v-if="withDelete"
                     size="mini"
                     type="danger"
                     @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <el-button v-if="withDetail"
                     size="mini"
                     @click="handleDetail(scope.$index, scope.row)">查看</el-button>
          <template v-if="buttons.length > 0">
            <el-button v-for="(button,index) in buttons" :key="index"
                       size="mini"
                       @click="button.handle(scope.$index, scope.row)">{{ button.label}}</el-button>
          </template>
        </template>
      </el-table-column>
      <template v-if="slotAppend" slot="append">
        <slot name="append"></slot>
      </template>
    </el-table>
    <el-pagination @current-change="pageChange"
                   @prev-click="prevClick"
                   @next-click="nextClick"
                   @size-change="handleSizeChange"
                   :page-sizes="[10, 20, 50, 100,500,1000]"
                   :total="page.total"
                   :page-size="page.pageSize"
                   background
                   :current-page="query.page"
                   layout="prev, pager, next,sizes,jumper"
    >
    </el-pagination>
  </div>
</template>

<script>
  import Vue from 'vue'
  import api from '@/api/api'
  import { parseTime } from '@/utils'
  import orderApi from '@/api/order'
  import excel from '@/vendor/Export2Excel'
  export default {

    name: 'index',
    data() {
      const that = this
      return {
        api: api,
        list: [],
        exportLoading: false,
        listLoading: false,
        filters: [
          {
            name: 'phone',
            type: 'input',
            phone: '',
            size: 'medium',
            width: '120px',
            placeholder: '手机号'
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
          }
        ],
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        imageUrl: '',
        exportProps: {
          fileName: '订单',
          columns: ['id', 'order_sn', 'consignee'],
          header: ['Id', '订单号', '收货人']
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
              that.$router.push({ name: 'order_detail', params: { id: row.id }})
            }
          }
        ]
      }
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
      setForm() {
        this.form = {
          id: 0,
          express_code: '',
          express_sn: ''
        }
      },
      getList() {
        const that = this
        orderApi.list(this.query).then(response => {
          that.list = response.data
          that.page.total = response.total
          that.pages = response.per_page
          that.listLoading = false
        })
      },
      handleExport() {
        // this.loading = true
        const tHeader = this.exportProps.header
        const filterVal = this.exportProps.columns
        const list = this.list
        const data = this.formatJson(filterVal, list)
        const date = new Date()
        excel({
          header: tHeader,
          data: data,
          filename: this.exportProps.fileName + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds(),
          autoWidth: true
        })
        this.exportLoading = false
      },
      search() {
        const { filters } = this
        for (const filter of filters) {
          this.$set(this.query, filter.name, filter[filter.name])
        }
        this.getList()
      }
    }
  }
</script>

<style scoped>

</style>
