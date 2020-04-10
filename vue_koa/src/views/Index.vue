<template>
  <div class="index">
    <Navbar style="background:white;"></Navbar>
<!-- 正文 -->
    <b-container class="bv-example-row bv-example-row-flex-cols" fluid>
      <b-row>
        <!-- 左边消息列 -->
        <b-col>
          <div class="new_message" ref="newMessage">
            <b-card
              title="最新公告"
              tag="article"
              class="d-none d-lg-block"
              style="max-width: 14rem;"
            >
              <b-card-text v-for="notice in notices" :key="notice.id">
                <unicon name="star" fill="orange" width="15"></unicon>
                <span>{{notice.time}}</span>
                <p>{{notice.content}}</p>
              </b-card-text>
            </b-card>
            <b-card
              title="友情链接"
              tag="article"
              class="d-none d-lg-block"
              style="max-width: 14rem;"
            >
            <div v-for="link in links" :key="link.id">
              <unicon name="circle" fill="orchid" width="8"></unicon>
              <b-link :href="link.link" class="card-link">{{link.name}}</b-link><br>
            </div>
            </b-card>
          </div>
        </b-col>
<!-- 中间内容列 -->
        <b-col class="text-center" cols="12" sm="12" md="12" lg="7">
          <div class="container_article" ref='multipleTable'>
            <b-card no-body class="overflow-hidden" v-for="item in tableData" :key="item.id"
            id="text"
            >
              <b-link :to="{path:'/article/'+item.id}">
              <b-row no-gutters>
                <b-col md="12">
                  <b-card-body :title="item.title">
                    <div class="time">发布日期：{{item.time}}</div>
                    <b-card-text align="left">
                      <div v-html="item.introduce"></div>
                    </b-card-text>
                  </b-card-body>

                  <div class="statistics">
                    <b-card-text>
                      <unicon name="eye" fill="black"></unicon>
                      <span>{{item.see}}</span>
                      <unicon name="thumbs-up" fill="black"></unicon>
                      <span>{{item.likes}}</span>
                    </b-card-text>
                  </div>
                </b-col>
              </b-row>
              </b-link>
            </b-card>
            <h3 v-show="hidden">没有查找到数据</h3>
          <el-pagination
            style="float:right;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="paginations.page_index"
            :page-sizes="paginations.page_sizes"
            :page-size="paginations.page_size"
            :layout="paginations.layout"
            :total="paginations.total">
          </el-pagination>
          </div>
        </b-col>
