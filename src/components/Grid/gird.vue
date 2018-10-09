<template>
  <div class="app-container">
    <div class="tools">
      <el-button type="primary" @click="handleAdd" v-if="withAdd">添加</el-button>
      <el-button type="primary" @click="handleExport" v-if="withExport" v-loading="exportLoading">导出</el-button>
      <el-button type="primary" @click="tool.handle" v-for="(tool,index) in tools" :key="index" :loading="tool.loading">{{ tool.label}}</el-button>
    </div>
    <div class="filter" v-if="filtersData.length > 0">
      筛选
      <template v-for="filter in filtersData">
        <el-input v-if="filter.type==='input'" v-model="filter[filter.name]" :placeholder="filter.placeholder" :size="filter.size" :style="{ width: filter.width}"></el-input>

        <el-select v-model="filter[filter.name]" :placeholder="filter.placeholder"  v-if="filter.type ==='select'"  :size="filter.size" :style="{ width: filter.width}"  v-bind="filter.attrs" v-on="vOn(filter.events)">
          <el-option
            v-for="item in filter.options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>


      </template>
      <el-button type="primary" @click="search" >{{ $t('common.search')}}</el-button>
    </div>
    <el-table class="egrid"
              :data="list" ref="grid"
              v-bind="tableBind"
              v-on="$listeners" v-loading="listLoading">
      <template v-for="tp in typesColumns">
        <el-table-column
          v-if="tp.type === 'expand'"
          v-bind="tp.props"
          type="expand"
          :key="tp.type">
          <template slot-scope="props">
            <slot name="expand" v-bind="props"></slot>
          </template>
        </el-table-column>
        <el-table-column v-else
                         :key="tp.type"
                         :type="tp.type"
                         v-bind="tp.props"
                          :sortable="sortable">
        </el-table-column>
      </template>
      <el-table-column v-for="col in renderColumns"
                       :key="col.label" v-bind="getColBind(col)">
        <template slot-scope="scope">
          <component :is="col.component"
                     v-bind="getCptBind(scope, col)"
                     v-on="col.listeners">
          </component>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="150px" align="center">
        <template slot-scope="scope">
          <el-button v-if="withEdit"
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button v-if="withDelete"
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <el-button v-if="withDetail"
            size="mini"
            @click="handleDetail(scope.$index, scope.row)">查看</el-button>
          <template v-if="buttons.length > 0">
            <el-button v-for="(button,index) in buttons" :key="index"
                       size="mini"
                       @click="button.handle(scope.$index, scope.row)">{{ button.label}}</el-button>
          </template>
        </template>
      </el-table-column>
      <template v-if="slotAppend" slot="append">
        <slot name="append"></slot>
      </template>
    </el-table>
    <el-pagination @current-change="pageChange"
                   @prev-click="prevClick"
                   @next-click="nextClick"
                   @size-change="handleSizeChange"
                   :page-sizes="[10, 20, 50, 100,500,1000]"
                   :total="page.total"
                   :page-size="page.pageSize"
                   background
                   :current-page="query.page"
                   layout="prev, pager, next,sizes,jumper"
                  >
    </el-pagination>

    <template v-if="withForm">
      <el-dialog title="编辑" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <template v-for="col in columns">
            <template v-if="col.display ==='none'"></template>
            <el-form-item :label="col.label" :label-width="formLabelWidth">
              <el-input v-model="form[col.prop]" :disabled="col.disabled" auto-complete="off" v-if="col.formType ==='input'">
              </el-input>
              <el-input v-model="form[col.prop]" :disabled="col.disabled" auto-complete="off" v-if="col.formType ===undefined">
              </el-input>
              <el-select v-model="form[col.prop]" placeholder="请选择"  v-if="col.formType ==='select'" :disabled="col.disabled" :multiple="col.multiple">
                <el-option
                  v-for="item in col.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-autocomplete  v-if="col.formType ==='selectWithSuggestions'" :disabled="col.disabled"
                v-model="form[col.prop]"
                :fetch-suggestions="col.querySearchAsync"
                @select="col.handleSelect"
                placeholder="请输入内容">
              </el-autocomplete>

            </el-form-item>
          </template>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSave()">保存</el-button>
        </div>
      </el-dialog>

    </template>
    <el-dialog title="详情" :visible.sync="dialogDetailVisible">
      <div class="detail">
        <template v-for="col in columns">
          <div class="detail-item">
            <label>{{ col.label }} </label>
            <template v-if="col.formType === 'select'">
              <template v-for="option in col.options">
              <span v-if="form[col.prop] === option.value">
                {{ option.label}}
              </span>
              </template>
            </template>
            <template v-else>
              <span>{{ form[col.prop] }}</span>
            </template>
          </div>
        </template>
      </div>

    </el-dialog>
  </div>

</template>

