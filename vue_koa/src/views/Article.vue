<template>
  <div class="article">
    <Navbar style="background:white;"></Navbar>
    <b-container class="bv-example-row" fluid>
      <b-row>
        <!-- 返回按钮 -->
          <b-col class="d-none d-lg-block" lg="2" xl='2'>
            <div class="back_page" @click="back_page">
              <unicon name="previous" fill="black" width="3rem" height="3rem"/>
            </div>
          </b-col>
          <!-- 正文 -->
          <b-col cols="12" sm="12" md="12" lg="8">
          <div id="article_content">
            <h2>{{article.title}}</h2>
            <div class="sub_message">
              <span>日期：{{article.time}}</span>
              <span>阅读数：{{article.see}}</span>
              <span>喜欢：{{article.likes}}</span>
            <hr>
            <p>{{article.introduce}}</p>
            </div>
            <div v-html="article.content" v-highlight class="content"></div>
          </div>
          </b-col>
          <!-- 侧边栏 -->
          <b-col class="d-none d-lg-block" lg="2">
            <unicon name="heart" :fill="color" class="heart" @click="changeColor"></unicon>
          </b-col>
      </b-row>
    </b-container>
    <div class="player d-none d-lg-block">
      <Player></Player>
    </div>
  </div>
</template>

<script>
import Player from '../components/Player.vue'
import Navbar from '../components/Navbar.vue'
import marked from 'marked'//解析markdown
  export default {
    props:[''],
    data () {
      return {
        article:'',
        color:'#212529',
        content:'',
        see:0,
        like:0,
        flag:0
      };
    },

    methods: {
      back_page(){
        window.history.go(-1);
      },
      scroll(item){
        let el = document.getElementById(item)
        el.scrollIntoView({behavior:'smooth',block:'start'})
      },
      changeColor(){
        if (this.color == '#212529') {
          this.color = '#dc134c'
          this.flag = 1
        }else{
          this.color = '#212529'
          this.flag = 0
        }
        if (this.flag == 1) {
          this.like++
        }else{
          this.like--
        }
      },
      showArticle(){
        this.$http.get(`/article/select/${this.$route.params.id}`).then(res => {
          this.content = marked(res.data.content||'')
          this.article = res.data
          this.article.content = this.content
          this.see = res.data.see
          this.like = res.data.likes
          this.see++
        })
      },
      send(){
        this.$http.get(`/article/msg/${this.$route.params.id}?see=${this.see}&like=${this.like}`).then(res => {
        })
      }
    },
    
    components: {
      Player,
      Navbar
    },
    
    created() {
      this.showArticle()
    },
    updated() {
      this.send()
    },
  }

</script>
<style lang="less">
.article{
  position: relative;
  height: 100%;
  .row{
    padding-top: 5rem;
  }
  .back_page{
    svg{
      position: fixed;
      bottom: 2rem;
      left: 4rem;
      cursor: pointer;
    }
  }
  #article_content{
    .content{
      img{
        width: 100%;
      }
      li{
        margin-bottom: 20px;
      }
    }
    .sub_message{
      span{
        margin-right: 3rem;
      }
      p{
        margin-top: 3rem;
      }
    }
  }
  .heart{
    width: 3rem;
    height: 3rem;
    margin-left: 11rem;
    position: fixed;
    color: #212529;
    &:hover{
      cursor: pointer;
    }
  }
}
</style>