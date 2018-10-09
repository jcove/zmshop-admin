<template>
  <div>
  <egrid border
         column-type="selection"
         :path="path"
         :columns="columns"
         :params="params"
         :time="time"
  >
  </egrid>
  </div>
</template>

<script>
  import api from '@/api/api'
  import brandApi from '@/api/brand'
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
          { label: '国家名称', prop: 'name', align: 'center' }
        ],
        path: 'country',
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
        }
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
