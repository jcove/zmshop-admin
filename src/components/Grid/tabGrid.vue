<template>
  <div class="tab-container">
    <el-tabs style='margin-top:15px;' v-model="activeName" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :label="item.label" :key='item.key' :name="item.key"  >
        <keep-alive>
          <egrid v-if='activeName==item.key'  max-height="500"
                      column-type="selection"
                      :path="path"
                      :columns="columns"
                      :add-btn="addBtn"
                 :columns-schema="columnsSchema"
                 :filters="filters"
                      :params="query"
                    :detail-handler="detailHandler"
                    :columns-handler="columnsHandler">
          </egrid>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Egrid from './gird'

export default {
  name: 'tab-grid',
  components: { Egrid },
  data() {
    return {
      query: [],
      activeName: {
        type: String,
        default() {
          return ''
        }
      }
    }
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    tabMapOptions: {
      type: Array,
      default() {
        return []
      }
    },
    activeNameDefault: {
      type: String,
      default() {
        return ''
      }
    },
    path: '',
    addBtn: {
      type: String,
      default() {
        return 'block'
      }
    },
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    params: Object,
    filters: {
      type: Array,
      default() {
        return []
      }
    },
    tabParam: String,

    columnType: [String, Array],

    columnTypeProps: Object,

    columnKeyMap: Object,

    columnsProps: Object,

    columnsSchema: Object,

    columnsHandler: Function,

    detailHandler: Function,

    slotAppend: Boolean
  },
  watch: {
    activeName: {
      handler: function(val, oldval) {
        this.$set(this.query, this.tabParam, val)
      }
    }
  },
  created: function() {
    this.activeName = this.activeNameDefault
    this.query = this.params
    this.$set(this.query, this.tabParam, this.activeName)
  }
}
</script>

<style scoped>
  .tab-container{
    margin: 30px;
  }
</style>