<script>
import ElTable from 'element-ui/lib/table'
import ElTableColumn from 'element-ui/lib/table-column'
import Text from './text'
import api from '@/api/api'
import ElInput from 'element-ui/lib/input'
import ElButton from 'element-ui/lib/button'
import excel from '@/vendor/Export2Excel'
const BOOLEAN_KEYS = [
  'fit',
  'stripe',
  'border',
  'show-header',
  'highlight-current-row',
  'default-expand-all',
  'show-summary'
]

const COLUMN_PROPS = {
  align: 'left',
  component: Text
}

const TYPES = ['selection', 'expand', 'index']

const COLUMN_KEY_MAP = {
  label: 'label',
  prop: 'prop'
}

export default {
  name: 'Egrid',
  data() {
    return {
      form: {},
      list: [],
      pages: 0,
      listLoading: true,
      exportLoading: false,
      page: {
        pageSize: 10,
        total: 0
      },
      query: {
        page: 1,
        page_size: 10
      },
      filtersData: [],
      sortable: null,
      dialogFormVisible: false,
      dialogDetailVisible: false,
      formLabelWidth: '120px',
      index: 0,
      detail: ''
    }
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    buttons: {
      type: Array,
      default() {
        return []
      }
    },
    tools: {
      type: Array,
      default() {
        return []
      }
    },
    path: '',
    withAdd: {
      type: Boolean,
      default() {
        return true
      }
    },
    withExport: {
      type: Boolean,
      default() {
        return false
      }
    },
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    filters: {
      type: Array,
      default() {
        return []
      }
    },
    withEdit: {
      type: Boolean,
      default: true
    },
    withDelete: {
      type: Boolean,
      default: true
    },
    withDetail: {
      type: Boolean,
      default: true
    },
    withForm: {
      type: Boolean,
      default: true
    },
    params: {
      type: Object,
      default() {}
    },
    exportProps: {
      type: Object,
      default() {
        return {
          header: [],
          columns: [],
          fileName: '',
          merge: '',
          mergeFunc: ''
        }
      }
    },
    time: 0,
    columnType: [String, Array],

    columnTypeProps: Object,

    columnKeyMap: Object,

    columnsProps: Object,

    columnsSchema: Object,

    columnsHandler: Function,

    detailHandler: Function,
    deleteHandler: Function,
    editHandler: Function,
    slotAppend: Boolean,
    addHandler: Function,
    exportHandler: Function
  },

  computed: {
    tableBind() {
      const { $attrs } = this
      const bind = {}
      Object.keys($attrs).forEach(key => {
        const v = $attrs[key]
        const uniformKey = key.replace(/([A-Z])/, '-$1').toLowerCase()
        bind[key] = ~BOOLEAN_KEYS.indexOf(uniformKey) && v === '' ? true : v
      })
      return bind
    },

    renderColumns() {
      const {
        columns,
        columnKeyMap,
        columnsHandler,
        columnsProps: props,
        columnsSchema: schema
      } = this
      const map = Object.assign({}, COLUMN_KEY_MAP, columnKeyMap)
      const renderColumns = columns.map(col => {
        const mix = schema && schema[col[map.label]] || {}
        const it = Object.assign({}, COLUMN_PROPS, props, col, mix)
        it.label = it[map.label]
        it.prop = it[map.prop]
        return it
      })
      return columnsHandler && columnsHandler(renderColumns) || renderColumns
    },

    // 用于渲染特殊列
    typesColumns() {
      const { columnType: type, columnTypeProps } = this
      let typeColums = []
      if (typeof type === 'string' && ~TYPES.indexOf(type)) {
        typeColums = [type]
      }
      if (Array.isArray(type)) {
        typeColums = type.filter(it => ~TYPES.indexOf(it))
      }
      const map = columnTypeProps || {}
      return typeColums.map(type => {
        return {
          type,
          props: map[type]
        }
      })
    }
  },
  watch: {
    time(n, o) {
      if (n !== 0) {
        this.setQuery()
        this.getList()
      }
    },
    'page.pageSize': {
      handler(n, o) {
        localStorage.setItem('pageSize', n)
      },
      deep: true
    }
  },
  created: function() {
    api.setPath(this.path)
    this.filter()
    // 组装参数
    this.setQuery()
    this.getList()
    const pageSize = parseInt(localStorage.getItem('pageSize'))
    if (pageSize && pageSize > 0) {
      this.page.pageSize = pageSize
      this.query.page_size = pageSize
    } else {
      this.page.pageSize = 10
    }
  },
  mounted: function() {
    this.setForm()
  },
  methods: {
    filter() {
      const { filters } = this
      if (filters) {
        const that = this
        const keys = Object.keys(filters)
        keys.forEach(function(key) {
          var filter = filters[key]
          filter[filter.name] = ''
          that.$set(that.filtersData, key, filter)
        })
      }
    },
    call(fun) {
      if (fun instanceof Function) {
        return fun
      } else if (this[fun] instanceof Function) {
        return this[fun]
      }
      console.log(typeof fun)
      console.log(fun)
    },
    vOn(on) {
      if (on) {
        const that = this
        const keys = Object.keys(on)
        keys.forEach(function(key) {
          on[key] = that.call(on[key])
        })
      }
      return on
    },
    getColBind(col) {
      const bind = Object.assign({}, col)
      delete bind.component
      delete bind.listeners
      delete bind.propsHandler
      return bind
    },
    getCptBind({ row, column, $index }, col) {
      const props = { row, col, column, $index }
      const handler = col.propsHandler
      return handler && handler(props) || props
    },
    setForm(form) {
      const that = this
      if (form != null) {
        // 只对columns设置的字段进行编辑
        this.columns.forEach(function(col) {
          that.$set(that.form, col.prop, form[col.prop])
        })
        return
      }
      for (const column of this.columns) {
        that.$set(that.form, column.prop, column.default ? column.default : '')
      }
    },
    setQuery() {
      const that = this
      if (this.params) {
        const keys = Object.keys(this.params)
        keys.forEach(function(key) {
          that.$set(that.query, key, that.params[key])
        })
      }
    },
    getList() {
      this.listLoading = true
      const that = this
      api.setPath(this.path)
      api.list(this.query).then(response => {
        that.list = response.data
        that.page.total = response.total
        that.pages = response.per_page
        that.listLoading = false
      })
    },
    pageChange(page) {
      this.query.page = page
      this.getList()
    },
    handleSizeChange(size) {
      this.query.page_size = size
      this.page.pageSize = size
      this.getList()
    },
    prevClick(page) {
      this.query.page = page
      this.getList()
    },
    nextClick(page) {
      this.query.page = page
      this.getList()
    },
    handleDetail(index, row) {
      const { detailHandler } = this
      if (detailHandler) {
        detailHandler(index, row)
        return
      }
      this.dialogDetailVisible = true
      this.index = index
      if (row.parent) {
        this.form.parent = row.parent.name
      }
      this.setForm(row)
      this.index = index
    },
    handleAdd() {
      const { addHandler } = this
      if (addHandler) {
        addHandler()
        return
      }
      this.dialogFormVisible = true
      this.index = 0
      const keys = Object.keys(this.form)
      const that = this
      keys.forEach(function(key) {
        that.form[key] = ''
      })
    },
    handleEdit(index, row) {
      const { editHandler } = this
      if (editHandler) {
        editHandler(index, row)
        return
      }
      this.dialogFormVisible = true
      if (row.parent) {
        this.form.parent = row.parent.name
      }
      this.setForm(row)
      this.index = index
    },
    handleDelete(index, row) {
      const { deleteHandler } = this
      if (deleteHandler) {
        deleteHandler(index, row)
        return
      }
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delete(row.id, index)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleExport() {
      // this.loading = true
      const { exportHandler } = this
      if (exportHandler) {
        exportHandler(this.list)
        return
      }
      const tHeader = this.exportProps.header
      const filterVal = this.exportProps.columns
      const list = this.list
      const data = this.formatJson(filterVal, list)
      console.log(data)
      const date = new Date()
      excel({
        header: tHeader,
        data: data,
        filename: this.exportProps.fileName + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds(),
        autoWidth: true
      })
      this.exportLoading = false
    },
    delete(id, index) {
      const that = this
      api.setPath(this.path)
      api.del(id).then(response => {
        if (response) {
          that.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 1500
          })
          that.list.splice(index, 1)
        }
      })
    },
    handleSelect(item) {
      console.log(item)
    },
    handleSave() {
      const that = this
      api.setPath(this.path)
      api.save(this.form).then(response => {
        if (response) {
          that.$notify({
            title: '成功',
            message: '保存成功',
            type: 'success',
            duration: 1500
          })
          // if (parseInt(that.form.id) > 0) {
          //   that.$set(that.list, that.index, response.data)
          // } else {
          //   that.list.push(response.data)
          // }
          this.getList()
          that.dialogFormVisible = false
          that.setForm(null)
        }
      })
    },
    onFilterChange(value) {
      console.log(value)
    },
    search() {
      const { filters } = this
      for (const filter of filters) {
        this.$set(this.query, filter.name, filter[filter.name])
      }
      this.getList()
    },
    formatJson(filterVal, jsonData) {
      const that = this
      return jsonData.map(v => filterVal.map(j => {
        if (j === that.exportProps.merge) {
          return that.exportProps.mergeFunc(v[j])
        } else {
          return v[j]
        }
      }))
    }
  },
  components: {
    ElButton,
    ElInput,
    [ElTable.name]: ElTable,
    [ElTableColumn.name]: ElTableColumn
  }
}
</script>
<style scoped lang="scss">
  .detail{
    border-radius: 5px;
  }
  .detail-item{
    border-style: solid;
    border-top: 0;
    border-width: 1px;
    border-color: #ccc;
  }
  .detail-item:first-child{
    border-top:1px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .detail-item:last-child{
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .detail-item label{
    width: 120px;
    display: inline-block;
    background: #eee;
    padding: 10px
  }
  .detail-item span{
    display: inline-block;;
    padding:10px;
  }
  .filter{
    padding: 15px 0;
  }
</style>
