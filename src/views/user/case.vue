<template>
  <div class="app-container">

    <el-table
      :data="list"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="gender"
        label="性别"
        width="180">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="电话">
      </el-table-column>
      <el-table-column
        prop="content"
        label="描述">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看文件</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="查看文件"
      :visible.sync="dialogVisible"
      width="50%">
      <el-card class="box-card">
        <div v-for="file in files"  class="text item">
          <a :href="api.adminApi + '/file/download/' + file.file_id" target="_blank"  style="color: #3a8ee6">
            <img v-if="file.file.ext ==='jpg' || file.file.ext === 'png' " :src="file.path" style="max-width:100% ">
            <div v-else>
              {{file.file.original_name}}
            </div>
          </a>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
  import caseApi from '@/api/case'
  import api from '@/api/api'
  export default {
    name: 'case',
    data() {
      return {
        list: [],
        files: [],
        dialogVisible: false,
        api: api,
        query: {
          user_id: 0
        }
      }
    },
    created() {
      this.query.user_id = this.$route.params.id
      this.getData()
    },
    watch: {
      '$route'(to, from) {
        this.getData()
      }
    },
    methods: {
      getData() {
        caseApi.list(this.query).then(response => {
          if (response) {
            this.list = response.data
          }
        })
      },
      handleClick(row) {
        this.files = row.files
        this.dialogVisible = true
      }
    }
  }
</script>

<style scoped>

</style>
