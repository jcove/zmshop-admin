<template>
  <div>
    <egrid border
           column-type="selection"
           :path="path"
           :withForm="false"
           :columns="columns"
           :with-detail="false"
           :with-edit="true"
           :edit-handler="editHandler"
           :add-handler="addHandler"
           :columns-schema="columnsSchema"
           :buttons="buttons"
           :time="time"
    >
    </egrid>
    <el-dialog :visible.sync="dialogVisible" width="1000px">
      <el-form>
        <el-form-item :label="$t('common.id')" label-width="80px">
          <el-input v-model="form.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.name')" label-width="80px">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item :label="$t('freight.type')" label-width="80px">
          <el-select v-model="form.type">
            <el-option :value="1" label="重量（g）">
            </el-option>
            <el-option :value="2" label="件数(件)">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  label-width="80px" label="">
          <div class="region-item">
            国家
          </div>
          <div class="region-item">
            配送区域
          </div>
          <div class="region-item">
            首重/件
          </div>
          <div class="region-item">
            运费
          </div>
          <div class="region-item">
            续重/件
          </div>
          <div class="region-item">
            费用
          </div>
        </el-form-item>
        <el-form-item v-for="(region,index) in form.regions" :key="index" label-width="80px" label="配送区域" v-if="region.delete !==1">
          <div class="region-item">
            <el-select v-model="region.country_id" placeholder="选择国家" @change="countryChange">
              <el-option v-for="country in countries"
              :key="country.id"
              :label="country.name"
              :value="country.id">
              </el-option>
            </el-select>
          </div>
          <div class="region-item" v-if="regionParam[index].regionShow">
            <el-select v-model="regionParam[index].id1" clearable placeholder="选择省">
              <el-option v-for="region in regions"
                         :key="region.id"
                         :label="region.name"
                         :value="region.id">
              </el-option>
            </el-select>
            <el-select v-model="regionParam[index].id2" clearable  placeholder="选择市">
              <el-option v-for="region in regionData[index].regions2"
                         :key="region.id"
                         :label="region.name"
                         :value="region.id">
              </el-option>
            </el-select>
            <el-select v-model="regionParam[index].id3" placeholder="选择区县" clearable  @change="regionChange">
              <el-option v-for="region in regionData[index].regions3"
                         :key="region.id"
                         :label="region.name"
                         :value="region.id">
              </el-option>
            </el-select>
          </div>
          <div class="region-item">
            <el-input v-model="region.first_unit" :placeholder="'首'+ placeHolder(form.type)"></el-input>
          </div>
          <div class="region-item">
            <el-input v-model="region.first_money" placeholder="运费"></el-input>
          </div>
        <div class="region-item">
            <el-input v-model="region.continue_unit" :placeholder="'续'+ placeHolder(form.type)"></el-input>
        </div>
          <div class="region-item">
            <el-input v-model="region.continue_money"  placeholder="费用"></el-input>
          </div>
          <div class="region-item">
            <el-button @click="del(region)" type="text">删除</el-button>
          </div>
        </el-form-item>
        <el-form-item  label-width="80px">
          <el-button @click="save">保存</el-button>
          <el-button @click="addRegion">新增配送区域</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import countryApi from '@/api/country'
  import regionApi from '@/api/region'
  import freightApi from '@/api/freight'
  export default {
    name: 'freight-index',
    data() {
      return {
        dialogVisible: false,
        path: 'freight',
        countries: [],
        regionShow: true,
        regions: [],
        regions2: [],
        regions3: [],
        regionData: [
          {
            regions: [],
            regions2: [],
            regions3: []
          }
        ],
        regionsList: {},
        regionParam: [
          {
            id1: '',
            id2: '',
            id3: '',
            regionShow: true
          }
        ],
        time: 0,
        form: {
          id: 0,
          name: '',
          type: 1,
          regions: [
            {
              id: 2,
              country_id: '',
              region_id: '',
              delete: '',
              first_unit: '',
              first_money: '',
              continue_unit: '',
              continue_money: ''
            }
          ]
        },
        columns: [
          { label: 'ID', prop: 'id', align: 'center', disabled: true, formType: 'input', sortable: true },
          { label: '名称', prop: 'name', align: 'center', disabled: true, formType: 'input', sortable: true },
          { label: '计量方式', prop: 'type', align: 'center', disabled: true, formType: 'input', sortable: true }
        ],
        columnsSchema: {
          '计量方式': {
            width: 'auto',
            propsHandler({ col, row }) {
              var type = ''
              switch (row.type) {
                case 1:
                  type = '重量(g)'
                  break
                case 2:
                  type = '件'
                  break
              }
              return { type: type }
            },
            component: Vue.extend({
              props: ['type'],
              render(h) {
                return h('span', {}, this.type)
              }
            })
          },
          '首件': {
            width: 'auto',
            propsHandler({ col, row }) {
              var firstUnit = ''
              switch (row.type) {
                case 1:
                  firstUnit = row.first_unit + 'g'
                  break
                case 2:
                  firstUnit = row.first_unit + '件'
                  break
              }
              return { first_unit: firstUnit }
            },
            component: Vue.extend({
              props: ['first_unit'],
              render(h) {
                return h('span', {}, this.first_unit)
              }
            })
          },
          '续件': {
            width: 'auto',
            propsHandler({ col, row }) {
              var continueUnit = ''
              switch (row.type) {
                case 1:
                  continueUnit = row.continue_unit + 'g'
                  break
                case 2:
                  continueUnit = row.continue_unit + '件'
                  break
              }
              return { continue_unit: continueUnit }
            },
            component: Vue.extend({
              props: ['continue_unit'],
              render(h) {
                return h('span', {}, this.continue_unit)
              }
            })
          }
        },
        buttons: [
        ]
      }
    },
    created() {
      this.getCountries()
      this.getRegions()
    },
    watch: {
      'form.regions': {
        handler(n, o) {
          const that = this
          n.forEach(function(item, index) {
            if (item.country_id === 1) {
              that.regionParam[index].regionShow = true
            } else {
              that.regionParam[index].regionShow = false
            }
          })
        },
        deep: true
      },
      regionParam: {
        handler(n, o) {
          const that = this
          n.forEach(function(item, index) {
            if (n[index].id1 !== '') {
              that.getRegionChildren(item.id1, index, 'regions2')
            }
            if (n[index].id2 !== '') {
              that.getRegionChildren(item.id2, index, 'regions3')
            }
          })
        },
        deep: true
      }
    },
    methods: {
      placeHolder(type) {
        switch (type) {
          case 1:
            return '重'
          case 2:
            return '件'
        }
      },
      getCountries() {
        countryApi.list({ all: 1 }).then(response => {
          if (response) {
            this.countries = response.data
          }
        })
      },
      getRegions() {
        regionApi.children(0).then(response => {
          this.regions = response.data
        })
      },
      getRegionChildren(id, index, key) {
        regionApi.children(id).then(response => {
          if (!this.regionsList[id]) {
            this.$set(this.regionsList, id, response.data)
            this.regionData[index][key] = response.data
          } else {
            this.regionData[index][key] = this.regionsList[id]
          }
        })
      },
      getRegion(id, index) {
        const that = this
        console.log(this.regionData)
        if (id > 0) {
          regionApi.get(id).then(response => {
            if (response) {
              var regionParamOption = this.regionParam[index]
              const data = response.data
              switch (response.data.level) {
                case 1:
                  regionParamOption.id1 = id
                  that.getRegionChildren(id, index, 'regions2')
                  break
                case 2:
                  regionParamOption.id2 = id
                  regionParamOption.id1 = response.data.parent_id
                  that.getRegionChildren(response.data.parent_id, index, 'regions2')
                  // 二级
                  that.getRegionChildren(id, index, 'regions3')
                  break
                case 3:
                  regionParamOption.id3 = id
                  this.getRegionChildren(response.data.parent_id, index, 'regions3')
                  regionParamOption.id2 = response.data.parent_id
                  // 二级
                  regionApi.get(data.parent_id).then(response => {
                    that.getRegionChildren(response.data.parent_id, index, 'regions3')
                    const region2 = response.data
                    regionParamOption.id1 = region2.parent_id
                  })
                  break
              }
              this.regionParam[index] = regionParamOption
            }
          })
        }
      },
      getRegions2(id, index) {
        console.log(index)
        regionApi.children(id).then(response => {
          this.regionData[index].regions2 = response.data
        })
      },
      getRegions3(id, index) {
        regionApi.children(id).then(response => {
          this.regionData[index].regions3 = response.data
        })
      },
      regionChange(value) {

      },
      addHandler() {
        this.dialogVisible = true
        this.setForm(null)
      },
      save() {
        const that = this
        this.regionParam.forEach(function(item, index) {
          const regionId = item.id3 !== '' ? item.id3 : (item.id2 !== '' ? item.id2 : item.id1)
          that.form.regions[index].region_id = regionId
        })
        freightApi.save(this.form).then(response => {
          if (response) {
            this.setForm(null)
            that.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 1500
            })
            this.time = (new Date()).getTime()
            this.dialogVisible = false
          }
        })
      },
      del(region) {
        const index = this.form.regions.indexOf(region)
        console.log(index)
        if (region.id > 0) {
          region.delete = 1
          this.$set(this.form.regions, index, region)
        } else {
          this.regionParam.splice(index, 1)
          this.form.regions.splice(index, 1)
        }
      },
      editHandler(index, row) {
        this.getFreight(row.id)
        this.dialogVisible = true
      },
      countryChange(value) {
        if (value === 1) {
          this.regionShow = true
        } else {
          this.regionShow = false
        }
      },
      getFreight(id) {
        freightApi.get(id).then(response => {
          if (response) {
            this.setForm(response.data)
          }
        })
      },
      setForm(form) {
        if (form === null) {
          this.regionData = [
            {
              regions: [],
              regions2: [],
              regions3: []
            }
          ]
          this.regionParam = [{
            id1: '',
            id2: '',
            id3: '',
            regionShow: true
          }]
          this.form = {
            id: 0,
            name: '',
            type: 1,
            regions: [
              {
                id: 0,
                country_id: '',
                region_id: '',
                delete: '',
                first_unit: '',
                first_money: '',
                continue_unit: '',
                continue_money: ''
              }
            ]
          }
        } else {
          this.form.id = form.id
          this.form.name = form.name
          this.form.first_unit = form.first_unit
          this.form.first_money = form.first_money
          this.form.continue_unit = form.continue_unit
          this.form.continue_money = form.continue_money
          var array = []
          var array1 = []
          form.regions.forEach(function(item) {
            array.push({
              id1: '',
              id2: '',
              id3: '',
              regionShow: true
            })
            array1.push({
              regions: [],
              regions2: [],
              regions3: []
            })
          })
          this.regionData = array1
          this.regionParam = array
          const that = this
          this.regionParam.forEach(function(item, index) {
            that.getRegion(form.regions[index].region_id, index)
          })
          this.form.regions = form.regions
        }
      },
      addRegion() {
        this.form.regions.push({
          id: 0,
          country_id: '',
          region_id: '',
          delete: '',
          first_unit: '',
          first_money: '',
          continue_unit: '',
          continue_money: '' })
        this.regionData.push(
          {
            regions: [],
            regions2: [],
            regions3: []
          }
        )
        this.regionParam.push({
          id1: '',
          id2: '',
          id3: '',
          regionShow: true
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .region-item{
    float: left;
    width: 120px;
  }
</style>
