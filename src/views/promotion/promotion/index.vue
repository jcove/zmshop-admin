<template>
  <div>
    <egrid border
           column-type="selection"
           :path="path"
           :withForm="true"
           :columns="columns"
           :columns-schema="columnsSchema"
           :edit-handler="editHandler"
           :add-handler="addHandler"
           :with-detail="false"
           :with-delete="false"
           :buttons="buttons"
            :time="time">
    </egrid>
    <el-dialog :visible.sync="dialogVisible">
      <el-form>
        <el-form-item :label="$t('common.id')" label-width="180px">
          <el-input v-model="form.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.name')" label-width="180px">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.type')" label-width="180px">
          <el-select v-model="form.type" placeholder="请选择">
            <template  v-for="item in options">
              <el-option
                :key="item.type"
                :label="item.label"
                :value="item.type">
              </el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('promotion.rule')" label-width="180px">
          <template v-if="form.type === 'fullSubtraction'">
            <span>满</span>
            <el-input  v-model="rule.full" style="width: 100px">

            </el-input>
            减
            <el-input  v-model="rule.subtract" style="width: 100px">

            </el-input>
          </template>

        </el-form-item>
        <el-form-item :label="$t('common.start_time')" label-width="180px">
          <el-date-picker
            v-model="form.start_time"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('common.start_time')" label-width="180px">
          <el-date-picker
            v-model="form.end_time"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('common.description')" label-width="180px">
          <el-input type="textarea" v-model="form.description">

          </el-input>
        </el-form-item>
        <el-form-item :label="$t('common.enable')" label-width="180px">
          <el-switch
            v-model="enable"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>`
        <el-form-item label-width="180px">
          <el-button @click="save" type="primary">{{$t('common.save')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="regDialogVisible">
      <goods-select ref="goodsSelect" :params="selectParams" :on-success="onSuccess">

      </goods-select>
    </el-dialog>
  </div>

</template>

<script>
  import Switch from '@/components/MySwitch/switch'
  import promotionApi from '@/api/promotion'
  import GoodsSelect from '../GoodsSelect'
  export default {
    components: { GoodsSelect },
    name: 'promotion',
    data() {
      const that = this
      return {
        dialogVisible: false,
        regDialogVisible: false,
        goodsSelectId: 0,
        time: 0,
        selectParams: {},
        form: {
          id: 0,
          name: '',
          rule: '',
          start_time: '',
          description: '',
          end_time: 0,
          enable: 0,
          type: ''
        },
        rule: {
          full: 0,
          subtract: 0
        },
        buttons: [
          {
            label: '促销商品',
            handle: function(index, row) {
              that.$router.push({ name: 'product', params: { id: row.id }})
            }
          },
          {
            label: '注册促销商品',
            handle: function(index, row) {
              that.regDialogVisible = true
              that.selectParams = { promotionId: row.id }
            }
          }
        ],
        enable: false,
        columns: [
          { label: 'ID', prop: 'id', align: 'center', disabled: true, formType: 'input', sortable: true },
          { label: '促销名称', prop: 'name', align: 'center' },
          { label: '描述', prop: 'description', align: 'center' },
          { label: '开始时间', prop: 'start_time', align: 'center' },
          { label: '结束时间', prop: 'end_time', align: 'center' },
          { label: '是否可用', prop: 'enable', align: 'center' }
        ],
        path: 'promotion',
        columnsSchema: {
          '是否可用': {
            propsHandler({ col, row }) {
              return { path: 'promotion', field: 'enable', id: row.id, status: row.enable }
            },
            component: Switch
          }
        },
        options: [
          {
            label: '满减',
            type: 'fullSubtraction'
          }
        ],
        editHandler: function(index, row) {
          that.dialogVisible = true
          that.setForm(row)
        },
        addHandler: function() {
          that.dialogVisible = true
          that.setForm(null)
        },
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          }, {
            text: '明天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }, {
            text: '一周后',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }]
        }
      }
    },
    watch: {
      enable(n, o) {
        this.form.enable = n ? 1 : 0
      }
    },
    methods: {
      setForm(form) {
        if (form == null) {
          this.form = {
            id: 0,
            name: '',
            rule: '',
            start_time: '',
            description: '',
            end_time: '',
            enable: 0,
            type: ''
          }
          this.rule = {
            full: 0,
            subtract: 0
          }
          this.enable = false
        } else {
          const keys = Object.keys(this.form)
          const that = this
          keys.forEach(function(key) {
            that.form[key] = form[key]
            console.log(that.form[key])
          })
          const rule = JSON.parse(form.rule)
          this.rule = rule
          this.enable = form.enable === 1
        }
      },
      save() {
        const that = this
        this.form.rule = JSON.stringify(this.rule)
        promotionApi.save(this.form).then(response => {
          if (response) {
            that.time = (new Date()).getTime()
            that.dialogVisible = false
          }
        })
      },
      onSuccess() {
        this.regDialogVisible = false
      }
    }
  }
</script>

<style scoped>

</style>
