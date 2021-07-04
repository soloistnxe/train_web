<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户答题</el-breadcrumb-item>
      <el-breadcrumb-item>推荐问卷</el-breadcrumb-item>
      <h5 style="float: right; height: 13px;margin: 0px">当前登录用户：{{user.consumerName}}</h5>
    </el-breadcrumb>
    <el-card>
      <el-form label-position="left" v-model="commitForm.questionDetail">
        <el-form-item :key="index" v-for="(item,index) in questionList" :label="(index+1) + '.'+item.questionName">
          <br>
          <el-radio-group v-model="commitForm.questionDetail[index].consumerOption">
            <div style="margin-top: 10px">
              <el-radio label='A'>A.{{item.questionOption[0]}}</el-radio>
            </div>
            <div style="margin-top: 10px">
              <el-radio label='B'>B.{{item.questionOption[1]}}</el-radio>
            </div>
            <div style="margin-top: 10px">
              <el-radio label='C'>C.{{item.questionOption[2]}}</el-radio>
            </div>
            <div style="margin-top: 10px">
              <el-radio label='D'>D.{{item.questionOption[3]}}</el-radio>
            </div>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <el-button style="margin-left: 790px" type="primary" @click="commit()">提交</el-button>

      <el-dialog
        title="提示"
        :visible.sync="show"
        width="30%"
      >
        <span>系统正在判卷，请等待</span>
        <span style="color: red">{{count}}</span>
        <span>秒后从个人成绩模块中查看试卷详情！</span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      count: '', // 倒计时
      user: '',
      show: false,
      commitForm: {
        consumerId: '',
        questionDetail: [{
          questionId: '',
          questionName: '',
          questionOption: [],
          correctAnswer: '',
          consumerOption: ''
        }],
        examType: '推荐问卷'
      },
      questionList: [
        {
          questionId: '',
          questionName: '',
          questionOption: [],
          answer: ''
        }
      ]
    }
  },
  methods: {
    async commit () {
      // 弹框询问用户是否删除数据
      var message = '此操作将提交试卷, 是否继续?'
      for (let i = 0; i < this.commitForm.questionDetail.length; i++) {
        if (this.$options.methods.isEmpty(this.commitForm.questionDetail[i].consumerOption)) {
          message = '还有题目尚未解答, 是否继续交卷?'
        }
      }
      const confirmResult = await this.$confirm(
        message,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消交卷')
      }
      var data = JSON.stringify(this.commitForm)
      const { data: res } = await this.$http.post('exam/commit', data, { headers: { 'Content-type': 'application/json' } })
      if (res.code !== 200) {
        this.$message.error('交卷失败！')
      } else {
        /* this.$notify({
            title: '交卷成功',
            message: '请等待自动跳转3秒'
          }) */
        this.show = true
        const TIME_COUNT = 3
        if (!this.timer) {
          this.count = TIME_COUNT
          this.timer = setInterval(() => {
            if (this.count > 0 && this.count <= TIME_COUNT) {
              this.count--
            } else {
              clearInterval(this.timer)
              this.timer = null
              // 跳转的页面写在此处
              this.$router.push({
                path: '/record'
              })
            }
          }, 1000)
        }
      }
    },
    async getRecommendQuestion (companyId) {
      const { data: res } = await this.$http.get('exam/recommend/' + companyId)
      if (res.code !== 200) {
        this.$message.error('推荐问卷生成失败！')
        this.$message.error(res.message)
        window.sessionStorage.removeItem('activePath')
        this.$router.push({
          path: '/welcome'
        })
        return
      }
      this.questionList = res.data.questionList
      this.commitForm.consumerId = this.user.consumerId
      for (let i = 0; i < this.questionList.length; i++) {
        this.$set(this.commitForm.questionDetail, i,
          { questionId: this.questionList[i].questionId,
            questionName: this.questionList[i].questionName,
            questionOption: this.questionList[i].questionOption,
            consumerOption: '',
            correctAnswer: this.questionList[i].answer })
      }
    },
    isEmpty (strIn) {
      if (strIn === undefined) {
        return true
      } else if (strIn === null) {
        return true
      } else if (strIn === '') {
        return true
      } else {
        return false
      }
    }
  },
  created () {
    const user = JSON.parse(window.sessionStorage.getItem('user'))
    this.user = user
    this.getRecommendQuestion(user.consumerCompany)
  }
}
</script>

<style scoped>
  .el-radio /deep/ .el-radio__label{
    font-size:16px;
  }
  .el-form /deep/ .el-form-item__label {
    font-size: 16px;
    width: 100%;
    height: auto;
    word-wrap:break-word;
    word-break:break-all;
    overflow: hidden;
    float: left;
  }
</style>
