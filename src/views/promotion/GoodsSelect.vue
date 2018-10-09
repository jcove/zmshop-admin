<template>
  <div id="goodsSelect">
    <div class="selections">
      <el-tag
        :key="tag.id"
        v-for="tag in selections"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)">
        {{tag.name}}
      </el-tag>
    </div>
    <div class="filter">
      <template v-for="filter in filters">

        <el-select v-model="filter[filter.name]" :placeholder="filter.placeholder"  v-if="filter.type ==='select'"  :size="filter.size" :style="{ width: filter.width}"  v-bind="filter.attrs" v-on="filter.events">
          <el-option
            v-for="item in filter.options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>


      </template>
    </div>
    <el-table :data="list" @select-all="selectAll" @select="select" ref="multipleTable">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="Id"
        width="120">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="price"
        label="价格"
        width="120">
      </el-table-column>
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
    <el-button @click="submit" type="success" style="margin-left: 200px;margin-top: 20px">确定</el-button>
  </div>
</template>

<script>
  import goodsApi from '@/api/goods'
  import promotionApi from '@/api/promotion'
  import goodsCategoryApi from '@/api/goodsCategory'
  import brandApi from '@/api/brand'
  export default {
    name: 'goods-select',
    data() {
      const that = this
      return {
        list: [],
        page: {
          pageSizes: 10,
          total: 0
        },
        query: {
          page: 1,
          page_size: 10
        },
        category_id: 0,
        selections: [],
        selectionIds: [],
        filters: [
          {
            name: 'category_id',
            type: 'select',
            mobile: '',
            size: 'medium',
            width: '120px',
            placeholder: '一级分类',
            category_id: '',
            options: [],
            attrs: {
              filterable: true
            },
            events: {
              change: function(value) {
                that.getCategories2(value)
                that.getCategories3(value)
              }
            }
          },
          {
            name: 'category_id',
            type: 'select',
            mobile: '',
            size: 'medium',
            width: '120px',
            placeholder: '二级分类',
            category_id: '',
            options: [],
            attrs: {
              filterable: true
            },
            events: {
              change: function(value) {
                that.getCategories3(value)
              }
            }
          },
          {
            name: 'category_id',
            type: 'select',
            mobile: '',
            size: 'medium',
            width: '120px',
            placeholder: '三级分类',
            category_id: '',
            options: [],
            attrs: {
              filterable: true
            },
            events: {
              change: function() {
                that.getGoods()
              }
            }
          },
          {
            name: 'brand_id',
            type: 'select',
            mobile: '',
            size: 'medium',
            width: '120px',
            placeholder: '品牌',
            options: [],
            brand_id: '',
            attrs: {
              filterable: true
            },
            events: {
              change: function() {
                that.getGoods()
              }
            }
          }
        ]
      }
    },
    props: {
      params: {
        type: Object,
        default() {
          return {}
        }
      },
      onSuccess: {
        type: Function,
        default() {
          return {}
        }
      }
    },
    created() {
      this.getGoods()
      this.getPromotionProducts()
      this.getCategories(0)
      console.log('creat')
    },
    watch: {
      params(n, o) {
        this.selections = []
        this.selectionIds = []
        this.getGoods()
        this.getPromotionProducts()
      },
      category_id(n, o) {
        this.getBrands()
      }
    },
    methods: {
      getCategories(id) {
        goodsCategoryApi.children(id !== null ? id : 0).then(response => {
          var array = []
          response.forEach(function(item) {
            const option = { label: item.name, value: item.id }
            array.push(option)
          })
          this.filters[0].options = array
        })
      },
      getCategories2(id) {
        goodsCategoryApi.children(id !== null ? id : 0).then(response => {
          var array = []
          array.push({ label: '全部分类', value: id })
          response.forEach(function(item) {
            const option = { label: item.name, value: item.id }
            array.push(option)
          })
          this.filters[1].options = array
          this.category_id = id
          this.filters[1].category_id = id
        })
      },
      getCategories3(id) {
        goodsCategoryApi.children(id !== null ? id : 0).then(response => {
          var array = []
          array.push({ label: '全部分类', value: id })
          response.forEach(function(item) {
            const option = { label: item.name, value: item.id }
            array.push(option)
          })
          this.filters[2].options = array
          this.category_id = id
          this.filters[2].category_id = id
        })
      },
      getBrands() {
        brandApi.list({ all: 1, category_id: this.category_id }).then(response => {
          if (response && response.data.length > 0) {
            var array = []
            array.push({ label: '全部品牌', value: '' })
            response.data.forEach(function(item) {
              const option = { label: item.name, value: item.id }
              array.push(option)
            })
          }
          this.filters[3].options = array
          this.brands = response.data
        })
      },
      getGoods() {
        const { filters } = this
        for (const filter of filters) {
          this.$set(this.query, filter.name, filter[filter.name])
        }
        goodsApi.list(this.query).then(response => {
          if (response) {
            var array = []
            response.data.forEach(function(item) {
              const a = { id: parseInt(item.id), name: item.name, price: item.price }
              array.push(a)
            })
            this.list = array
            this.page.total = response.total
            this.pages = response.per_page
            const that = this
            this.selectionIds.forEach(id => {
              this.list.forEach(function(item) {
                if (item.id === id) {
                  console.log(item)
                  that.$refs.multipleTable.toggleRowSelection(item, true)
                }
              })
            })
          }
        })
      },
      selectAll(selection) {
        const that = this
        selection.forEach(function(item) {
          if (that.selectionIds.indexOf(item.id) < 0) {
            that.selections.push(item)
            that.selectionIds.push(item.id)
          }
        })
      },
      select(selection, row) {
        const that = this
        selection.forEach(function(item) {
          if (that.selectionIds.indexOf(item.id) < 0) {
            that.selections.push(item)
            that.selectionIds.push(item.id)
          }
        })
      },
      pageChange(page) {
        this.query.page = page
        this.getGoods()
      },
      handleSizeChange(size) {
        this.query.page_size = size
        this.page.pageSizes = size
        this.getGoods()
      },
      prevClick(page) {
        this.query.page = page
        this.getGoods()
      },
      nextClick(page) {
        this.query.page = page
        this.getGoods()
      },
      handleClose(tag) {
        this.selections.splice(this.selections.indexOf(tag), 1)
      },
      submit() {
        var array = []
        this.selections.forEach(function(item) {
          const product = { product_name: item.name, product_id: item.id, price: item.price }
          array.push(product)
        })
        const that = this
        promotionApi.register({ products: array, promotionId: this.params.promotionId }).then(response => {
          console.log(response)
          if (response) {
            that.$message({
              type: 'success',
              message: '操作成功!'
            })
            that.selections = []
            that.onSuccess()
          }
        })
      },
      getPromotionProducts() {
        promotionApi.query({ promotion_id: this.params.promotionId }).then(response => {
          if (response) {
            if (response) {
              const that = this
              console.log(response.data)
              response.data.forEach(function(item) {
                if (that.selectionIds.indexOf(item.id) < 0) {
                  const a = { id: parseInt(item.product_id), name: item.product_name, price: item.price }
                  that.selections.push(a)
                  that.selectionIds.push(parseInt(item.product_id))
                }
              })
            }
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
