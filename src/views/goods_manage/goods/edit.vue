<template>
  <div class="app-container">

      <el-form :model="form"  ref="form">
        <el-tabs style='margin-top:15px;' v-model="activeName" type="border-card" @tab-click="handleClick">
          <el-tab-pane label="基本信息" key='base' name="base"  >
            <keep-alive>
              <div>
                <el-form-item label="ID" :label-width="formLabelWidth">
                  <el-input v-model="form.id" :disabled="true" auto-complete="off">
                  </el-input>
                </el-form-item>
                <el-form-item label="商品编码" :label-width="formLabelWidth">
                  <el-input v-model="form.goods_sn" :disabled="true" auto-complete="off">
                  </el-input>
                </el-form-item>
                <el-form-item label="商品名称" :label-width="formLabelWidth">
                  <el-input v-model="form.name"  auto-complete="off">
                  </el-input>
                </el-form-item>
                <el-form-item label="单位" :label-width="formLabelWidth">
                  <el-input v-model="form.unit"  auto-complete="off">
                  </el-input>
                </el-form-item>
                <el-form-item label="分类" :label-width="formLabelWidth">
                  <el-cascader
                    expand-trigger="hover"
                    :options="categories"
                    v-model="category"
                    @change="handleCategoryChange">
                  </el-cascader>
                </el-form-item>
                <el-form-item label="品牌" :label-width="formLabelWidth">
                  <el-select v-model="form.brand_id">
                    <el-option v-for="brand in brands"
                               :key="brand.id"
                               :label="brand.name"
                               :value="brand.id"
                               clearable filterable >

                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="发货地" :label-width="formLabelWidth">
                  <el-select v-model="form.country">
                    <el-option v-for="country in countries"
                               :key="country.id"
                               :label="country.name"
                               :value="country.id"
                               clearable filterable >

                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="运费模板" :label-width="formLabelWidth">
                  <el-select v-model="form.freight_template_id">
                    <el-option v-for="freight in freights"
                               :key="freight.id"
                               :label="freight.name"
                               :value="freight.id"
                               clearable filterable >

                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="封面" label-width="180px">
                  <el-upload
                    class="avatar-uploader"
                    :action="api.fileApi"
                    :show-file-list="false"
                    :headers="headers"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
                <el-form-item label="价格" :label-width="formLabelWidth">
                  <el-input v-model="form.price"  type="number" auto-complete="off">
                  </el-input>
                </el-form-item>
                <el-form-item label="市场价" :label-width="formLabelWidth">
                  <el-input v-model="form.market_price" type="number" auto-complete="off">
                  </el-input>
                </el-form-item>
                <el-form-item label="库存" :label-width="formLabelWidth">
                  <el-input v-model="form.store" type="number" auto-complete="off">
                  </el-input>
                </el-form-item>
                <el-form-item label="重量(g)" :label-width="formLabelWidth">
                  <el-input v-model="form.weight" type="number" auto-complete="off">
                  </el-input>
                </el-form-item>
                <el-form-item label="热卖" :label-width="formLabelWidth">
                  <el-switch
                    v-model="is_hot"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                  </el-switch>
                </el-form-item>
                <el-form-item label="新品" :label-width="formLabelWidth">
                  <el-switch
                    v-model="is_new"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                  </el-switch>
                </el-form-item>
                <el-form-item label="特价" :label-width="formLabelWidth">
                  <el-switch
                    v-model="is_special"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                  </el-switch>
                </el-form-item>
                <el-form-item label="推荐" :label-width="formLabelWidth">
                  <el-switch
                    v-model="is_recommend"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                  </el-switch>
                </el-form-item>
                <el-form-item label="处方药" :label-width="formLabelWidth">
                  <el-switch
                    v-model="rx"
                    active-color="#13ce66"
                    inactive-color="#ff4949">
                  </el-switch>
                </el-form-item>
                <el-form-item :label="$t('goods.content')" label-width="180px">
                  <q-editor v-model="form.content"></q-editor>
                </el-form-item>
              </div>

            </keep-alive>
          </el-tab-pane>
          <el-tab-pane label="说明书" key='instruction' name="instruction"  >
            <keep-alive>
              <div>
                <el-form-item label="说明书" :label-width="formLabelWidth">
                  <q-editor v-model="form.instruction">
                  </q-editor>
                </el-form-item>
              </div>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane label="相册" key="gallery" name="gallery">
            <keep-alive>
              <div>
                <el-form-item label="相册" label-width="180px">
                  <el-upload
                    :action="api.fileApi"
                    list-type="picture-card"
                    :file-list="imageList"
                    :on-success="imageHandleSuccess"
                    :headers="headers"
                  :on-remove="handleRemove">
                    <i class="el-icon-plus"></i>
                  </el-upload>
                </el-form-item>
              </div>

            </keep-alive>
          </el-tab-pane>
          <el-tab-pane label="模型" key="model" name="model">
            <keep-alive>
              <div>
                <el-form-item label="模型" label-width="180px">
                  <el-select v-model="form.model_id" filterable placeholder="请选择" @change="handleChange">
                    <el-option
                      v-for="item in models"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="属性" label-width="180px" v-loading="loading">
                  <template v-for="attribute in form.attrs" >
                    <el-row>
                      <el-col :span="8">
                        <el-col :span="10" :offset="4">
                          {{attribute.attribute_name}}
                        </el-col>
                        <el-col :span="10" >
                          <el-input v-model="attribute.attribute_value" auto-complete="off">
                          </el-input>
                        </el-col>
                      </el-col>
                    </el-row>
                  </template>
                </el-form-item>
                <el-form-item label="规格" label-width="180px" v-loading="loading">
                  <template v-for="specification in specifications" >
                    <el-form-item :label="specification.name" label-width="100px">
                      <el-checkbox-group v-model="specification[specification.id]" @change="handleCheckGroupChange">
                      <template v-for="item in specification.items">
                        <el-checkbox :label="item.id">{{item.name}}
                        </el-checkbox>
                      </template>
                      </el-checkbox-group>
                    </el-form-item>
                  </template>
                </el-form-item>
                <el-row v-loading="specItemsLoading">
                  <template v-for="item in form.specification_items" >
                    <el-form-item :label="item.name" label-width="180px" align="center">
                      <el-col :span="8">
                        <el-col :span="10">
                          价格
                        </el-col>
                          <el-col :span="10" :offset="4">
                            <el-input v-model="item.price" placeholder="价格"></el-input>
                          </el-col>


                      </el-col>
                     <el-col :span="8">
                       <el-col :span="10">
                         库存
                       </el-col>
                       <el-col :span="10" :offset="4">
                         <el-input v-model="item.store" placeholder="库存"></el-input>
                       </el-col>
                     </el-col>

                    </el-form-item>

                  </template>
                </el-row>
              </div>
            </keep-alive>
          </el-tab-pane>
          <el-tab-pane label="关联商品" key='relation' name="relation"  >
            <keep-alive>
              <div>
                <el-form-item label="关联商品" :label-width="formLabelWidth">
                  <el-select v-model="form.relations"
                             multiple
                             filterable
                             remote
                             reserve-keyword
                             placeholder="请输入关键词"
                             :remote-method="remoteMethod"
                             :loading="loading">
                    <el-option
                      v-for="item in goodsList"
                      :key="item.key"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>

              </div>
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
        <br>
        <el-row>
          <el-col :span="8" :offset="8" style="text-align : center">
            <el-button type="primary" @click="handleSave">保存</el-button>
          </el-col>

        </el-row>
      </el-form>

  </div>


