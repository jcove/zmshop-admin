<template>
  <div class="tree">
    <el-button type="primary" @click="addHandler()">
      {{$t('common.add')}}
    </el-button>
    <el-tree :data="data" :expand-on-click-node="false" style="padding: 20px">
       <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => edit(data)">
            {{$t('common.edit')}}
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            {{$t('common.delete')}}
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog :visible.sync="dialogVisible">
      <el-form>
        <el-form-item label="ID" :label-width="formLabelWidth">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

          <el-form-item label="上级分类" :label-width="formLabelWidth">
            <el-cascader
              :options="categories"
              v-model="parent"
              :props="props"
              change-on-select
            ></el-cascader>
          </el-form-item>
        <el-form-item label="图标" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            :action="api.fileApi"
            :show-file-list="false"
            :headers="headers"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            v-loading="imageLoading">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="封面" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            :action="api.fileApi"
            :show-file-list="false"
            :headers="headers"
            :on-success="handleCoverSuccess"
            :before-upload="beforeAvatarUpload"
            v-loading="imageLoading">
            <img v-if="coverUrl" :src="coverUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="是否推荐">
          <el-switch
            v-model="switchValue"
            active-color="#13ce66"
            inactive-color="#ff4949" @change="switchChange">
          </el-switch>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth">
          <el-button @click="save" type="primary">
            {{$t('common.save')}}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>

</template>

<script>
  import goodsCategoryApi from '@/api/goodsCategory'
  import api from '@/api/api'
  export default {
    data() {
      return {
        data: [],
        categories: [],
        imageUrl: '',
        coverUrl: '',
        dialogVisible: false,
        formLabelWidth: '150px',
        imageLoading: false,
        coverLoading: false,
        api: api,
        switchValue: false,
        parent: [],
        props: {
          value: 'id',
          children: 'child',
          label: 'name'
        },
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        form: {
          name: '',
          parent_id: '0',
          icon: '',
          id: 0,
          is_recommend: 0,
          cover: ''
        }
      }
    },
    created() {
      this.tree()
    },
    watch: {
      parent(n, o) {
        this.form.parent_id = n[n.length - 1]
      }
    },
    methods: {
      tree() {
        const that = this
        goodsCategoryApi.tree().then(response => {
          if (response) {
            that.categories = response
            var array = []
            response.forEach(function(item) {
              const children = that.children(item)
              const i = { label: item.name, id: item.id, name: item.name, parent_id: item.parent_id, icon: item.icon, cover: item.cover, children: children, is_recommend: item.is_recommend }
              array.push(i)
            })
            that.data = array
          }
        })
      },
      children(item) {
        var children = []
        const that = this
        item.child.forEach(function(child) {
          var children1 = []
          if (child.child.length > 0) {
            children1 = that.children(child)
          }
          var ii = { label: child.name, children: children1, id: child.id, name: child.name, parent_id: child.parent_id, icon: child.icon, cover: child.cover }
          children.push(ii)
        })
        return children
      },

      setForm(form) {
        const that = this
        const keys = Object.keys(this.form)
        if (form != null) {
          keys.forEach(function(key) {
            that.$set(that.form, key, form[key])
          })
          this.switchValue = (form.is_recommend === 1)
          this.imageUrl = form.icon
          this.coverUrl = form.cover
          return
        }
        keys.forEach(function(key) {
          that.$set(that.form, key, '')
        })
        this.imageUrl = ''
        this.coverUrl = ''
      },
      edit(data) {
        this.setForm(data)
        this.dialogVisible = true
      },
      addHandler() {
        this.setForm(null)
        this.dialogVisible = true
      },
      getCategories() {
        const that = this
        goodsCategoryApi.tree().then(response => {
          that.categories = response
        })
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw)
        this.form.icon = res.path
        this.imageLoading = false
      },
      handleCoverSuccess(res, file) {
        this.coverUrl = URL.createObjectURL(file.raw)
        this.form.cover = res.path
        this.coverLoading = false
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
      remove(node, data) {
        const parent = node.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex(d => d.id === data.id)
        goodsCategoryApi.delete(data.id).then(response => {
          if (response) {
            children.splice(index, 1)
          }
        })
      },
      switchChange(value) {
        this.form.is_recommend = value ? 1 : 0
      },
      save() {
        const that = this
        goodsCategoryApi.save(this.form).then(response => {
          if (response) {
            that.setForm(null)
            that.$message({
              message: that.$t('common.save_success'),
              type: 'success'
            })
            that.dialogVisible = false
            that.tree()
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .tree{
    padding: 30px;
  }
</style>
