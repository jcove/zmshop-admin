<template>
  <div>
    <egrid border
           column-type="selection"
           :path="path"
           :columns="columns"
           :edit-handler="editHandler"
           :add-handler="addHandler"
    :time="time">
    </egrid>
    <el-dialog :visible.sync="editDialogVisible">
      <el-form>
        <el-form-item :label-width="labelWidth" label="Id" >
          <el-input v-model="form.id" :disabled="true">

          </el-input>
        </el-form-item>
        <el-form-item :label-width="labelWidth" label="名称">
          <el-input v-model="form.name">

          </el-input>
        </el-form-item>
        <el-form-item :label-width="labelWidth" label="别名">
          <el-input v-model="form.alias">

          </el-input>
        </el-form-item>
        <el-form-item :label-width="labelWidth" label="描述">
          <el-input v-model="form.brief" type="textarae" :rows="2">

          </el-input>
        </el-form-item>
        <el-form-item :label-width="labelWidth" label="权限">
          <el-transfer v-model="form.permissions" :data="permissionData" :titles="['可选','已选']" filterable></el-transfer>
        </el-form-item>
        <el-form-item :label-width="labelWidth">
          <el-button @click="save">
            保存
          </el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
    <el-dialog :visible="givePermissionVisible">

    </el-dialog>
  </div>

</template>

<script>
  import permissionApi from '@/api/permission'
  import roleApi from '@/api/role'
  export default {
    name: 'role-index',
    data() {
      return {
        columns: [
          { label: 'ID', prop: 'id', align: 'center', disabled: true, formType: 'input' },
          { label: '角色名称', prop: 'name', align: 'center' },
          { label: '别名称', prop: 'alias', align: 'center' },
          { label: '描述', prop: 'brief', align: 'center' }
        ],
        path: 'role',
        time: 0,
        editDialogVisible: false,
        givePermissionVisible: false,
        labelWidth: '120px',
        form: {
          id: '',
          name: '',
          brief: '',
          alias: '',
          permissions: []
        },
        permissionData: []
      }
    },
    watch: {
      permissions(n, o) {
        console.log(n)
      }
    },
    methods: {
      editHandler(index, row) {
        this.editDialogVisible = true
        this.getRole(row.id)
        this.getPermission()
      },
      addHandler(index, row) {
        this.editDialogVisible = true
        this.getPermission()
      },
      getPermission() {
        permissionApi.list({ all: 1 }).then(response => {
          if (response) {
            var array = []
            response.data.forEach(function(item) {
              const a = { key: item.name, label: item.alias }
              array.push(a)
            })
            this.permissionData = array
          }
        })
      },
      getRole(id) {
        roleApi.get(id).then(response => {
          if (response) {
            this.setForm(response.data)
          }
        })
      },
      save() {
        roleApi.save(this.form).then(response => {
          if (response) {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
            this.editDialogVisible = false
            this.setForm(null)
            this.time = (new Date()).getTime()
          }
        })
      },
      setForm(form) {
        if (form == null) {
          this.form = {
            id: '',
            name: '',
            brief: '',
            alias: '',
            permissions: []
          }
        } else {
          this.form.id = form.id
          this.form.name = form.name
          this.form.brief = form.brief
          this.form.permissions = []
          this.form.alias = form.alias
          const that = this
          form.permissions.forEach(function(item) {
            that.form.permissions.push(item.name)
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
