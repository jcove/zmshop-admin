<template>
  <div>
    <!-- 图片上传组件辅助-->
    <el-upload
      class="image-uploader image-uploader2"
      :action="serverUrl"
      name="file"
      :headers="header"
      :show-file-list="false"
      :on-success="uploadSuccess2"
      :on-error="uploadError2"
      :before-upload="beforeUpload2">
    </el-upload>
    <div class="quill-editor" v-loading="quillUpdateImg">
      <slot name="toolbar"></slot>
      <div ref="editor2"></div>
    </div>
  </div>

</template>

<script>
  // require sources
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import _Quill from 'quill'
  import defaultOptions from './options'
  import api from '@/api/api'
  const Quill = window.Quill || _Quill

  // pollfill
  if (typeof Object.assign !== 'function') {
    Object.defineProperty(Object, 'assign', {
      value(target, varArgs) {
        if (target == null) {
          throw new TypeError('Cannot convert undefined or null to object')
        }
        const to = Object(target)
        for (let index = 1; index < arguments.length; index++) {
          const nextSource = arguments[index]
          if (nextSource != null) {
            for (const nextKey in nextSource) {
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey]
              }
            }
          }
        }
        return to
      },
      writable: true,
      configurable: true
    })
  }

  // export
  export default {
    name: 'QEditor',
    data() {
      return {
        _options: {},
        _content: '',
        defaultOptions,
        quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
        serverUrl: api.fileApi,
        header: { 'X-Requested-With': 'XMLHttpRequest' }
      }
    },
    props: {
      content: String,
      value: String,
      disabled: {
        type: Boolean,
        default: false
      },
      options: {
        type: Object,
        required: false,
        default: () => ({})
      },
      globalOptions: {
        type: Object,
        required: false,
        default: () => ({})
      }
    },
    mounted() {
      this.initialize()
    },
    beforeDestroy() {
      this.q = null
      delete this.q
    },
    methods: {
      // Init Quill instance
      initialize() {
        if (this.$el) {
          // Options
          this._options = Object.assign({}, this.defaultOptions, this.globalOptions, this.options)

          // Instance
          this.q = new Quill(this.$refs.editor2, this._options)
          this.q.enable(false)

          // Set editor content
          if (this.value || this.content) {
            this.q.pasteHTML(this.value || this.content)
          }

          // Disabled editor
          if (!this.disabled) {
            this.q.enable(true)
          }

          // Mark model as touched if editor lost focus
          this.q.on('selection-change', range => {
            if (!range) {
              this.$emit('blur', this.q)
            } else {
              this.$emit('focus', this.q)
            }
          })

          // Update model if text changes
          this.q.on('text-change', (delta, oldDelta, source) => {
            let html = this.$refs.editor2.children[0].innerHTML
            const q = this.q
            const text = this.q.getText()
            if (html === '<p><br></p>') html = ''
            this._content = html
            this.$emit('input', this._content)
            this.$emit('change', { html, text, q })
          })

          // Emit ready event
          this.$emit('ready', this.q)
        }
      },
      beforeUpload2() {
        // 显示loading动画
        this.quillUpdateImg = true
      },

      uploadSuccess2(res, file) {
        // res为图片服务器返回的数据
        // 获取富文本组件实例
        const q = this.q
        // 如果上传成功
        // 获取光标所在位置
        const length = q.getSelection().index
        // 插入图片  res.info为服务器返回的图片地址
        q.insertEmbed(length, 'image', api.getFileUrl(res.path))
        // 调整光标到最后
        q.setSelection(length + 1)
        // loading动画消失
        this.quillUpdateImg = false
      },

      // 富文本图片上传失败
      uploadError2() {
        // loading动画消失
        this.quillUpdateImg = false
        this.$message.error('图片插入失败')
      }
    },
    watch: {
      // Watch content change
      content(newVal, oldVal) {
        if (this.q) {
          if (newVal && newVal !== this._content) {
            this._content = newVal
            this.q.pasteHTML(newVal)
          } else if (!newVal) {
            this.q.setText('')
          }
        }
      },
      // Watch content change
      value(newVal, oldVal) {
        if (this.q) {
          if (newVal && newVal !== this._content) {
            this._content = newVal
            this.q.pasteHTML(newVal)
          } else if (!newVal) {
            this.q.setText('')
          }
        }
      },
      // Watch disabled change
      disabled(newVal, oldVal) {
        if (this.q) {
          this.q.enable(!newVal)
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  .quill-editor{

  }
</style>
