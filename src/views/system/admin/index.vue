<template>
  <div>
    <egrid border
           column-type="selection"
           :path="path"
           :columns="columns"
           :columns-schema="columnsSchema"
            :edit-handler="editHandler"
           :add-handler="addHandler"
    :time="time">
    </egrid>
    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form :model="form"  ref="form">
        <el-form-item label="ID" :label-width="formLabelWidth">
          <el-input v-model="form.id" :disabled="true" auto-complete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="国家" :label-width="formLabelWidth">
          <el-select  v-model="form.country" filterable placeholder="请选择">
            <el-option
              v-for="item in countries"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="头像" label-width="120px">
          <el-upload
            class="avatar-uploader"
            :action="api.fileApi"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :headers="headers">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select  v-model="form.roles" filterable placeholder="请选择" :multiple="true" @change="change">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" auto-complete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth">
          <el-input v-model="form.password_confirmation" auto-complete="off" type="password"></el-input>
        </el-form-item>
        <el-form-item label-width="120px">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="success" @click="handleSave()">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>


</template>

<script>
  import Egrid from '../../../components/Grid/gird'
  import Vue from 'vue'
  import roleApi from '@/api/role'
  import api from '@/api/api'
  import adminApi from '@/api/admin'
  import countryApi from '@/api/country'
  Vue.component(Egrid.name, Egrid)
  export default {
    name: 'role-index',
    data() {
      const that = this
      return {
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        time: 0,
        countries: [],
        columns: [
          { label: 'ID', prop: 'id', align: 'center', disabled: true, formType: 'input' },
          { label: '用户名', prop: 'username', align: 'center' },
          { label: '名称', prop: 'name', align: 'center' },
          { label: '头像', prop: 'avatar', align: 'center' }
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
                  attrs: {
                    src: this.avatar
                  },
                  style: {
                    width: '100px'
                  }
                })
              }
            })
          }
        },
        path: 'admin',
        editHandler: function(index, row) {
          adminApi.get(row.id).then(response => {
            if (response) {
              that.setForm(response.data)
              that.imageUrl = response.data.avatar
            }
          })
          that.dialogFormVisible = true
        },
        dialogFormVisible: false,
        formLabelWidth: '120px',
        form: {
          id: '',
          username: '',
          name: '',
          country: '',
          avatar: '',
          roles: [],
          password: '',
          password_confirmation: ''
        },
        options: [],
        api: api,
        imageUrl: ''
      }
    },
    created() {
      this.getRole()
      this.getCountries()
    },
    methods: {
      getRole() {
        const that = this
        roleApi.list().then(response => {
          if (response.data) {
            var array = []
            response.data.forEach(function(item) {
              array.push({ label: item.alias, value: item.name })
            })
            that.options = array
          }
        })
      },
      getCountries() {
        countryApi.list({ all: 1 }).then(response => {
          if (response) {
            this.countries = response.data
          }
        })
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
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isLt2M
      },
      setForm(form) {
        const that = this
        if (form != null) {
          this.form.id = form.id
          this.form.username = form.username
          this.form.name = form.name
          this.form.avatar = form.avatar
          this.form.country = form.country === 0 ? '' : form.country
          this.form.roles = []
          this.imageUrl = form.avatar
          this.form.password = form.password
          this.form.password_confirmation = form.password
          form.roles.forEach(function(item) {
            that.form.roles.push(item.name)
          })
        } else {
          this.form = {
            id: '',
            username: '',
            name: '',
            country: '',
            avatar: '',
            roles: [],
            password: '',
            password_confirmation: ''
          }
        }
      },
      change(value) {
        console.log(value)
      },
      addHandler(index, row) {
        this.dialogFormVisible = true
        this.setForm(null)
      },
      handleSave() {
        // this.$refs.form.validate((valid) => {
        //   if (valid) {
        //     alert('submit!')
        //   } else {
        //     console.log('error submit!!')
        //     return false
        //   }
        // })
        const that = this
        api.setPath('admin')
        api.save(this.form).then(function(response) {
          if (response) {
            that.dialogFormVisible = false
            console.log(that.dialogFormVisible)
            that.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 1500
            })
            that.time = (new Date()).getTime()
          }
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
