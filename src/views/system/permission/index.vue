<template>
  <egrid border
         column-type="selection"
         :path="path"
         :columns="columns"
  >
  </egrid>
</template>

<script>
  import Egrid from '../../../components/Grid/gird'

  import Vue from 'vue'
  Vue.component(Egrid.name, Egrid)
  export default {
    name: 'permission-index',
    data() {
      return {
        columns: [
          { label: 'ID', prop: 'id', align: 'center', disabled: true, formType: 'input' },
          { label: '名称', prop: 'name', align: 'center' },
          { label: '别名', prop: 'alias', align: 'center' },
          { label: '描述', prop: 'brief', align: 'center' }
        ],
        path: 'permission'
      }
    }
  }
</script>

<style scoped>

</style>
