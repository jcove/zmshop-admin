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
          <el-input v-model="form.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

          <el-form-item label="上级分类" :label-width="formLabelWidth">
            <el-select v-model="form.parent_id" placeholder="请选择">
              <el-option
                :key="0"
                label="无"
                :value="0">
              </el-option>
              <template  v-for="item in categories">
                <el-option
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
                <template v-if="item.children.length > 0">
                  <template    v-for="child in item.children">
                    <el-option
                      :key="child.id"
                      :label="'------'+child.name"
                      :value="child.id">
                    </el-option>
                    <template v-if="child.children.length > 0">
                      <el-option
                        v-for="sub in child.children"
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
  import articleCategoryApi from '@/api/articleCategory'
  import api from '@/api/api'
  export default {
    data() {
      return {
        data: [],
        categories: [],
        dialogVisible: false,
        formLabelWidth: '150px',
        api: api,
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        form: {
          name: '',
          parent_id: '0',
          id: 0
        }
      }
    },
    created() {
      this.tree()
    },
    methods: {
      tree() {
        const that = this
        articleCategoryApi.tree(0).then(response => {
          if (response) {
            that.categories = response
            var array = []
            response.forEach(function(item) {
              const children = that.children(item)
              const i = { label: item.name, id: item.id, name: item.name, parent_id: item.parent_id, icon: item.icon, children: children }
              array.push(i)
            })
            that.data = array
          }
        })
      },
      children(item) {
        var children = []
        const that = this
        item.children.forEach(function(child) {
          var children1 = []
          if (child.children.length > 0) {
            children1 = that.children(child)
          }
          var ii = { label: child.name, children: children1, id: child.id, name: child.name, parent_id: child.parent_id, icon: child.icon }
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
          this.imageUrl = form.icon
          return
        }
        keys.forEach(function(key) {
          that.$set(that.form, key, '')
        })
        this.imageUrl = ''
      },
      edit(data) {
        this.setForm(data)
        this.dialogVisible = true
      },
      addHandler() {
        this.setForm(null)
        this.dialogVisible = true
      },
      remove(node, data) {
        const parent = node.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex(d => d.id === data.id)
        articleCategoryApi.delete(data.id).then(response => {
          if (response) {
            children.splice(index, 1)
          }
        })
      },
      save() {
        const that = this
        articleCategoryApi.save(this.form).then(response => {
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
