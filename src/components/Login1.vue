<template>
  <div id="bg">
    <div id="hint"><!-- 提示框 -->
      <p>登录失败</p>
    </div>
    <div id="login_wrap">
      <div id="login"><!-- 登录注册切换动画 -->
        <div id="status">
          <i style="top: 0">Log</i>
          <i style="right: 5px">in</i>
        </div>
        <span>
          <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
            <el-form-item class="form" prop="consumerName">
              <input autocomplete="off" type="text" id="user" placeholder="username" v-model="loginForm.consumerName">
            </el-form-item>
            <el-form-item class="form" prop="password">
              <input type="password" id="passwd" placeholder="password" v-model="loginForm.password">
            </el-form-item>
            <!--<el-form-item class="form" prop="password" style="display: inline-block;float: left">
                <input type="text" id="code" placeholder="验证码" v-model="loginForm.password" style="width: 63%;">
                  <VerificationCode :changeCode.sync='identifyCode' style="float: right"></VerificationCode>
            </el-form-item>-->
            <el-form-item>
              <input type="button" value="Login" class="btn" @click="login" style="margin-right: 20px;">
              <input type="button" value="Reset" class="btn" @click="resetLoginForm" id="btn">
            </el-form-item>
          </el-form>
        </span>
      </div>
      <div id="login_img"><!-- 图片绘制框 -->
        <span class="circle">
                    <span></span>
                    <span></span>
                </span>
        <span class="star">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
        <span class="fly_star">
                    <span></span>
                    <span></span>
                </span>
        <p id="title">食品安全在线测评系统</p>
      </div>
    </div>
  </div>
