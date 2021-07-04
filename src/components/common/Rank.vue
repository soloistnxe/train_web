<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>成绩报告</el-breadcrumb-item>
        <el-breadcrumb-item>成绩排名</el-breadcrumb-item>
        <h5 style="float: right; height: 13px;margin: 0px">当前登录用户：{{user.consumerName}}</h5>
      </el-breadcrumb>
      <el-card>
        <el-table :data="rank" border>
          <el-table-column label="#" type="index"></el-table-column>
          <el-table-column label="用户名" prop="consumerName"></el-table-column>
          <el-table-column label="答题次数" prop="count"></el-table-column>
          <el-table-column label="答题正确率" prop="accuracy"></el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      user: '',
      rank: []
    }
  },
  methods: {
    async getRankList () {
      const { data: res } = await this.$http.get('record/rank')
      if (res.code !== 200) {
        return this.$message.error('获取成绩排名列表失败！')
      }
      this.rank = res.data.rank
    }
  },
  created () {
    const user = JSON.parse(window.sessionStorage.getItem('user'))
    this.user = user
    this.getRankList()
  }
}
</script>

<style scoped>

</style>
