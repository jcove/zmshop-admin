<template>
    <div class="hot">
      <el-switch
        v-model="value"
        active-color="#13ce66"
        inactive-color="#ff4949"
      @change="change">
      </el-switch>
    </div>
</template>

<script>
  import api from '@/api/api'
  export default {
    name: 's-switch',
    data() {
      return {
        value: true,
        query: {
          id: 0
        }
      }
    },
    props: {
      status: 0,
      path: '',
      id: 0,
      field: ''
    },
    created() {
      this.value = this.status === 1
      this.query.id = this.id
    },
    watch: {
      status(n, o) {
        this.value = n === 1
      }
    },
    methods: {
      change(value) {
        api.setPath(this.path)
        const that = this
        this.query[this.field] = value ? 1 : 0
        api.save(this.query).then(response => {
          that.$message({
            message: that.$t('common.save_success'),
            type: 'success'
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
