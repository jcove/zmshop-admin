<template>
  <div>
    <el-button
      size="mini"
      @click="editHandle">编辑</el-button>

    <el-button
      size="mini"
      type="danger"
      @click="deleteHandle">删除</el-button>
  </div>

</template>

<script>
  export default {
    name: 'cell-btn',
    props: ['row', 'col', '$index'],
    methods: {
      editHandle() {
        this.$emit('row-edit', this.row, this.$index)
      },
      deleteHandle() {
        this.$emit('row-delete', this.row, this.$index)
      }
    }
  }
</script>

<style scoped>

</style>
