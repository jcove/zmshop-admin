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
         :with-export="true"
         :export-props="exportProps"
         :buttons="buttons"
         :time="time"
  >
  </egrid>
    <el-dialog :visible.sync="dialogVisible" >
      <div id="print">
        <div style="margin-bottom:20px" class="row">
          <div class="delivery-sn">
            发货单号:{{delivery.delivery_sn}}
          </div>
          <div class="date">
            发货时间:{{delivery.created_at}}
          </div>

        </div>
        <div class="row" style="margin-bottom:20px">
          <div class="delivery-sn">
            物流公司:{{delivery.express_name}}
          </div>
          <div class="date">
            物流单号:{{delivery.express_sn}}
          </div>

        </div>
        <div class="row">
          <div class="delivery-sn">
            收货人:{{delivery.consignee}}
          </div>
          <div class="date">
            电话 :{{delivery.phone}}
          </div>
        </div>
        <div class="row">
            地址:{{delivery.country}}{{delivery.province}}{{delivery.city}}{{delivery.district}}{{delivery.town}}{{delivery.address}}
        </div>
        <el-table
          :data="delivery.delivery_goods"
          style="width: 100%">
          <el-table-column
            prop="goods_name"
            label="商品"
            width="180">
          </el-table-column>
          <el-table-column
            prop="num"
            label="数量"
            width="180">
          </el-table-column>
          <el-table-column
            prop="price"
            label="价格">
          </el-table-column>
          <el-table-column
            prop="goods_spec_item_name"
            label="规格">
          </el-table-column>
        </el-table>
      </div>

      <el-button v-print="'#print'">
        打印
      </el-button>
    </el-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import api from '@/api/api'
  import Print from 'vue-print-nb'
  Vue.use(Print)
  export default {
    name: 'index',
    data() {
      const that = this
      return {
        api: api,
        time: 0,
        delivery: '',
        exportProps: {
          fileName: '发货单',
          columns: ['id', 'delivery_sn', 'consignee', 'phone', 'country', 'province', 'city', 'district', 'address', 'delivery_goods'],
          header: ['Id', '订单号', '收货人', '联系电话', '国家', '省份', '城市', '区县', '详细地址', '商品'],
          merge: 'delivery_goods',
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
          name: '',
          logo: '',
          sort: '',
          description: ''
        },
        columns: [
          { label: 'ID', prop: 'id', align: 'center', disabled: true, formType: 'input', sortable: true },
          { label: '发货单编号', prop: 'delivery_sn', align: 'center' },
          { label: '收货人', prop: 'consignee', align: 'center' },
          { label: '联系电话', prop: 'phone', align: 'center', display: 'none' },
          { label: '收货地址', prop: 'address', align: 'center', display: 'none' }
        ],
        filters: [
          {
            name: 'phone',
            type: 'input',
            mobile: '',
            size: 'medium',
            width: '120px',
            placeholder: '手机号'
          },
          {
            name: 'delivery_sn',
            type: 'input',
            q: '',
            size: 'medium',
            width: '120px',
            placeholder: '发货单号'
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
          }
        },
        path: 'delivery',
        withDetail: false,
        models: [],
        dialogVisible: false,
        tableData: [],
        editHandler: function(index, row) {
          that.dialogVisible = true
          that.setForm(row)
        },
        buttons: [
          {
            label: '查看',
            handle(index, row) {
              that.dialogVisible = true
              that.delivery = row
            }
          }
        ]
      }
    },
    methods: {
      setForm(form) {
        if (form == null) {
          this.form = {
            id: 0,
            name: '',
            logo: '',
            sort: '',
            description: ''
          }
          this.imageUrl = ''
        } else {
          const keys = Object.keys(this.form)
          const that = this
          keys.forEach(function(key) {
            that.form[key] = form[key]
          })
          this.imageUrl = form.logo
        }
      },
      printContent(e) {
        const subOutputRankPrint = document.getElementById('print')
        console.log(subOutputRankPrint.innerHTML)
        const newContent = subOutputRankPrint.innerHTML
        const oldContent = document.body.innerHTML
        document.body.innerHTML = newContent
        window.print()
        // window.location.reload()
        document.body.innerHTML = oldContent
        return false
      }
    }
  }
</script>

<style scoped lang="scss">
  .row{
    overflow: hidden;
    .delivery-sn{
      width: 300px;
      float: left;
    }
    .date{
      width: 200px;
      float: left;
    }
  }
</style>
