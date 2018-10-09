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
        <el-form-item :label="$t('config.title')" :label-width="labelWidth">
          <el-input v-model="form.title" >

          </el-input>
        </el-form-item>
        <el-form-item :label="$t('config.name')" :label-width="labelWidth">
          <el-input v-model="form.name" >

          </el-input>
        </el-form-item>
        <el-form-item :label="$t('config.type')" :label-width="labelWidth">
          <el-select v-model="form.type" :placeholder="$t('common.please_choose')">
            <el-option
              key="image"
              :label="$t('config.image')"
              value="image">
            </el-option>
            <el-option
              key="text"
              :label="$t('config.text')"
              value="text">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('config.image')" :label-width="labelWidth" v-if="form.type == 'image'">
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
        <el-form-item :label="$t('config.value')" :label-width="labelWidth" v-else>
          <el-input v-model="form.value"  type="textarea" :rows="6">

          </el-input>
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
  import { beforeUploadImage } from '../../../methods/methods'
  import api from '@/api/api'
  import configApi from '@/api/config'
  export default {
    name: 'config-index',
    data() {
      const that = this
      return {
        api: api,
        time: 0,
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        imageUrl: '',
        columns: [
          { label: 'ID', prop: 'id', align: 'center', disabled: true, formType: 'input', sortable: true },
          { label: '配置项', prop: 'title', align: 'center' },
          { label: '类型', prop: 'type', align: 'center', formType: 'select', options:
              [
                {
                  label: '图片',
                  value: 'image'
                },
                {
                  label: '文本',
                  value: 'text'
                }
              ]
          },
          { label: '配置值', prop: 'value', align: 'center' },
          { label: '说明', prop: 'description', align: 'center' }
        ],
        path: 'config',
        columnsSchema: {
          '类型': {
            width: 'auto',
            propsHandler({ col, row }) {
              const types = {
                image: '图片',
                text: '文字'
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
          '配置值': {
            width: 'auto',
            propsHandler({ col, row }) {
              return { type: row.type, value: row.value }
            },
            component: Vue.extend({
              props: ['type', 'value'],
              render(h) {
                if (this.type === 'image') {
                  return h('img', {
                    attrs: {
                      src: this.value
                    },
                    style: {
                      width: '100px'
                    }
                  }, this.type)
                }
                return h('span', {}, this.value)
              }
            })
          }
        },
        form: {
          id: 0,
          name: '',
          type: '',
          title: '',
          value: ''
        },
        labelWidth: '160px',
        options: [],
        loading: false,
        visible: false,
        editHandler: function(index, row) {
          that.visible = true
          that.setForm(row)
        },
        addHandler: function() {
          that.visible = true
          that.setForm(null)
        }
      }
    },
    methods: {
      setForm(form) {
        if (form == null) {
          this.form = {
            id: 0,
            name: '',
            type: '',
            title: '',
            value: ''
          }
          this.imageUrl = ''
        } else {
          const keys = Object.keys(this.form)
          const that = this
          keys.forEach(function(key) {
            that.form[key] = form[key]
          })
          this.imageUrl = form.value
        }
      },
      beforeUploadImage,
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw)
        this.form.value = res.path
      },
      save() {
        const that = this
        configApi.save(this.form).then(response => {
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
