<template>
   <div>
     <el-breadcrumb separator-class="el-icon-arrow-right">
       <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
       <el-breadcrumb-item>成绩报告</el-breadcrumb-item>
       <el-breadcrumb-item>个人成绩</el-breadcrumb-item>
       <h5 style="float: right; height: 13px;margin: 0px">当前登录用户：{{user.consumerName}}</h5>
     </el-breadcrumb>
     <el-card>
     <!-- 搜索与添加区域 -->
     <el-row :gutter="20">
       <el-col :span="8">
         <el-date-picker v-model="date" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期"
           end-placeholder="结束日期"
           align="right" value-format="yyyy-MM-dd HH:mm:ss" @change="GetzhifuTime()">
         </el-date-picker>
         <el-button type="primary" icon="el-icon-search" @click="getRecordList" style="margin-left: 10px"></el-button>
       </el-col>
     </el-row>
       <el-table :data="recordList" border>
         <el-table-column label="#" type="index"></el-table-column>
         <el-table-column label="问卷类型" prop="examType"></el-table-column>
         <el-table-column label="问卷得分" prop="mark"></el-table-column>
         <el-table-column label="答题时间" prop="time"></el-table-column>
         <el-table-column label="操作" width="80px">
           <template slot-scope="scope">
             <!--查看详情-->
             <el-tooltip effect="dark" content="查看详情" placement="top" :enterable="false">
               <el-button type="success" icon="el-icon-view" size="mini"  @click="showDetail(scope.row)"></el-button>
             </el-tooltip>
           </template>
         </el-table-column>
       </el-table>
       <!-- 分页区域 -->
       <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNum" :page-sizes="[5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
       </el-pagination>
     </el-card>

     <el-dialog title="试卷详情" :visible.sync="showDialogVisible" width="70%">
         <ul>
           <el-card :key="item.questionId" v-for="(item,index) in question.questionDetail" class="infinite-list-item">
             <h4 >{{index+1+'.'}}{{item.questionName}}</h4>
             <h4 style="margin-left: 12px">{{'A.'+item.questionOption[0]}}</h4>
             <h4 style="margin-left: 12px">{{'B.'+item.questionOption[1]}}</h4>
             <h4 style="margin-left: 12px">{{'C.'+item.questionOption[2]}}</h4>
             <h4 style="margin-left: 12px">{{'D.'+item.questionOption[3]}}</h4>
             <span style="margin-left: 12px;">用户答案：{{item.consumerOption}}</span>
             <span style="margin-left: 12px;">正确答案：{{item.correctAnswer}}</span>
             <span style="margin-left: 12px;">是否正确：</span>
             <span :style="colorStyle[index]">{{item.isCorrect}}</span>
           </el-card>
         </ul>
       <!-- 底部区域 -->
       <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showDialogVisible=false">关 闭</el-button>
      </span>
     </el-dialog>
   </div>
</template>

<script>
export default {
  data () {
    return {
      user: '',
      date: '',
      question: {},
      count: 0,
      showDialogVisible: false,
      colorStyle: [],
      // 获取答题记录列表的参数对象
      queryInfo: {
        consumerId: '',
        // 查询日期
        startDate: '',
        endDate: '',
        // 当前的页数
        pageNum: 1,
        // 当前每页显示多少条数据
        pageSize: 10
      },
      recordList: [],
      total: 0,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      }
    }
  },
  methods: {
    async getRecordList () {
      const { data: res } = await this.$http.get('record/findPage', {
        params: this.queryInfo
      })
      if (res.code !== 200) {
        return this.$message.error('获取答题记录列表失败！')
      }
      this.recordList = res.data.recordList
      this.total = res.data.total
    },
    // 监听 pagesize 改变的事件
    handleSizeChange (newSize) {
      // console.log(newSize)
      this.queryInfo.pageSize = newSize
      this.getRecordList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newPage) {
      this.queryInfo.pageNum = newPage
      this.getRecordList()
    },
    showDetail (list) {
      this.question = list
      for (let i = 0; i < list.questionDetail.length; i++) {
        if (list.questionDetail[i].isCorrect === '正确') {
          this.$set(this.colorStyle, i, { color: '#67C23A' })
        } else {
          this.$set(this.colorStyle, i, { color: 'red' })
        }
      }
      console.log(this.colorStyle)
      this.showDialogVisible = true
    },
    GetzhifuTime () {
      if (this.date != null) {
        this.queryInfo.startDate = this.date[0]
        this.queryInfo.endDate = this.date[1]
      } else {
        this.queryInfo.startDate = ''
        this.queryInfo.endDate = ''
      }
    }
  },
  created () {
    const user = JSON.parse(window.sessionStorage.getItem('user'))
    this.user = user
    this.queryInfo.consumerId = user.consumerId
    this.getRecordList()
  }

}
</script>

<style scoped>

</style>
