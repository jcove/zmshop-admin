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
      const that = this
      return {
        columns: [
          { label: 'ID', prop: 'id', align: 'center', disabled: true, formType: 'input', sortable: true },
          { label: '名称', prop: 'name', align: 'center' }
        ],
        path: 'goodsModel',
        buttons: [
          {
            label: '属性',
            handle(index, row) {
              that.$router.push({ name: 'goods_model_attribute', params: { model_id: row.id }})
            }
          },
          {
            label: '规格',
            handle(index, row) {
              that.$router.push({ name: 'goods_model_spec', params: { model_id: row.id }})
            }
          }
        ]
      }
    }
  }
</script>

<style scoped>

</style>
