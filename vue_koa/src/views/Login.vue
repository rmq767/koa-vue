<template>
  <div class="login_container">
    <div class="login_form">
    <h3>登录</h3>
    <b-form @submit="onSubmit" v-if="show">
      <b-form-group label="邮箱:" label-for="email"> <!-- <b-input-group>可以在一行显示 -->
        <b-form-input
          id="email"
          v-model="form.email"
          type="email"
          required
          placeholder="请输入邮箱"
        ></b-form-input>
      </b-form-group>

      <b-form-group label="密码:" label-for="password">
        <b-form-input
          id="password"
          type="password"
          v-model="form.password"
          required
          placeholder="请输入密码"
        ></b-form-input>
      </b-form-group>
    
      <b-form-group label="验证码:" label-for="code">
      <b-input-group>
        <b-form-input
          id="code"
          v-model="form.code"
          required
          placeholder="请输入验证码"
        ></b-form-input>
        <div @click="refreshCode">
          <Identify :identifyCode="identifyCode"></Identify>
        </div>
      </b-input-group>
      </b-form-group>
    
      <b-form-group>
        <b-form-checkbox
          v-model="checked"
        >
          记住密码
        </b-form-checkbox>
      </b-form-group>
    
      <b-button pill block type="submit" variant="primary">登录</b-button>
    </b-form>
    <b-link to="/register">没有账号？快去注册</b-link>
    </div>
  </div>
</template>

<script>
import jwt_decode from 'jwt-decode'
import Identify from '../plugin/verify.vue'
  export default {
    props:[''],
    data() {
      return {
        form: {
          email: '',
          password:'',
          code: ''
        },
        show: true,
        identifyCodes: '1234567890abcdefjhijklinopqrsduvwxyz',
        identifyCode: '',
        checked: false
      }
    },
    methods: {
      onSubmit(evt) {
        evt.preventDefault()
        if (this.form.code.toLowerCase() !== this.identifyCode.toLowerCase()) {
          this.message('danger','登录失败')
          this.refreshCode()
          return
        }else{
           this.$http.post('/user/login',this.form).then(res => {
            // 拿到token，保存到localStorage
            const {token} = res.data
            localStorage.setItem('eleToken',token)
            // 解析token
            const decode = jwt_decode(token)
            // token存储到vuex中
            this.$store.dispatch('setAuthenticated', !this.isEmpty(decode))
            this.$store.dispatch('setUser', decode)
            // 这里存储的东西一刷新就会掉，所以要在App.vue中也存储一遍

            // 登录成功，页面跳转到登录页面
            this.$router.push('/admin')
            
            if (this.checked == true) {
            //传入账号名，密码，和保存天数3个参数
              this.setCookie(this.form.email, this.form.password, 7);
            }else{
              this.clearCookie()
            }
          }).catch(err => {
            // 登录失败,弹出提示框
            this.message('danger','登录失败')
          })
        }
      },
    
      //设置cookie
      setCookie(c_email, c_pwd, exdays) {
          var exdate = new Date(); //获取时间
          exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays); //保存的天数
          //字符串拼接cookie
          window.document.cookie = "email" + "=" + c_email + ";path=/;expires=" + exdate.toGMTString();
          window.document.cookie = "password" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
      },
      //读取cookie
      getCookie: function() {
          if (document.cookie.length > 0) {
              var arr = document.cookie.split('; '); //这里显示的格式需要切割一下自己可输出看下
              for (var i = 0; i < arr.length; i++) {
                  var arr2 = arr[i].split('='); //再次切割
                  //判断查找相对应的值
                  if (arr2[0] == 'email') {
                    //  console.log(arr2[1])
                      this.form.email = arr2[1]; //保存到保存数据的地方
                  } else if (arr2[0] == 'password') {
                    // console.log(arr2[1])
                      this.form.password = arr2[1];
                  }
              }
               this.checked = true;
          }
      },
      //清除cookie
      clearCookie: function() {
          this.setCookie("", "", -1); //修改2值都为空，天数为负1天就好了
      },
      message(type,msg){//bootstrap-vue,toast
          this.$root.$bvToast.toast(msg, {
          solid: true,
          toaster:'b-toaster-top-center',
          variant:type,
          appendToast: false
        })
      },
      isEmpty(value){
          return (
              value === undefined ||
              value === null ||
              (typeof value === 'object' && Object.keys(value).length === 0) ||
              (typeof value === 'string' && value.trim().length === 0)
          )
      },
        // 重置验证码
      refreshCode () {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
      },
      makeCode (o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)]
      }
      },
      randomNum (min, max) {
      return Math.floor(Math.random() * (max - min) + min)
      },
    },
    
    components: {
      Identify,
    },
    
    computed: {
    },
    
    mounted() {
      // 初始化验证码
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
      
      this.getCookie()
    },
  }

</script>
<style lang='less' scoped>
.login_container{
  background: url('../assets/scenery5.jpg');
  background-size: cover;
  width: 100%;
  height: 100%;
  position: relative;
  .login_form{
    padding: 4vh 6vw;
    position: absolute;
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