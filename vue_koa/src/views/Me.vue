<template>
    <b-container fluid>
    <Navbar style="background:#222;"></Navbar>
    <Background class="bg"></Background>
    <div class="introduction">
      <h2 @click="changeColor" ref="change_color">
        {{this.autograph}}
      </h2><br>
      <p>
        邮箱：2501706076@qq.com
      </p>
      <p>
        github：rmq767
      </p>
      <p>
        --&nbsp;&nbsp;小阮，一个普通的大学生，想要努力学习赚大钱。
      </p>
      <img src="../assets/lufei.gif" alt="" class="d-none d-lg-block" v-b-popover.hover.top="'一起努力为了更好的自己，^_^'">
    </div>
    <div class="player d-none d-lg-block">
      <Player></Player>
    </div>
    </b-container>
</template>

<script>
import Player from '../components/Player.vue'
import Navbar from '../components/Navbar.vue'
import Background from '../components/Background.vue'
export default {
  props:[''],
  data () {
    return {
      color_num1:'',
      color_num2:'',
      color_num3:'',
      autograph:''
    };
  },

  methods: {
    changeColor(){
      this.color_num1 =Math.floor(Math.random()*255+1)
      this.color_num2 =Math.floor(Math.random()*255+1)
      this.color_num3 =Math.floor(Math.random()*255+1)
      let change_color = this.$refs.change_color
      change_color.style.backgroundImage = `-webkit-linear-gradient(bottom, rgb(${this.color_num1}, ${this.color_num2}, ${this.color_num3}), rgb(${this.color_num2}, ${this.color_num3}, ${this.color_num1})`
    },
    showAutograph(){
      this.$http.get('/autograph/selectnew').then(res => {
        this.autograph = res.data.autograph
      })
    }
  },

  components: {
    Player,
    Navbar,
    Background
  },

  computed: {},

  created() {
    this.showAutograph()
  },
}

</script>
<style scoped lang='less'>
.container-fluid{
  width: 100%;
  height: 100%;
  .introduction{
    position: relative;//想要介绍文字置顶，就要把重叠、遮盖的元素设置为position，z-index才有用
    h2{
      background-image: -webkit-linear-gradient(bottom, rgb(115, 204, 255), rgb(11, 255, 141));//background-image：为元素设置背景图像
      -webkit-background-clip: text;//background-clip：规定背景的绘制区域
      -webkit-text-fill-color: transparent;//text-fill-color：指定文字的填充颜色
      padding: 20vh 10vw 0;
      z-index: 100;
      cursor: pointer;
    }
    p{
      font-size: 20px;
      color: white;
      z-index: 100;
      padding-left: 20vw;
    }
    img{
      z-index: 100;
      width: 300px;
      border-radius: 50%;
      position: absolute;
      bottom: -20vh;
      right: 8vw;
      cursor: pointer;
    }
  }
}
</style>