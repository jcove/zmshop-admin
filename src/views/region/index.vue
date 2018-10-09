<template>
  <div>
  <egrid border
         column-type="selection"
         :path="path"
         :columns="columns"
         :with-detail="withDetail"
         :columns-schema="columnsSchema"
         :params="params"
         :buttons="buttons"
         :delete-handler="deleteHandler"
         :edit-handler="editHandler"
         :time="time"
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
      <el-form-item :label="$t('region.parent')" label-width="180px">
        <el-select v-model="form.parent_id" v-if="parent" :disabled="true">
          <el-option :value="parent.id" :label="parent.name"></el-option>
        </el-select>
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
  import regionApi from '@/api/region'
  export default {
    name: 'index',
    data() {
      const that = this
      return {
        api: api,
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        imageUrl: '',
        time: 0,
        form: {
          id: 0,
          name: '',
          parent_id: 0
        },
        columns: [
          { label: 'ID', prop: 'id', align: 'center', disabled: true, formType: 'input', sortable: true },
          { label: '地区', prop: 'name', align: 'center' },
          { label: '级别', prop: 'level', align: 'center', display: 'none', options: that.models, formType: 'select' },
          { label: '上级地区', prop: 'parent_id', align: 'center', display: 'none', options: that.regions, formType: 'select' }
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
        path: 'region/children',
        withDetail: false,
        regions: [],
        dialogVisible: false,
        params: {
          id: 0
        },
        parent: {},
        editHandler: function(index, row) {
          that.dialogVisible = true
          that.setForm(row)
          that.getParent(row)
        },
        buttons: [
          {
            label: '新增下级',
            handle(index, row) {
              that.dialogVisible = true
              that.parent = row
              that.form.parent_id = row.id
            }
          },
          {
            label: '查看下级',
            handle(index, row) {
              that.$router.push({ name: 'region_index', params: { id: row.id }})
            }
          }
        ]
      }
    },
    created() {
      const id = this.$route.params.id
      this.params.id = id === ':id' ? 0 : id
    },
    watch: {
      '$route'(to, from) {
        const id = to.params.id
        this.params.id = id === ':id' ? 0 : id
        this.time = (new Date()).getTime()
        console.log(id)
      }
    },
    methods: {
      getParent(row) {
        regionApi.get(row.parent_id).then(response => {
          this.parent = response.data
        })
      },
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
        regionApi.save(this.form).then(response => {
          if (response) {
            that.$message({
              message: that.$t('common.save_success'),
              type: 'success'
            })
            that.dialogVisible = false
            that.setForm(null)
            that.time = (new Date()).getTime()
          }
        })
      },
      deleteHandler: function(index, row) {
        regionApi.del(row.id).then(response => {
          if (response) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.time = (new Date()).getTime()
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
