<template>
  <div>


  <egrid border
         column-type="selection"
         :path="path"
         :withForm="false"
         :columns="columns"
         :with-detail="withDetail"
         :params="params"
         :columns-schema="columnsSchema"
         :edit-handler="editHandler"
        :add-handler="addHandler"
        :time="time">
  </egrid>
  <el-dialog :visible.sync="dialogVisible">
    <el-form>
      <el-form-item :label="$t('common.id')" label-width="180px">
        <el-input v-model="form.id" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item :label="$t('common.name')" label-width="180px">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="分类" label-width="180px">
        <el-select v-model="form.category_id" placeholder="请选择">
          <el-option
            :key="0"
            label="请选择"
            :value="0">
          </el-option>
          <template  v-for="item in categories">
            <el-option
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
            <template v-if="item.child.length > 0">
              <template    v-for="child in item.child">
                <el-option
                  :key="child.id"
                  :label="'------'+child.name"
                  :value="child.id">
                </el-option>
                <template v-if="child.child.length > 0">
                  <el-option
                    v-for="sub in child.child"
                    :key="sub.id"
                    :label="'--------'+sub.name"
                    :value="sub.id">
                  </el-option>
                </template>
              </template>
            </template>
          </template>

        </el-select>
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
  import goodsCategoryApi from '@/api/goodsCategory'
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
        categories: [],
        time: 0,
        form: {
          id: 0,
          name: '',
          logo: '',
          sort: '',
          description: '',
          category_id: 0
        },
        columns: [
          { label: 'ID', prop: 'id', align: 'center', disabled: true, formType: 'input', sortable: true },
          { label: '名称', prop: 'name', align: 'center' },
          { label: 'Logo', prop: 'logo', align: 'center', display: 'none', options: that.models, formType: 'select' },
          { label: '排序', prop: 'sort', align: 'center', display: 'none', options: that.models, formType: 'input' },
          { label: '分类', prop: 'category_id', align: 'center', display: 'none', options: that.models, formType: 'input' }
        ],
        columnsSchema: {
          'Logo': {
            width: 'auto',
            propsHandler({ col, row }) {
              return { logo: row.logo }
            },
            component: Vue.extend({
              props: ['logo'],
              render(h) {
                return h('img', {
                  style: {
                    width: '100px'
                  },
                  attrs: {
                    src: this.logo
                  }
                })
              }
            })
          },
          '分类': {
            width: 'auto',
            propsHandler({ col, row }) {
              var categoryName = ''
              that.categories.forEach(function(item) {
                if (row.category_id === item.id) {
                  categoryName = item.name
                } else {
                  if (item.child.length > 0) {
                    item.child.forEach(function(child) {
                      if (row.category_id === child.id) {
                        categoryName = child.name
                      } else {
                        if (child.child.length > 0) {
                          child.child.forEach(function(d) {
                            if (row.category_id === d.id) {
                              categoryName = d.name
                            }
                          })
                        }
                      }
                    })
                  }
                }
              })
              console.log(categoryName)
              return { category: categoryName }
            },
            component: Vue.extend({
              props: ['category'],
              render(h) {
                return h('span', {}, this.category)
              }
            })
          }
        },
        path: 'brand',
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
          console.log('aa')
          that.dialogVisible = true
          that.setForm(null)
        }
      }
    },
    created() {
      this.getCategories()
    },
    methods: {
      setForm(form) {
        if (form == null) {
          this.form = {
            id: 0,
            name: '',
            logo: '',
            sort: '',
            description: '',
            category_id: 0
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
      getCategories() {
        const that = this
        goodsCategoryApi.tree().then(response => {
          that.categories = response
        })
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
            that.setForm(null)
            that.time = (new Date()).getTime()
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
