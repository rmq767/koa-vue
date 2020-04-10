<template>
  <div class="message">
    <div class="bg-linear">
    <Navbar style="background:#1b2947;"></Navbar>
    <div class="words">
      <div class="input_message">
        <b-form @submit="onSubmit">
          <b-form-group>
            <b-input-group>
              <b-form-input id="input-large" size="lg" type="text" v-model="form.message" autocomplete="off"></b-form-input>
              <b-button variant="outline-light" pill size="lg" type="submit">发表</b-button>
            </b-input-group>
          </b-form-group>
        </b-form>
      </div>
      <div class="show_messages">
        <div v-for="(msg) in msgs" :key="msg.id">
          <span :style="'font-size:'+msg.r_size+';top:'+msg.r_top+';left:'+msg.r_left+';'">{{msg.message}}</span>
        </div>
      </div>
    </div>
    <div class="player d-none d-lg-block">
      <Player></Player>
    </div>
    </div>
  </div>
</template>

<script>
import Player from '../components/Player.vue'
import Navbar from '../components/Navbar.vue'
  export default {
    props:[''],
    data () {
      return {
        form:{
          message:''
        },
        msgs:[],
      };
    },
    methods: {
      onSubmit(evt) {
        evt.preventDefault()
        this.$http.post('/messages/add',this.form).then(res => {
          this.form.message = ''
          this.showMessages()
        })
      },
      showMessages(){
        this.$http.get('/messages/select').then(res => {
          this.msgs = res.data
        })
      },
      // size(){
      //   let size = Math.floor(Math.random()*30+12)
      //   return size
      // },
      // top(){
      //   let top = Math.floor(Math.random()*100)+'%'
      //   return top
      // },
      // left(){
      //   let left = Math.floor(Math.random()*100)+'%'
      //   return left
      // }
    },
    components: {
      Player,
      Navbar
    },
    created() {
      this.showMessages()
    },
  }

</script>
<style scoped lang='less'>
.message{
  height: 100%;
  .bg-linear{
    height: 100%;
    background: radial-gradient(200% 100% at bottom center, #f7f7b6, #e96f92, #75517d, #1b2947);
    background: radial-gradient(220% 105% at top center, #1b2947 10%, #75517d 40%, #e96f92 65%, #f7f7b6);
    background-attachment: fixed;
    overflow: hidden;
    .words{
      height: 100%;
      padding-top: 4rem;
      position: relative;
      .input_message{
        width: 50vw;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        #input-large{
          background: transparent;
          margin-right: 2vw;
        }
        .btn{
          width: 100px;
        }
      }
      .show_messages{
        padding-top: 4rem;
        color: rgb(180, 179, 179);
        span{
          position: absolute;
        }
      }
      }
  }
}
@media screen and (max-width:767px){
  .input_message{
    #input-large{
      width: 100%;
      margin-bottom: 4vh;
    }
  }
}
</style>