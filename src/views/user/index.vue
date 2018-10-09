<template>
  <div>


  <egrid border
         column-type="selection"
         :path="path"
         :columns="columns"
         :with-detail="withDetail"
         :filters="filters"
         :columns-schema="columnsSchema"
         :edit-handler="editHandler"
         :time="time"
         :with-add="false"
         :with-export="true"
         :buttons="buttons"
         :export-props="exportProps"
  >
  </egrid>
  <el-dialog :visible.sync="dialogVisible">
    <el-form>
      <el-form-item :label="$t('common.id')" label-width="180px">
        <el-input v-model="form.id" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.nick')" label-width="180px">
        <el-input v-model="form.nick"></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.mobile')" label-width="180px">
        <el-input v-model="form.mobile"></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.gender')" label-width="180px">
        <el-select v-model="form.gender" :placeholder="$t('common.please_select')">
          <el-option
            :key="1"
            :label="$t('user.man')"
            :value="1">
          </el-option>
          <el-option
            :key="2"
            :label="$t('user.woman')"
            :value="2">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('user.birthday')"  label-width="180px">
        <el-date-picker
          v-model="form.birthday"
          type="date"
          :placeholder="$t('common.please_select')">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('user.avatar')" label-width="180px">
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
      <el-form-item :label="$t('user.email')" label-width="180px">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.name')" label-width="180px">
        <el-input v-model="form.name"></el-input>
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
  import userApi from '@/api/user'
  export default {
    name: 'index',
    data() {
      const that = this
      return {
        time: 0,
        api: api,
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        imageUrl: '',
        form: {
          id: 0,
          name: '',
          nick: '',
          email: '',
          avatar: '',
          gender: '',
          birthday: '',
          mobile: ''
        },
        columns: [
          { label: 'ID', prop: 'id', align: 'center', disabled: true, formType: 'input', sortable: true },
          { label: '用户昵称', prop: 'nick', align: 'center' },
          { label: '手机', prop: 'mobile', align: 'center', display: 'none', options: that.models, formType: 'select' },
          { label: '性别', prop: 'gender', align: 'center', display: 'none', options: that.models, formType: 'input' },
          { label: '生日', prop: 'birthday', align: 'center', display: 'none', options: that.models, formType: 'input' },
          { label: '电子邮箱', prop: 'email', align: 'center', display: 'none', options: that.models, formType: 'input' },
          { label: '头像', prop: 'avatar', align: 'center', display: 'none', options: that.models, formType: 'input' },
          { label: '姓名', prop: 'name', align: 'center', display: 'none', options: that.models, formType: 'input' }
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
        path: 'user',
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
            label: '病例',
            handle: function(index, row) {
              that.$router.push({ name: 'case', params: { id: row.id }})
            }
          }
        ],
        exportProps: {
          fileName: '用户',
          columns: ['id', 'nick', 'mobile', 'avatar', 'birthday', 'gender', 'email', 'name'],
          header: ['Id', '昵称', '手机', '头像', '生日', '性别', '电子邮箱', '姓名']
        }
      }
    },
    methods: {
      setForm(form) {
        if (form == null) {
          this.form = {
            id: 0,
            name: '',
            nick: '',
            email: '',
            avatar: '',
            gender: '',
            birthday: '',
            mobile: ''
          }
          this.imageUrl = ''
        } else {
          const keys = Object.keys(this.form)
          const that = this
          keys.forEach(function(key) {
            that.form[key] = form[key]
          })
          this.imageUrl = form.avatar
        }
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw)
        this.form.avatar = res.path
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
        userApi.save(this.form).then(response => {
          if (response) {
            that.$message({
              message: that.$t('common.save_success'),
              type: 'success'
            })
            that.dialogVisible = false
            that.time = (new Date()).getTime()
            that.setForm(null)
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
