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
          { label: '位置', prop: 'position', align: 'center' },
          { label: '描述', prop: 'description', align: 'center' }
        ],
        path: 'adPosition'
      }
    }
  }
</script>

<style scoped>

</style>
