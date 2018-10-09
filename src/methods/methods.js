export function beforeUploadImage(file) {
  // const isJPG = file.type === 'image/jpeg'
  const isLt2M = file.size / 1024 / 1024 < 5
  // if (!isJPG) {
  //   this.$message.error('上传头像图片只能是 JPG 格式!')
  // }
  if (!isLt2M) {
    this.$message.error('上传图片大小不能超过 2MB!')
  }
  return isLt2M
}
