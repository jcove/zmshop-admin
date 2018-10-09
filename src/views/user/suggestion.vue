<template>
  <div>


  <egrid border
         column-type="selection"
         :path="path"
         :withForm="false"
         :columns="columns"
         :with-detail="withDetail"
         :with-edit="false"
         :columns-schema="columnsSchema"
         :with-add="false"
  >
  </egrid>
  <el-dialog :visible.sync="dialogVisible">
    <el-form>
      <el-form-item :label="$t('common.id')" label-width="180px">
        <el-input v-model="form.id" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item :label="$t('common.name')" label-width="180px">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item :label="$t('common.logo')" label-width="180px">
        <el-upload
          class="avatar-uploader"
          :action="api.fileApi"
          :show-file-list="false"
          :headers="headers"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item :label="$t('common.sort')" label-width="180px">
        <el-input v-model="form.sort"></el-input>
      </el-form-item>
      <el-form-item :label="$t('common.description')" label-width="180px">
        <quill-editor v-model="form.description"></quill-editor>
      </el-form-item>
      <el-form-item label-width="180px">
        <el-button @click="save" type="primary">{{$t('common.save')}}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import api from '@/api/api'
  import brandApi from '@/api/brand'
  import QuillEditor from '@/components/Editor/editor'
  export default {
    components: { QuillEditor },
    name: 'index',
    data() {
      const that = this
      return {
        api: api,
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        imageUrl: '',
        form: {
          id: 0,
          name: '',
          logo: '',
          sort: '',
          description: ''
        },
        columns: [
          { label: 'ID', prop: 'id', align: 'center', disabled: true, formType: 'input', sortable: true },
          { label: '用户昵称', prop: 'nick', align: 'center' },
          { label: '头像', prop: 'avatar', align: 'center', display: 'none', options: that.models, formType: 'input' },
          { label: '内容', prop: 'content', align: 'center', display: 'none', options: that.models, formType: 'select' }
        ],
        filters: [
          {
            name: 'mobile',
            type: 'input',
            mobile: '',
            size: 'medium',
            width: '120px',
            placeholder: '手机号'
          },
          {
            name: 'q',
            type: 'input',
            q: '',
            size: 'medium',
            width: '120px',
            placeholder: '昵称'
          }
        ],
        columnsSchema: {
          '头像': {
            width: 'auto',
            propsHandler({ col, row }) {
              return { avatar: row.avatar }
            },
            component: Vue.extend({
              props: ['avatar'],
              render(h) {
                return h('img', {
                  style: {
                    width: '100px'
                  },
                  attrs: {
                    src: this.avatar
                  }
                })
              }
            })
          }
        },
        path: 'suggestion',
        withDetail: false,
        models: [],
        dialogVisible: false,
        tableData: [],
        editHandler: function(index, row) {
          that.dialogVisible = true
          that.setForm(row)
        }
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
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw)
        this.form.logo = res.path
      },
      beforeAvatarUpload(file) {
        // const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 5
        // if (!isJPG) {
        //   this.$message.error('上传头像图片只能是 JPG 格式!')
        // }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!')
        }
        return isLt2M
      },
      save() {
        const that = this
        brandApi.save(this.form).then(response => {
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