</template>
<script>
/* import VerificationCode from '../components/common/VerificationCode' */
export default {
  /* components: {
    VerificationCode
  }, */
  data () {
    return {
      identifyCode: '', // 当前生成的验证码
      // 这是登录表单的数据绑定对象
      loginForm: {
        consumerName: 'admin',
        password: 'admin'
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        consumerName: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginForm () {
      // console.log(this);
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/consumer/login', this.$qs.stringify(this.loginForm))
        if (!res.success) return this.$message.error('登录失败！')
        this.$message.success('登录成功')
        // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
        //   1.1 项目中出了登录之外的其他API接口，必须在登录之后才能访问
        //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
        window.sessionStorage.setItem('token', res.data.token)
        // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
        const user = JSON.stringify(res.data.consumer)
        window.sessionStorage.setItem('user', user)
        // 2. 通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
  *{
    margin: 0;
    padding: 0;
  }

  html,
  body {
    height: 100%;
  }

  @font-face {
    font-family: 'neo';
  }
  input:focus{
    outline: none;
  }
  .form input{
    width: 300px;
    height: 30px;
    font-size: 18px;
    background: none;
    border: none;
    border-bottom: 1px solid #fff;
    color: #fff;
    margin-bottom: 20px;
  }
  .form input::placeholder{
    color: rgba(255,255,255,0.8);
    font-size: 18px;
    font-family: "neo";
  }
  .confirm{
    height: 0;
    overflow: hidden;
    transition: .25s;
  }
  .btn{
    width:140px;
    height: 40px;
    border: 1px solid #fff;
    background: none;
    font-size:20px;
    color: #fff;
    cursor: pointer;
    margin-top: 25px;
    font-family: "neo";
    transition: .25s;
  }
  .btn:hover{
    background: rgba(255,255,255,.25);
  }
  #login_wrap{
    width: 980px;
    min-height: 500px;
    border-radius: 10px;
    font-family: "neo";
    overflow: hidden;
    box-shadow: 0px 0px 120px rgba(0, 0, 0, 0.25);
    position: fixed;
    top: 50%;
    right: 50%;
    margin-top: -250px;
    margin-right: -490px;
  }
  #login{
    width: 50%;
    height: 100%;
    min-height: 500px;
    background: linear-gradient(45deg, #9a444e, #e06267);
    position: relative;
    float: right;
  }
  #login #status{
    width: 90px;
    height: 40px;
    margin: 40px auto;
    color: #fff;
    font-size: 30px;
    font-weight: 600;
    position: relative;
    overflow: hidden;
  }
  #login #status i{
    font-style: normal;
    position: absolute;
    transition: .5s
  }
  #login span{
    text-align: center;
    position: absolute;
    left: 50%;
    margin-left: -150px;
    top: 52%;
    margin-top: -140px;
  }
  #login span a{
    text-decoration: none;
    color: #fff;
    display: block;
    margin-top: 80px;
    font-size: 18px;
  }
  #bg{
    background: linear-gradient(45deg, #211136, #bf5853);
    height: 100%;
  }
  /*绘图*/
  #login_img{
    width: 50%;
    min-height: 500px;
    background: linear-gradient(45deg, #221334, #6c3049);
    float: left;
    position: relative;
  }
  #login_img span{
    position: absolute;
    display: block;
  }
  #login_img .circle{
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: linear-gradient(45deg, #df5555, #ef907a);
    top: 70px;
    left: 50%;
    margin-left: -100px;
    overflow: hidden;
  }
  #login_img .circle span{
    width: 150px;
    height: 40px;
    border-radius: 50px;
    position: absolute;
  }
  #login_img .circle span:nth-child(1){
    top: 30px;
    left: -38px;
    background: #c55c59;
  }
  #login_img .circle span:nth-child(2){
    bottom: 20px;
    right: -35px;
    background: #934555;
  }
  #login_img .star span{
    background: radial-gradient(#fff 10%,#fff 20%,rgba(72, 34, 64, 0));
    border-radius: 50%;
    box-shadow: 0 0 7px #fff;
  }
  #login_img .star span:nth-child(1){
    width: 15px;
    height: 15px;
    top: 50px;
    left: 30px;
  }
  #login_img .star span:nth-child(2){
    width: 10px;
    height: 10px;
    left: 360px;
    top: 80px;
  }
  #login_img .star span:nth-child(3){
    width: 5px;
    height: 5px;
    top: 400px;
    left: 80px;
  }
  #login_img .star span:nth-child(4){
    width: 8px;
    height: 8px;
    top: 240px;
    left: 60px;
  }
  #login_img .star span:nth-child(5){
    width: 4px;
    height: 4px;
    top: 20px;
    left: 200px;
  }
  #login_img .star span:nth-child(6){
    width: 4px;
    height: 4px;
    top: 460px;
    left: 410px;
  }
  #login_img .star span:nth-child(7){
    width: 6px;
    height: 6px;
    top: 250px;
    left: 350px;
  }
  #login_img .fly_star span{
    width: 90px;
    height: 3px;
    background: -webkit-linear-gradient(left, rgba(255, 255, 255, 0.67), rgba(255,255,255,0));
    background: -o-linear-gradient(left, rgba(255, 255, 255, 0.67), rgba(255,255,255,0));
    background: linear-gradient(to right, rgba(255, 255, 255, 0.67), rgba(255,255,255,0));
    transform: rotate(-45deg);
  }
  #login_img .fly_star span:nth-child(1){
    top:60px;
    left: 80px;
  }
  #login_img .fly_star span:nth-child(2){
    top: 210px;
    left: 332px;
    opacity: 0.6;
  }
  #login_img p{
    text-align: center;
    color: white;
    font-weight: 600;
    margin-top: 365px;
    font-size: 25px;
  }
  #login_img p i{
    font-style: normal;
    margin-right: 45px;
  }
  #login_img p i:nth-last-child(1){
    margin-right: 0;
  }
  /*提示*/
  #hint{
    width: 100%;
    line-height: 70px;
    background: linear-gradient(-90deg, #9b494d, #bf5853);
    text-align: center;
    font-size: 25px;
    color: #fff;
    box-shadow: 0 0 20px #733544;
    display: none;
    opacity: 0;
    transition: .5s;
    position: absolute;
    top: 0;
    z-index: 999;
  }
  /* 响应式 */
  @media screen and (max-width:1000px ) {
    #login_img{
      display: none;
    }
    #login_wrap{
      width: 490px;
      margin-right: -245px;
    }
    #login{
      width: 100%;

    }
  }
  @media screen and (max-width:560px ) {
    #login_wrap{
      width: 330px;
      margin-right: -165px;
    }
    #login span{
      margin-left: -125px;
    }
    .form input{
      width: 250px;
    }
    .btn{
      width: 113px;
    }
  }
  @media screen and (max-width:345px ) {
    #login_wrap {
      width: 290px;
      margin-right: -145px;
    }
  }
  .el-form-item__error{
    color: yellow;
  }
  .code{
    display: inline-block;
  }
</style>
