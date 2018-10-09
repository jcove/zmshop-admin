<template>
  <div>
    <egrid border
           column-type="selection"
           :path="path"
           :withForm="false"
           :columns="columns"
           :with-detail="withDetail"
           :params="params"
           :filters="filters"
           :columns-schema="columnsSchema"
           :edit-handler="editHandler"
           :add-handler="editHandler"
    >
    </egrid>
    <el-dialog :visible.sync="dialogVisible">
      <el-form>
        <el-form-item :label="$t('goods.id')" label-width="180px">
          <el-input v-model="form.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item :label="$t('goods.name')" label-width="180px">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('goods.goods_model')" label-width="180px">
          <el-select v-model="form.model_id">
            <el-option
              v-for="item in models"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('goods.spec_value')" label-width="180px">
          <el-input v-model="form.items"></el-input>
        </el-form-item>
        <el-form-item label-width="180px">
          <el-button @click="save" type="primary">{{$t('common.save')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import goodsModelApi from '@/api/goodsModel'
  import goodsModelSpecificationApi from '@/api/goodsModelSpecification'
  import Vue from 'vue'
  export default {
    name: 'spec',
    data() {
      const that = this
      return {
        form: {
          id: 0,
          name: '',
          model_id: 0,
          items: ''
        },
        columns: [
          { label: 'ID', prop: 'id', align: 'center', disabled: true, formType: 'input', sortable: true },
          { label: '名称', prop: 'name', align: 'center' },
          { label: '商品模型', prop: 'model_id', align: 'center', display: 'none', options: that.models, formType: 'select' },
          { label: '规格值', prop: 'items', align: 'center', display: 'none', options: that.models, formType: 'input' }
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
          },
          '规格值': {
            width: 'auto',
            propsHandler({ col, row }) {
              var items = []
              if (row.items.length > 0) {
                row.items.forEach(function(item) {
                  items.push(item.name)
                })
              }
              return { items: items.join(',') }
            },
            component: Vue.extend({
              props: ['items'],
              render(h) {
                return h('span', {}, this.items)
              }
            })
          }
        },
        path: 'goodsModelSpecification',
        params: {
          model_id: 0
        },
        withDetail: false,
        models: [],
        dialogVisible: false,
        tableData: [],
        editHandler: function(index, row) {
          that.dialogVisible = true
          that.setForm(row)
        },
        addHandler: function() {
          that.dialogVisible = true
          that.setForm(null)
        }
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
          that.models = array
        })
      },
      setForm(form) {
        if (form == null) {
          this.form = {
            id: 0,
            name: '',
            model_id: 0,
            items: ''
          }
        } else {
          const keys = Object.keys(this.form)
          const that = this
          keys.forEach(function(key) {
            if (key === 'items') {
              if (form[key] instanceof Array) {
                var items = []
                if (form[key].length > 0) {
                  form[key].forEach(function(item) {
                    items.push(item.name)
                  })
                }
                that.form[key] = items.join(',')
              }
            } else {
              that.form[key] = form[key]
            }
          })
        }
      },
      save() {
        var query = {
          id: 0,
          name: '',
          model_id: 0,
          items: ''
        }
        query.items = this.form.items.split(',')
        query.name = this.form.name
        query.model_id = this.form.model_id
        query.id = this.form.id
        const that = this
        goodsModelSpecificationApi.save(query).then(response => {
          if (response) {
            that.$message({
              message: that.$t('common.save_success'),
              type: 'success'
            })
            that.dialogVisible = false
            location.reload()
            that.setForm(null)
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