<!-- 右边关于我列 -->
        <b-col class="text-center">
          <div class="about_me" ref="aboutMe">
            <b-card class="d-none d-lg-block" style="max-width: 13rem;">
              <search v-on:searchTitle="search_articles"></search>
              <img src="../assets/dog.jpg" alt=""  id="hello">
              <b-tooltip target="hello" triggers="hover" ref="msg">
                你好呀
              </b-tooltip>
              <b-card-text>
                一个小阮
              </b-card-text>
              <b-card-text>
                <b-link href="https://github.com/rmq767" class="card-link" v-b-popover.hover.bottom="'github'"><unicon name="github" fill="black"></unicon></b-link>
                <b-link href="mailto:2501706076@qq.com" class="card-link" v-b-popover.hover.bottom="'邮箱'"><unicon name="envelope" fill="black"></unicon></b-link>
                <b-link href="https://me.csdn.net/qq_44775782" class="card-link" v-b-popover.hover.bottom="'CSDN'"><unicon name="blogger" fill="black"></unicon></b-link>
                <b-link href=" qq: 'http://connect.qq.com/widget/shareqq/index.html" class="card-link" v-b-popover.hover.bottom="'分享这个网页'"><unicon name="share-alt" fill="black"></unicon></b-link>
              </b-card-text>
            </b-card>
          </div>
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
import Search from '../components/Search.vue'
  export default {
    props:[''],
    data () {
      return {
        perPage: 3,
        currentPage: 1,
        tableData: [],
        notices:[],
        links:[],
        allTableData:[],
        paginations:{
          page_index:1, //当前位于那页
          total:0, //总数
          page_size:8, //1页显示多少条
          page_sizes:[8,16,24], //每页显示多少条
          layout:"total, sizes, prev, pager, next, jumper" //翻页属性
        },
        search_data:'',
        hidden:false
      };
    },

    methods: {
      getPagination(){
        // 设置分页属性
        this.paginations.total = this.allTableData.length
        this.paginations.page_size = 8
        this.paginations.page_index = 1
        // 设置默认的分页数据
        this.tableData = this.allTableData.filter((item,index) => {
          return index < this.paginations.page_size 
        })
      },
      handleSizeChange(page_size){
        scrollTo(0,0)//点击分页回到顶部
        this.$refs.multipleTable.scrollTop = 0;
        // 切换size
        this.paginations.page_index = 1
        this.paginations.page_size = page_size
        // 设置默认的分页数据
        this.tableData = this.allTableData.filter((item,index) => {
          return index < page_size
        })
      },
      handleCurrentChange(page){
        scrollTo(0,0)//点击分页回到顶部
        this.$refs.multipleTable.scrollTop = 0;
        // 获取当前页，循环出从index开始一个页面显示几条数据
        let index = this.paginations.page_size * (page - 1)
        // 数据的总数
        let sum = this.paginations.page_size * page
        // 容器
        let tables = []
        // 循环页码对应出要显示的数据
        for(let i = index; i < sum; i++){
          if(this.allTableData[i]){
            tables.push(this.allTableData[i])
          }
          this.tableData = tables
        }
      },
      toScoll(){//向下滑动动画
        let newMessage = this.$refs.newMessage
        let aboutMe = this.$refs.aboutMe
        let long = document.documentElement.scrollTop
        let length = window.pageYOffset;
        if (long > 100) {
          newMessage.style.transform = `translateY(${length}px)`
          aboutMe.style.transform = `translateY(${length}px)`
        }else{
          newMessage.style.transform = `translateY(0px)`
          aboutMe.style.transform = `translateY(0px)`
        }
      },
      showNotices(){
        this.$http.get('/notice/select3').then(res => {
          this.notices = res.data
        })
      },
      showLinks(){
        this.$http.get('/links/select3').then(res => {
          this.links = res.data
        })
      },
      showArticles(){
        this.$http.get('/article/select').then(res => {
          this.tableData = res.data
          this.allTableData = res.data
          this.getPagination()
        })
      },
      search_articles(data){
        this.search_data = data
        this.tableData = this.search_data
        this.allTableData = this.search_data
        this.getPagination()
      },
      hidden_articles(){
        if (this.tableData=="") {
          this.hidden = true
        }else{
          this.hidden = false
        }
      }
    },
    
    components: {
      Player,
      Navbar,
      Search
    },
    
    mounted() {
      this.showNotices()
      this.showLinks()
      this.showArticles()
    },
    destroyed () {
      window.removeEventListener('scroll', this.toScoll)
    },
    created() {
      window.addEventListener('scroll', this.toScoll)
      console.log("%c%s","color: red; background: yellow; font-size: 12px;","欢迎来到小阮的个人博客");
      console.log("%c%s","color: red; background: yellow; font-size: 12px;","大佬不要乱搞，磕头了，砰砰砰~");
    },
    updated() {
      this.hidden_articles()
    },
  }

</script>
<style scoped lang="less">
.index{
  .container-fluid{
    .row{
      padding-top: 5rem;
      .new_message{
        transition: all 0.5s ease-in-out;
        .card{
          margin-bottom: 2rem;
          a{
            color: rgba(140,190,255,.8);
          }
          svg{
            margin-right: 1rem;
            animation: change 1s infinite;
          }
        }
      }
      .container_article{
        .row{
          margin-top: -5rem;
        }
        a{
          text-decoration: none;
        }
      }
      .col .card,.container_article .card{
        box-shadow: 0px 2px 5px 0px #ccc;
        color: #474e5e;
        font-family: 'Courier New', Courier, monospace;
        font-weight: 700;
        h4{
          font-weight: bold;
        }
        .card-text{
          font-size: 14px;
          color: rgba(92,107,119,.9);
        }
      }
      .container_article .card{
        transition: all .3s ease-in-out;
        margin-bottom: 50px;
        &:hover{
          transform: scale(1.02,1.02);
          box-shadow: 0px 2px 15px 0px #ccc;
        }
        svg,span{
          margin-right: 1rem;
        }
        .statistics{
          padding-top: 1rem;
        }
        .card-body{
          h4{
            color: #2c2e31;
          }
          .time{
            color: #474e5e;
            font-size: 12px;
            margin-bottom: 3vh;
          }
        }
      }
      .about_me .card img{
        width: 100px;
        border-radius: 50%;
      }
      .about_me{
        transition: all 0.5s ease-in-out;
        padding: 5vh 2vw 0;
        position: relative;
        overflow: hidden;
        .card-body{
          margin-top: 4vh;
        }
      }
    }
  }
}
@keyframes change {
    0%{
        transform: scale(1,1);
    }
    50%{
        transform: scale(1.5,1.5);
    }
    100%{
        transform: scale(1,1);
    }
}
</style>