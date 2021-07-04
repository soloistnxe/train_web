<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>题目管理</el-breadcrumb-item>
      <el-breadcrumb-item>题目列表</el-breadcrumb-item>
      <h5 style="float: right; height: 13px;margin: 0px">当前登录用户：{{user.consumerName}}</h5>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入题干条件" v-model="queryInfo.query" clearable @clear="getQuestionList">
            <el-button slot="append" icon="el-icon-search" @click="getQuestionList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加题目</el-button>
        </el-col>
      </el-row>

      <!-- 题目列表区域 -->
      <el-table :data="questionList" border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="题干条件" prop="questionName" width="1100px"></el-table-column>
        <el-table-column label="所属类别" prop="questionTypeName"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!--查看详情-->
            <el-tooltip effect="dark" content="查看详情" placement="top" :enterable="false">
              <el-button type="success" icon="el-icon-view" size="mini"  @click="showDetail(scope.row)"></el-button>
            </el-tooltip>
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini"  @click="removeQuestionById(scope.row.questionId)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNum" :page-sizes="[5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
   <!--添加题目-->
    <el-dialog title="添加题目" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addQuestionForm" :rules="addQuestionFormRules" ref="addQuestionFormRef" label-width="80px">
        <el-form-item label="题干条件" prop="questionName">
          <el-input type="textarea" :rows="2" v-model="addQuestionForm.questionName"></el-input>
        </el-form-item>
        <el-form-item label="题目类型" prop="questionTypeId">
          <el-select v-model="addQuestionForm.questionTypeId" placeholder="请选择">
            <el-option v-for="item in questionTypeList" :key="item.questionTypeId" :label="item.questionTypeName" :value="item.questionTypeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-for="(item,index) in addQuestionForm.questionOption" :label="'选项' + String.fromCharCode(index+65)" :key="index" :prop= "'questionOption.'+index" :rules="addQuestionFormRules.questionOption">
          <el-input v-model="addQuestionForm.questionOption[index]" style="width: 80%"></el-input><el-button @click.prevent="removeDomain(index)" style="margin: 0px 0px 0px 10px">删除</el-button>
        </el-form-item>
        <el-form-item label="题目答案" prop="answer">
          <el-input v-model="addQuestionForm.answer" style="width: 220px"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
          <el-button @click="addDomain">新增选项</el-button>
          <el-button @click="resetForm('addQuestionFormRef')">重置</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addQuestion()">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="题目信息详情" :visible.sync="showDialogVisible" width="50%">
      <el-form :model="question"  ref="showFormRef" label-width="80px">
        <el-form-item label="题目编号" prop="questionId">
          <el-input v-model="question.questionId" readonly></el-input>
        </el-form-item>
        <el-form-item label="题目题干" prop="questionName">
          <el-input type="textarea" :rows="2" v-model="question.questionName" readonly></el-input>
        </el-form-item>
        <el-form-item label="题目类型" prop="questionTypeName">
          <el-input v-model="question.questionTypeName" readonly></el-input>
        </el-form-item>
        <el-form-item v-for="(item,index) in question.questionOption" :label="'选项' + (index+1)" :prop= item :key="index">
          <el-input v-model="question.questionOption[index]" readonly></el-input>
        </el-form-item>
        <el-form-item label="题目答案" prop="answer" style="width: 220px">
          <el-input v-model="question.answer" readonly></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改题目信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editQuestionFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="题干条件">
          <el-input type="textarea" :rows="2" v-model="editForm.questionName"></el-input>
        </el-form-item>
        <el-form-item label="题目类型" prop="questionTypeId">
          <el-select v-model="editForm.questionTypeId" placeholder="请选择">
            <el-option v-for="item in questionTypeList" :key="item.questionTypeId" :label="item.questionTypeName" :value="item.questionTypeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-for="(item,index) in editForm.questionOption" :label="'选项' + String.fromCharCode(index+65)" :key="index" :prop= "'questionOption.'+index" :rules="editQuestionFormRules.questionOption">
          <el-input v-model="editForm.questionOption[index]" style="width: 80%"></el-input><el-button @click.prevent="removeDomain(index)" style="margin: 0px 0px 0px 10px">删除</el-button>
        </el-form-item>
        <el-form-item label="题目答案" prop="answer">
          <el-input v-model="editForm.answer" style="width: 220px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editQuestionInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: '',
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pageNum: 1,
        // 当前每页显示多少条数据
        pageSize: 10
      },
      total: 0,
      questionList: [],
      questionTypeList: [],
      question: {},
      // 控制添加题目对话框的显示与隐藏
      addDialogVisible: false,
      // 控制查看题目详情的显示与隐藏
      showDialogVisible: false,
      // 添加题目的表单数据
      addQuestionForm: {
        questionName: '',
        questionTypeId: '',
        questionOption: ['', '', '', ''],
        answer: ''
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 添加表单的验证规则对象
      addQuestionFormRules: {
        questionName: [
          { required: true, message: '请输入题目题干条件', trigger: 'blur' }
        ],
        answer: [
          { required: true, message: '请输入题目答案', trigger: 'blur' }
        ],
        questionTypeId: [
          { required: true, message: '请选择题目类别', trigger: 'blur' }
        ],
        questionOption: [
          { required: true, message: '请输入题目选项', trigger: 'blur' }
        ]
      },
      // 修改表单的验证规则对象
      editQuestionFormRules: {
        questionName: [
          { required: true, message: '请输入题目题干条件', trigger: 'blur' }
        ],
        answer: [
          { required: true, message: '请输入题目答案', trigger: 'blur' }
        ],
        questionTypeId: [
          { required: true, message: '请选择题目类别', trigger: 'blur' }
        ],
        questionOption: [
          { required: true, message: '请输入题目选项', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    const user = JSON.parse(window.sessionStorage.getItem('user'))
    this.user = user
    this.getQuestionList()
    this.getQuestionTypeList()
  },
  methods: {
    async getQuestionList () {
      const { data: res } = await this.$http.get('question/findPage', {
        params: this.queryInfo
      })
      if (res.code !== 200) {
        return this.$message.error('获取用户列表失败！')
      }
      this.questionList = res.data.question
      this.total = res.data.total
    },
    async getQuestionTypeList () {
      const { data: res } = await this.$http.get('question/findQuestionType')
      if (res.code !== 200) {
        return this.$message.error('获取题目类型列表失败！')
      }
      this.questionTypeList = res.data.questionType
    },
    // 监听 pagesize 改变的事件
    handleSizeChange (newSize) {
      // console.log(newSize)
      this.queryInfo.pageSize = newSize
      this.getQuestionList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getQuestionList()
    },
    showDetail (list) {
      this.question = list
      this.showDialogVisible = true
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新题目
    addQuestion () {
      this.$refs.addQuestionFormRef.validate(async valid => {
        if (!valid) return
        // 可以发起添加用户的网络请求
        const { data: res } = await this.$http.post('question/insertQuestion', this.$qs.stringify(this.addQuestionForm))

        if (res.code !== 200) {
          this.$message.error('添加题目失败！')
        } else {
          this.$message.success('添加题目成功！')
        }
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        // 重置表单
        this.resetForm('addQuestionFormRef')
        // 重新获取用户列表数据
        this.getQuestionList()
      })
    },
    addDomain () {
      this.addQuestionForm.questionOption.push('')
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      for (let i = 0; i < this.addQuestionForm.questionOption.length; i++) {
        this.$set(this.addQuestionForm.questionOption, i, '')
      }
    },
    removeDomain (index) {
      if (index !== -1) {
        this.addQuestionForm.questionOption.splice(index, 1)
      }
    },
    // 展示编辑用户的对话框
    async showEditDialog (item) {
      this.editForm = item
      this.editDialogVisible = true
    },
    // 监听修改题目对话框的关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改题目信息并提交
    editQuestionInfo () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改题目信息的数据请求
        const { data: res } = await this.$http.post(
          'question/updateQuestion', this.$qs.stringify(this.editForm))
        console.log(this.editForm)
        if (res.code !== 200) {
          return this.$message.error('更新题目信息失败！')
        }

        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getQuestionList()
        // 提示修改成功
        this.$message.success('更新题目信息成功！')
      })
    },
    // 根据Id删除对应的用户信息
    async removeQuestionById (questionId) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该题目, 是否继续?',
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
        return this.$message.info('已取消删除')
      }
      console.log(questionId)
      const { data: res } = await this.$http.get('question/deleteQuestion/' + questionId)

      if (res.code !== 200) {
        return this.$message.error('删除用户失败！')
      } else {
        this.$message.success('删除用户成功！')
      }
      this.getQuestionList()
    }

  }
}
</script>

<style scoped>

</style>