</template>

<script>
  import api from '@/api/api'
  import goodsModel from '@/api/goodsModel'
  import goodsApi from '@/api/goods'
  import goodsCategoryApi from '@/api/goodsCategory'
  import QEditor from '@/components/QEditor/editor'
  import brandApi from '@/api/brand'
  import countryApi from '@/api/country'
  import freightApi from '@/api/freight'
  export default {
    components: {
      QEditor },
    name: 'goods_edit',
    data() {
      return {
        category: [],
        freights: [],
        oldModelId: 0,
        form: {
          id: '',
          goods_sn: '',
          name: '',
          price: '',
          market_price: '',
          cover: '',
          store: '',
          model_id: '',
          brand_id: '',
          category_id: 0,
          galleries: [],
          specification_items: [],
          specifications: [],
          attrs: [],
          unit: '',
          content: '',
          relations: [],
          is_hot: 0,
          is_new: 0,
          is_recommend: 0,
          is_special: 0,
          rx: 0,
          instruction: '',
          country: '',
          weight: '',
          freight_template_id: ''
        },
        is_hot: false,
        is_new: false,
        is_recommend: false,
        is_special: false,
        rx: false,
        api: api,
        tabMapOptions: [
          {
            label: '基本信息',
            key: 'base'
          },
          {
            label: '说明书',
            key: 'instruction'
          },
          {
            label: '相册',
            key: 'gallery'
          },
          {
            label: '模型',
            key: 'model'
          }
        ],
        formLabelWidth: '180px',
        activeName: 'base',
        imageUrl: '',
        imageList: [],
        models: [],
        specifications: [],
        loading: false,
        specLoading: false,
        specItemsLoading: false,
        specificationsParams: {
          model_id: 0,
          specifications: []
        },
        edit: false,
        categories: [],
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        goodsList: [],
        brands: [],
        countries: [],
        init: false
      }
    },
    created() {
      this.getCategories()
      this.setForm(null)
      this.getGoods()
      this.getRelations()
      this.getBrands()
      this.getCountries()
      this.getFreights()
    },
    watch: {
      '$route'(to, from) {
        this.init = false
        this.setForm(null)
        this.getGoods()
      },
      // 'form.model_id': {
      //   handler(n, o) {
      //     this.oldModelId = o
      //     console.log(n)
      //     console.log(o)
      //   },
      //   deep: true
      // },
      is_hot(n, old) {
        this.form.is_hot = n ? 1 : 0
      },
      is_new(n, old) {
        this.form.is_new = n ? 1 : 0
      },
      is_recommend(n, old) {
        this.form.is_recommend = n ? 1 : 0
      },
      is_special(n, old) {
        this.form.is_special = n ? 1 : 0
      },
      rx(n, old) {
        this.form.rx = n ? 1 : 0
      },
      categories(n, o) {
        this.category = this.getCategory(this.form.category_id)
      }
    },
    methods: {
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw)
        this.form.cover = res.path
      },
      beforeAvatarUpload(file) {
        // const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 5
        // if (!isJPG) {
        //   this.$message.error('上传头像图片只能是 JPG 格式!')
        // }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!')
        }
        return isLt2M
      },
      imageHandleSuccess(response, file, fileList) {
        this.imageList = fileList
        const array = []
        this.imageList.forEach(function(item) {
          array.push({ file_id: item.response.id, path: item.response.path })
        })
        this.form.galleries = array
      },
      handleRemove(file, fileList) {
        this.imageList.splice(this.imageList.indexOf(file), 1)
        this.form.galleries.splice(this.imageList.indexOf(file), 1)
      },
      handleClick(tab, event) {
        if (tab.name === 'model') {
          goodsModel.list().then(response => {
            if (response.data && response.data.length > 0) {
              const items = []
              response.data.forEach(function(item) {
                items.push({ label: item.name, value: item.id })
              })
              this.models = items
            }
          })
        }
      },
      handleChange(value) {
        this.loading = true
        this.specLoading = true
        this.specificationsParams.model_id = value
        this.getModel(value)
      },
      handleCategoryChange(value) {
        this.form.category_id = value[value.length - 1]
        console.log(value)
        console.log(this.form.category_id)
      },
      getModel(id) {
        const that = this
        goodsModel.get(id).then(response => {
          const data = response.data
          const array = []
          if (data.attrs.length > 0) {
            data.attrs.forEach(function(item) {
              var value = ''
              if (that.edit) {
                that.form.attrs.forEach(function(attr) {
                  if (item.id === attr.attribute_id) {
                    value = attr.attribute_value
                  }
                })
              }
              const attribute = {
                attribute_id: item.id,
                attribute_name: item.name,
                attribute_value: value
              }
              array.push(attribute)
            })
          }
          that.form.attrs = array

          const array1 = []
          var oldSpec = []
          if (data.specifications.length > 0) {
            data.specifications.forEach(function(specification) {
              if (that.edit) {
                console.log(that.oldModelId)
                console.log(that.form.model_id)
                if (that.oldModelId !== that.form.model_id) {
                  specification[specification.id] = []
                } else {
                  that.form.specifications.forEach(function(item) {
                    oldSpec.push(item.id)
                    if (specification.id === item.id) {
                      console.log(item)
                      if (item.items) {
                        var array2 = []
                        item.items.forEach(function(a) {
                          console.log(a)
                          array2.push(a.id)
                        })
                        console.log(array2)
                        that.$set(specification, specification.id, array2)
                        console.log(specification[specification.id])
                      }
                    }
                  })
                }
              } else {
                specification[specification.id] = []
              }
              array1.push(specification)
            })
            that.specifications = array1
            console.log(that.specifications[0])
            data.specifications.forEach(function(specification, index) {
              if (oldSpec.indexOf(specification) < 0) {
                specification[specification.id] = []
                that.$set(that.specifications, index, specification)
              }
            })
            console.log(that.specifications)
          } else {
            that.specifications = []
          }
          that.loading = false
          if (!that.init) {
            that.init = true
          }
        })
      },
      handleCheckGroupChange(values) {
        const array = []

        this.specifications.forEach(function(item) {
          console.log(item)
          const specification = {
            id: item.id,
            items: item[item.id] ? item[item.id] : [],
            values
          }
          array.push(specification)
        })
        this.specificationsParams.specifications = array
        const that = this
        that.specItemsLoading = true
        that.form.specifications = this.specificationsParams.specifications
        goodsApi.createSpecificationParams(this.specificationsParams).then(response => {
          const array = []
          if (response) {
            response.forEach(function(item) {
              array.push({
                key: item.key,
                name: item.name,
                store: 0,
                price: 0
              })
            })
          }
          that.form.specification_items = array
          that.specItemsLoading = false
        })
      },
      setForm(form) {
        if (form === null) {
          this.form = {
            id: '',
            goods_sn: '',
            name: '',
            price: '',
            market_price: '',
            cover: '',
            store: '',
            model_id: '',
            category_id: 0,
            galleries: [],
            specification_items: [],
            specifications: [],
            unit: '',
            brand_id: '',
            attrs: [],
            relations: [],
            content: '',
            is_hot: 0,
            is_new: 0,
            is_recommend: 0,
            is_special: 0,
            rx: 0,
            instruction: '',
            country: '',
            weight: '',
            freight_template_id: ''
          }
          this.is_hot = false
          this.is_new = false
          this.is_recommend = false
          this.is_special = false
          this.rx = false
          this.imageUrl = ''
          this.category = []
          this.oldModelId = 0
        } else {
          this.form = {
            id: form.id,
            goods_sn: form.goods_sn,
            name: form.name,
            price: form.price,
            market_price: form.market_price,
            cover: api.getFileUrl(form.cover),
            store: form.store,
            model_id: form.model_id,
            category_id: form.category_id,
            galleries: form.galleries,
            specification_items: form.specification_items,
            specifications: form.specifications,
            attrs: form.attrs,
            relations: form.relations || [],
            is_new: form.is_new,
            is_hot: form.is_hot,
            is_recommend: form.is_recommend,
            is_special: form.is_special,
            content: form.content,
            rx: form.rx,
            unit: form.unit,
            instruction: form.instruction,
            brand_id: form.brand_id,
            country: form.country === 0 ? '' : form.country,
            weight: form.weight,
            freight_template_id: form.freight_template_id === 0 ? '' : form.freight_template_id
          }
          this.specificationsParams.model_id = form.model_id
          this.oldModelId = form.model_id
          this.is_hot = form.is_hot === 1
          this.is_new = form.is_new === 1
          this.is_recommend = form.is_recommend === 1
          this.is_special = form.is_special === 1
          this.rx = form.rx === 1
          this.imageUrl = form.cover
          this.category = this.getCategory(form.category_id)
        }
      },
      handleSave() {
        const that = this
        goodsApi.save(this.form).then(function(response) {
          if (response) {
            that.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 1500
            })
            that.setForm(null)
            that.imageUrl = ''
            that.imageList = []
          }
        })
      },
      getCategory(id) {
        var array = []
        this.categories.forEach(function(item) {
          if (item.value === id) {
            array.push(item.value)
          }
          if (item.children) {
            item.children.forEach(function(child) {
              if (child.value === id) {
                array.push(item.value)
                array.push(child.value)
              }
              if (child.children) {
                child.children.forEach(function(d) {
                  if (d.value === id) {
                    array.push(item.value)
                    array.push(child.value)
                    array.push(d.value)
                  }
                })
              }
            })
          }
        })
        return array
      },
      getFreights() {
        freightApi.list({ all: 1 }).then(response => {
          if (response) {
            this.freights = response.data
          }
        })
      },
      getCountries() {
        countryApi.list({ all: 1 }).then(response => {
          if (response) {
            this.countries = response.data
          }
        })
      },
      getCategories() {
        const that = this
        goodsCategoryApi.tree(null).then(response => {
          that.categories = response
          if (response) {
            var array = []
            response.forEach(function(item) {
              const option = { label: item.name, value: item.id }
              if (item.child.length > 0) {
                var children1 = []
                item.child.forEach(function(child) {
                  const op = { label: child.name, value: child.id }
                  if (child.child.length > 0) {
                    var children2 = []
                    child.child.forEach(function(d) {
                      const o = { label: d.name, value: d.id }
                      children2.push(o)
                    })
                    op.children = children2
                  }
                  children1.push(op)
                })
                option.children = children1
              }
              array.push(option)
            })
            that.categories = array
          }
        })
      },
      getBrands() {
        brandApi.list({ all: 1 }).then(response => {
          this.brands = response.data
        })
      },
      getGoods() {
        const id = this.$route.params.id
        if (id && id !== '0' && id !== ':id' && id !== 0) {
          this.edit = true
          const that = this
          goodsApi.get(id).then(response => {
            if (response) {
              that.setForm(response.data)
              that.getModel(response.data.model_id)
              var array = []
              if (response.data.galleries.length > 0) {
                response.data.galleries.forEach(function(item) {
                  array.push({ name: item.id, url: item.path })
                  that.imageList = array
                })
              }
            }
          })
        }
      },
      remoteMethod(query) {
        const that = this
        goodsApi.list({ q: query }).then(response => {
          const data = []
          if (response) {
            response.data.forEach((item) => {
              data.push({
                label: item.name,
                key: item.id,
                value: item.id
              })
            })
          }
          that.goodsList = data
          return data
        })
      },
      getRelations(id) {
        id = id || this.$route.params.id
        if (id && id !== '0' && id !== ':id' && id !== 0) {
          const that = this
          goodsApi.relations(id).then(response => {
            if (response) {
              var array = []
              var array1 = []
              response.data.forEach(function(item) {
                array.push(item.relation_goods_id)
                array1.push({ key: item.relation_goods_id, label: item.goods_name, value: item.relation_goods_id })
              })
              that.goodsList = array1
              that.form.relations = array
            } else {
              that.$set(that.form, 'relations', [])
            }
          })
        }
      },
      change(value) {
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
