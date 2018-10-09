<template>
  <div>
    <egrid border
           column-type="selection"
           :path="path"
           :withForm="true"
           :columns="columns"
           :filters="filters"
           :columns-schema="columnsSchema"
            :edit-handler="editHandler"
           :add-handler="addHandler"
            :with-detail="false">
    </egrid>
  </div>
</template>

<script>
  import Switch from './switch'
  import Vue from 'vue'
  import api from '@/api/api'
  import goodsCategoryApi from '@/api/goodsCategory'
  import brandApi from '@/api/brand'
  export default {
    name: 'goods-index',
    data() {
      const that = this
      return {
        brands: [],
        columns: [
          { label: 'ID', prop: 'id', align: 'center', disabled: true, formType: 'input', sortable: true },
          { label: '商品编码', prop: 'goods_sn', align: 'center' },
          { label: '名称', prop: 'name', align: 'center' },
          { label: '封面', prop: 'cover', align: 'center' },
          { label: '分类', prop: 'category_id', align: 'center' },
          { label: '品牌', prop: 'brand_id', align: 'center' },
          { label: '售价', prop: 'price', align: 'center' },
          { label: '库存', prop: 'store', align: 'center' },
          { label: '热卖', prop: 'ihot', align: 'center' },
          { label: '新品', prop: 'is_new', align: 'center' },
          { label: '特价', prop: 'is_speical', align: 'center' },
          { label: '推荐', prop: 'is_recommend', align: 'center' },
          { label: '处方药', prop: 'rx', align: 'center' }
        ],
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
              change: 'search'
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
              change: 'search'
            }
          }
        ],
        columnsSchema: {
          '封面': {
            width: 'auto',
            propsHandler({ col, row }) {
              return { cover: row.cover }
            },
            component: Vue.extend({
              props: ['cover'],
              render(h) {
                return h('img', {
                  attrs: {
                    src: api.getFileUrl(this.cover)
                  },
                  style: {
                    width: '100px'
                  }
                })
              }
            })
          },
          '分类': {
            width: 'auto',
            propsHandler({ col, row }) {
              var category = ''
              that.categories.forEach(function(item) {
                if (item.id === row.category_id) {
                  category = item.name
                }
              })
              return { category: category }
            },
            component: Vue.extend({
              props: ['category'],
              render(h) {
                return h('span', {}, this.category)
              }
            })
          },
          '品牌': {
            width: 'auto',
            propsHandler({ col, row }) {
              var brand = ''
              that.brands.forEach(function(item) {
                if (item.id === row.brand_id) {
                  brand = item.name
                }
              })
              return { brand: brand }
            },
            component: Vue.extend({
              props: ['brand'],
              render(h) {
                return h('span', {}, this.brand)
              }
            })
          },
          '热卖': {
            propsHandler({ col, row }) {
              return { path: 'goods', field: 'is_hot', id: row.id, status: row.is_hot }
            },
            component: Switch
          },
          '新品': {
            propsHandler({ col, row }) {
              return { path: 'goods', field: 'is_new', id: row.id, status: row.is_new }
            },
            component: Switch
          },
          '推荐': {
            propsHandler({ col, row }) {
              return { path: 'goods', field: 'is_recommend', id: row.id, status: row.is_recommend }
            },
            component: Switch
          },
          '特价': {
            propsHandler({ col, row }) {
              return { path: 'goods', field: 'is_special', id: row.id, status: row.is_special }
            },
            component: Switch
          },
          '处方药': {
            propsHandler({ col, row }) {
              return { path: 'goods', field: 'rx', id: row.id, status: row.rx }
            },
            component: Switch
          }
        },
        categories: [],
        category_id: null,
        path: 'goods',
        editHandler: function(index, row) {
          that.$router.push({ name: 'goods_edit', params: { id: row.id }})
        },
        addHandler: function() {
          that.$router.push({ name: 'goods_edit', params: { id: 0 }})
        }
      }
    },
    created() {
      this.getCategories(0)
      this.getBrands()
      this.getAllCategory()
    },
    watch: {
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
      getAllCategory() {
        goodsCategoryApi.list({ all: 1 }).then(response => {
          if (response) {
            this.categories = response.data
          }
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
      }
    }
  }
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
