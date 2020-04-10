<template>
  <div class="register_container">
    <div class="register_form">
      <h3>注册</h3>
    <b-form @submit="onSubmit" v-if="show">
      <b-form-group label="昵称:" label-for="name"><!-- 有label-for,可以有历史记录 -->
        <b-form-input
          id="name"
          v-model="form.name"
          required
          placeholder="请输入昵称"
        ></b-form-input>
      </b-form-group>
      
      <b-form-group label="邮箱:" label-for="email"> <!-- <b-input-group>可以在一行显示 -->
        <b-form-input
          id="email"
          v-model="form.email"
          type="email"
          required
          placeholder="请输入邮箱"
        ></b-form-input>
      </b-form-group>

      <b-form-group label="验证码:" label-for="verify"><!-- 有label-for,可以有历史记录 -->
      <b-input-group>
        <b-form-input
          id="verify"
          v-model="form.verify"
          required
          placeholder="请输入验证码"
        ></b-form-input>
        <b-button pill size="sm" variant="outline-primary" v-if="verify_show" @click.prevent="sendVerify">发送验证码</b-button>
        <b-button pill size="sm" variant="outline-primary" disabled  v-else>{{this.verify_time}}s后重新发送</b-button>
      </b-input-group>
      </b-form-group>

      <b-form-group label="密码:" label-for="password"><!-- 有label-for,可以有历史记录 -->
        <b-form-input
          id="password"
          type="password"
          v-model="form.password"
          required
          placeholder="请输入密码"
        ></b-form-input>
      </b-form-group>

      <b-form-group label="确认密码:" label-for="checkpwd"><!-- 有label-for,可以有历史记录 -->
        <b-form-input
          id="checkpwd"
          type="password"
          v-model="form.checkpwd"
          required
          placeholder="请确认密码"
        ></b-form-input>
      </b-form-group>

      <b-button pill block type="submit" variant="primary">注册</b-button>
    </b-form>
    <b-link to="/login">已有账号？快去登录</b-link>
    </div>
  </div>
</template>

<script>
  export default {
    props:[''],
    data() {
      return {
        form: {
          name: '',
          email: '',
          verify:'',
          password:'',
          checkpwd:''
        },
        show: true,
        verify:'',
        verify_show:true,
        verify_time:60,
        time:''
      }
    },
    methods: {
      overTime(){//倒计时
        if(this.verify_time > 1){
          this.verify_show = false
          this.verify_time--
        }else{
          this.verify_show = true
          this.verify_time = 60
          clearInterval(this.time)
        }
      },
      sendVerify(){//变化button
        this.time = setInterval(()=>{
          this.overTime()
        },1000)
        this.$http.post('/user/getcode',{email:this.form.email}).then(res => {
          this.verify = res.data.randomVerify//获取验证码，前端验证
        })//发送验证码
        return this.verify_show
      },
      onSubmit(evt) {
        evt.preventDefault()
        if (this.form.name.length < 2 || this.form.name.length > 10) {
          this.message('danger','名字的长度不能小于2位且不超过10位')
        }else if (this.form.verify != this.verify) {
          this.message('danger','验证码不同')
        }else if ((this.form.password.length < 6||this.form.password.length > 20)||(this.form.checkpwd.length < 6||this.form.checkpwd.length > 20) ) {
          this.message('danger','密码长度不能小于6位且不超过20位')
        }else if (this.form.password != this.form.checkpwd) {
          this.message('danger','确认密码错误')
        }else{
        this.$http.post('/user/register',this.form).then(res => {//提交注册
          // 注册成功,弹出提示框
          this.message('success','注册成功')
          // 注册成功，页面跳转到登录页面
            this.$router.push('/login')
        }).catch(err => {
          // 注册失败,弹出提示框
          this.message('danger','注册失败')
        })
        }
      },
      message(type,msg){//bootstrap-vue,toast
          this.$root.$bvToast.toast(msg, {
          solid: true,
          toaster:'b-toaster-top-center',
          variant:type,
          appendToast: false
        })
      }
    },

    components: {
    },

    computed: {},

    created() {},
  }

</script>
<style lang='less' scoped>
.register_container{
  background: url('../assets/scenery5.jpg');
  background-size: cover;
  width: 100%;
  height: 100%;
  position: relative;
  .register_form{
    padding: 4vh 6vw;
    position: absolute;
    width: 30%;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    background-color: aliceblue;
    border-radius: 0.5rem;
    h3{
      text-align: center;
    }
    a{
      float: right;
      font-size: 16px;
    }
  }
}
</style>