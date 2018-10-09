<template>
  <div class="order-detail">
    <div class="order-info">
      <div class="detail-row">
        <div class="order-sn" >
          订单号:{{order.order_sn}}
        </div>
        <div class="create-time">
          下单时间:{{order.created_at}}
        </div>
        <div class="shipping-fee">
          配送费:{{order.shipping_fee}}
        </div>


      </div>
      <div class="detail-row">
        <div class="order-status">
          订单状态:{{orderStatusText}}
        </div>
      </div>
      <div class="detail-row">
        <div class="order-sn">
          付款状态:{{payStatusText}}
        </div>
        <div class="create-time" v-if="order.pay_status > 0">
          付款时间:{{order.pay_time}}
        </div>
      </div>
      <div class="detail-row">
        <div class="order-sn">
          发货状态:{{shippingText}}
        </div>
        <div class="create-time" v-if="order.shipping_status > 0">
          发货时间:{{order.shipping_time}}
        </div>
      </div>
      <div class="detail-row">
        <div class="consignee">
          收货人:{{order.consignee}}
        </div>
        <div class="phone">
          电话 :{{order.phone}}
        </div>
        <div class="address">
          地址:{{order.country}}{{order.province}}{{order.city}}{{order.district}}{{order.town}}{{order.address}}
        </div>
      </div>
    </div>
    <div class="goods-list">
      <div class="title detail-row">
        <div class="goods-name">
          商品
        </div>
        <div class="goods-price">
          单价
        </div>
        <div class="goods-num">
          数量
        </div>
        <div class="goods-spec">
          规格
        </div>
        <div class="amount">
          小计
        </div>

      </div>
      <div class="detail-row" v-for="goods in order.order_goods" :key="goods.id" v-if="goods.country === country">
        <div class="goods-name">
          <img :src="goods.cover" style="width: 100px;display: block;float: left">
          <p style="float: left">{{goods.goods_name}}({{goods.country_name}})
          <span style="color: #3a8ee6" v-if="goods.is_shipping > 0">
            (已发货)
          </span></p>
        </div>
        <div class="goods-price">
          {{goods.final_price}}
        </div>
        <div class="goods-num">
          {{goods.num}}
        </div>
        <div class="goods-spec">
          {{goods.goods_spec_item_name}}
        </div>
        <div class="amount">
          {{goods.final_price * goods.num}}
        </div>
      </div>
    </div>

    <div class="detail-row">
      <el-button type="primary" style="margin-right: 30px" @click="pay" :disabled="!canPay">
        付款
      </el-button>
      <el-button type="success" style="margin-right: 30px" @click="showDeliveryDialog" :disabled="!canDelivery">
        发货
      </el-button>
      <el-button type="info" style="margin-right: 30px" @click="showExpressDialog">
        物流信息
      </el-button>
      <el-button type="danger" style="margin-right: 30px" @click="cancel" :disabled="!canCancel">
        取消
      </el-button>

    </div>

    <el-dialog :visible.sync="deliveryDialogVisible">
      <el-form>
        <el-form-item label="发货商品" label-width="180px">
          <el-transfer v-model="deliveryForm.goods" :data="orderGoods" :titles="['可选','已选']" filterable></el-transfer>
        </el-form-item>
        <el-form-item :label="$t('order.express_name')" label-width="180px">
          <el-select v-model="deliveryForm.express_code">
            <el-option v-for="express in expresses"
                       :key="express.express_code"
                       :label="express.name"
                       :value="express.express_code">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('order.express_sn')" label-width="180px">
          <el-input v-model="deliveryForm.express_sn"></el-input>
        </el-form-item>
        <el-form-item label-width="180px">
          <el-button @click="delivery" type="primary">{{$t('operate.delivery')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="expressDialogVisible">
      <div class="">
        <div class="data">
          <ul>
            <li v-for="item in expressData">
              <span class="time">{{item.time}}</span>
              <span class="context">{{item.context}}</span>
            </li>
          </ul>
        </div>
        <div class="express-info">
          <span>{{$t('order.express_sn')}}:{{order.express_sn}}</span>
          <span>{{$t('order.express_name')}}:{{order.express_name}}</span>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import orderApi from '@/api/order'
  import expressApi from '@/api/express'
  import deliveryApi from '@/api/delivery'
  import countryApi from '@/api/country'
  import store from '@/store'
  export default {
    name: 'detail',
    data() {
      return {
        order: '',
        depots: [],
        orderGoods: [],
        deliveryDialogVisible: false,
        expressDialogVisible: false,
        payDialogVisible: false,
        expresses: [],
        expressData: [],
        deliveryForm: {
          id: 0,
          express_code: '',
          express_sn: '',
          goods: []
        },
        canPay: true,
        canDelivery: true,
        canCancel: true,
        country: parseInt(store.getters.country)
      }
    },
    created() {
      this.getOrder()
      this.getDepot()
    },
    watch: {
      '$route'(to, from) {
        this.getOrder()
      }
    },
    methods: {
      getOrder() {
        const id = this.$route.params.id
        const that = this
        orderApi.get(id).then(response => {
          if (response) {
            that.order = response.data
            switch (that.order.order_status) {
              case -1:
                that.canCancel = false
                that.canDelivery = false
                that.canPay = false
                break
              case 0:
                that.canDelivery = false
                that.canPay = true
                that.canCancel = true
                break
              case 2:
                that.canPay = false
                that.canCancel = false
                that.canDelivery = true
                break
              case 4:
                that.canPay = false
                that.canCancel = false
                that.canDelivery = that.order.shipping_status === 1
                break
              case 6:
                that.canPay = false
                that.canCancel = false
                that.canDelivery = false
                break
              case 8:
                that.canPay = false
                that.canCancel = false
                that.canDelivery = false
                break
              case 10:
                that.canPay = false
                that.canCancel = false
                that.canDelivery = false
                break
            }
            that.setDepotText()
          }
        })
      },
      showDeliveryDialog() {
        this.deliveryDialogVisible = true
        this.deliveryForm.id = this.order.id
        this.getExpresses()
        this.setGoods()
      },
      showExpressDialog() {
        this.expressDialogVisible = true
        this.getExpress()
      },
      getDepot() {
        countryApi.list({ all: 1 }).then(response => {
          if (response) {
            this.depots = response.data
          }
        })
      },
      setDepotText() {
        const that = this
        setTimeout(function() {
          that.depots.forEach(function(item) {
            that.order.order_goods.forEach(function(goods, index) {
              if (item.id === goods.country) {
                that.$set(that.order.order_goods[index], 'country_name', item.name)
              }
            })
          })
        }, 1000)
      },
      getExpresses() {
        const that = this
        expressApi.list({ all: 1 }).then(response => {
          if (response) {
            that.expresses = response.data
          }
        })
      },
      getExpress() {
        const that = this
        this.loading = true
        expressApi.query({ com: this.order.express_code, post_id: this.order.express_sn }).then(response => {
          if (response) {
            that.expressData = response.data
          }
          that.loading = false
        })
      },
      setGoods() {
        var array = []
        const that = this
        this.order.order_goods.forEach(function(item) {
          if (item.country === that.country) {
            const a = { key: item.goods_id, label: item.goods_name, disabled: item.is_shipping > 0 }
            array.push(a)
          }
        })
        this.orderGoods = array
      },
      delivery() {
        const that = this
        deliveryApi.delivery(this.deliveryForm).then(response => {
          if (response) {
            that.$message({
              message: that.$t('common.save_success'),
              type: 'success'
            })
            that.deliveryDialogVisible = false
            that.reload()
            that.deliveryForm = {
              express_code: '',
              express_sn: ''
            }
            that.canDelivery = false
          }
        })
      },
      pay() {
        const that = this
        this.$confirm('此操作将修改订单为已支付, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          orderApi.pay(this.order.id).then(response => {
            if (response) {
              that.$message({
                type: 'success',
                message: '操作成功!'
              })
              that.reload()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
      cancel() {
        const that = this
        this.$confirm('此操作将取消订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          orderApi.cancel(this.order.id).then(response => {
            if (response) {
              that.$message({
                type: 'success',
                message: '操作成功!'
              })
              that.reload()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
      reload() {
        this.getOrder()
      }
    },
    computed: {
      orderStatusText() {
        var status = ''
        switch (this.order.order_status) {
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
            status = '待收货'
            break
          case 6:
            status = '待评价'
            break
          case 8:
            status = ''
            break
          default:
            status = ''
        }
        return status
      },
      shippingText() {
        var status = ''
        switch (this.order.shipping_status) {
          case 0:
            status = '未发货'
            break
          case 1:
            status = '部分发货'
            break
          case 2:
            status = '已发货'
            break
          default:
            status = ''
        }
        return status
      },
      payStatusText() {
        var status = ''
        switch (this.order.pay_status) {
          case 0:
            status = '未付款'
            break
          case 1:
            status = '已付款'
            break
          default:
            status = ''
        }
        return status
      }
    }
  }
</script>

<style scoped lang="scss">
  .order-detail{
    padding: 20px;
    .order-info,.goods-list{
      border:1px solid #ccc;
      border-radius: 5px;
      padding-bottom: 20px;
      margin-top: 20px;
    }
    .goods-list{
      .title{
        background-color: #e8e8e8;
        padding: 10px;
      }
    }
    .detail-row{
      padding: 15px;
      overflow: hidden;
      .order-sn,.consignee,.create-time,.address,.shipping-fee,.phone,.goods-name,.goods-price,.goods-num,.goods-spec,.amount,order-status{
        float: left;
      }
      .order-sn{
        width: 400px;
      }
      .order-status{
        width: 200px;
      }
      .create-time{
        width: 300px;
      }
      .shipping-fee{
        width: 100px;
      }
      .consignee{
        width: 200px;
      }
      .phone{
        width: 200px;
      }
      .goods-name{
        width: 400px;
      }
      .goods-price{
        width: 100px;
      }
      .goods-num{
        width: 100px;
      }
      .goods-spec{
        width: 200px;
        min-height: 20px;
      }
      .goods-amount{
        width: 100px;
      }
    }
  }
  .data{
    background-color: #f3f3f3;
    border-radius:5px;
    padding:15px  20px;
    ul{
      li{
        line-height: 2;
        padding:10px;
        .time{
          display: inline-block;
          width: 200px;
        }
      }
    }
  }
  .express-info{
    padding: 15px 20px;
    span{
      display: inline-block;
      width: 300px;
    }
  }
</style>
