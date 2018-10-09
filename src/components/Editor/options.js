const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],
  [{ 'script': 'sub' }, { 'script': 'super' }],
  [{ 'indent': '-1' }, { 'indent': '+1' }],

  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': [] }],
  [{ 'align': [] }],
  ['link', 'image', 'video'],
  ['clean']
]
export default {
  theme: 'snow',
  boundary: document.body,
  modules: {
    toolbar: {
      container: toolbarOptions,
      handlers: {
        'image': function(value) {
          if (value) {
            // 触发input框选择图片文件
            document.querySelector('.image-uploader input').click()
          } else {
            this.quill.format('image', false)
          }
        }
      }
    }
  },
  placeholder: 'Insert text here ...',
  readOnly: false
}
