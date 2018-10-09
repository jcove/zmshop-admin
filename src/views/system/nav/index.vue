<template>
  <div>
    <egrid border
           column-type="selection"
           :path="path"
           :withForm="true"
           :columns="columns"
           :with-detail="false"
           :buttons="buttons"
            >
    </egrid>
  </div>
</template>

<script>
  export default {

    name: 'index',
    data() {
      return {
        columns: [
          { label: 'ID', prop: 'id', align: 'center', disabled: true, formType: 'input', sortable: true },
          { label: '名称', prop: 'name', align: 'center' },
          { label: '链接', prop: 'url', align: 'center' },
          { label: '排序', prop: 'order', align: 'center' }
        ],
        path: 'nav'
      }
    }
  }
</script>

<style scoped>

</style>
