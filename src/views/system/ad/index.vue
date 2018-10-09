<template>
  <div>
    <egrid border
           column-type="selection"
           :path="path"
           :withForm="true"
           :columns="columns"
           :with-detail="false"
           :columns-schema="columnsSchema"
           :edit-handler="editHandler"
           :add-handler="addHandler"
           :time="time"
            >
    </egrid>
    <el-dialog :visible.sync="visible">
      <el-form>
        <el-form-item :label="$t('common.id')" :label-width="labelWidth">
          <el-input v-model="form.id" :disabled="true">

          </el-input>
        </el-form-item>
        <el-form-item :label="$t('common.name')" :label-width="labelWidth">
          <el-input v-model="form.name" >

          </el-input>
        </el-form-item>
        <el-form-item :label="$t('ad.type')" :label-width="labelWidth">
          <el-select v-model="form.type" :placeholder="$t('common.please_choose')">
            <el-option
              key="image"
              :label="$t('ad.image')"
              value="image">
            </el-option>
            <el-option
              key="text"
              :label="$t('ad.text')"
              value="text">
            </el-option>
            <el-option
              key="code"
              :label="$t('ad.code')"
              value="code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('ad.position')" :label-width="labelWidth">
          <el-select
            v-model="form.position"
            filterable
            clearable
            reserve-keyword
            placeholder="请输入关键词"
            :loading="loading">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.position">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('ad.link')" :label-width="labelWidth">
          <el-input v-model="form.link">

          </el-input>
        </el-form-item>
        <el-form-item :label="$t('ad.image')" :label-width="labelWidth" v-if="form.type == 'image'">
          <el-upload
            class="avatar-uploader"
            :action="api.fileApi"
            :show-file-list="false"
            :headers="headers"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeUploadImage">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item :label="$t('ad.content')" :label-width="labelWidth" v-else>
          <el-input v-model="form.code"  type="textarea" :rows="6">

          </el-input>
        </el-form-item>
        <el-form-item :label="$t('ad.background_color')" :label-width="labelWidth">
          <el-color-picker v-model="form.background_color" show-alpha></el-color-picker>
        </el-form-item>
        <el-form-item  :label-width="labelWidth">
          <el-button type="primary" @click="save">{{$t('common.save')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import adPositionApi from '@/api/adPosition'
  import { beforeUploadImage } from '../../../methods/methods'
  import api from '@/api/api'
  import adApi from '@/api/ad'
  export default {
    name: 'index',
    data() {
      const that = this
      return {
        api: api,
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        imageUrl: '',
        time: 0,
        columns: [
          { label: 'ID', prop: 'id', align: 'center', disabled: true, formType: 'input', sortable: true },
          { label: '名称', prop: 'name', align: 'center' },
          { label: '广告位', prop: 'position', align: 'center' },
          { label: '类型', prop: 'type', align: 'center', formType: 'select', options:
              [
                {
                  label: '图片',
                  value: 'image'
                },
                {
                  label: '文字',
                  value: 'text'
                },
                {
                  label: '代码',
                  value: 'code'
                }
              ]
          },
          { label: '内容', prop: 'code', align: 'center' },
          { label: '链接', prop: 'link', align: 'center' }
        ],
        path: 'ad',
        columnsSchema: {
          '类型': {
            width: 'auto',
            propsHandler({ col, row }) {
              const types = {
                image: '图片',
                text: '文字',
                code: '代码'
              }
              return { type: types[row.type] }
            },
            component: Vue.extend({
              props: ['type'],
              render(h) {
                return h('span', {}, this.type)
              }
            })
          },
          '内容': {
            width: 'auto',
            // propsHandler 可用于转换传给自定义组件的 props 这里将 props 变成了 address
            propsHandler({ col, row }) {
              return { type: row.type, code: row.code }
            },
            component: Vue.extend({
              props: ['type', 'code'],
              render(h) {
                if (this.type === 'image') {
                  return h('img', {
                    attrs: {
                      src: this.code
                    },
                    style: {
                      width: '100px'
                    }
                  }, this.type)
                }
                return h('span', {}, this.code)
              }
            })
          },
          '广告位': {
            width: 'auto',
            // propsHandler 可用于转换传给自定义组件的 props 这里将 props 变成了 address
            propsHandler({ col, row }) {
              return { position: row.position }
            },
            component: Vue.extend({
              props: ['position'],
              render(h) {
                var position = ''
                const t = this
                that.options.forEach(function(item) {
                  if (t.position === item.position) {
                    position = item.name
                  }
                })
                return h('span', {}, position)
              }
            })
          }
        },
        form: {
          id: 0,
          name: '',
          type: '',
          code: '',
          position: '',
          link: '',
          background_color: 'none'
        },
        labelWidth: '160px',
        options: [],
        loading: false,
        visible: false,
        editHandler: function(index, row) {
          that.visible = true
          that.getAd(row)
        },
        addHandler: function() {
          that.visible = true
          that.setForm(null)
        }
      }
    },
    created() {
      this.getAdPosition()
    },
    methods: {
      remoteMethod(query) {
        if (query !== '') {
          adPositionApi.search({ q: query }).then(response => {
            this.options = response.data
          })
        } else {
          this.options = []
        }
      },
      setForm(form) {
        if (form == null) {
          this.form = {
            id: 0,
            name: '',
            type: '',
            code: '',
            position: '',
            link: '',
            background_color: 'none'
          }
          this.imageUrl = ''
        } else {
          const keys = Object.keys(this.form)
          const that = this
          keys.forEach(function(key) {
            that.form[key] = form[key]
          })
          this.imageUrl = form.code
        }
      },
      beforeUploadImage,
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw)
        this.form.code = res.path
      },
      getAd(row) {
        const that = this
        that.setForm(row)
      },
      getAdPosition() {
        const that = this
        adPositionApi.list({ all: 1 }).then(response => {
          that.options = response.data
        })
      },
      save() {
        const that = this
        adApi.save(this.form).then(response => {
          if (response) {
            that.setForm(null)
            that.visible = false
            that.time = (new Date()).getTime()
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
