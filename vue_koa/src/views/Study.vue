<template>
  <div class="study">
    <div class="bg-linear">
    <Navbar></Navbar>
      <b-container class="bv-example-row" fluid>
        <b-row>
            <b-col  sm='12'>
              <h4>轻量级框架</h4>
            </b-col>
            <b-col v-for="item in miniFrame" :key="item.id" sm='12' md='6' lg='4' xl='3'>
              <b-link :href="item.link">
                <b-row style="padding:0;" class="shadow">
                  <b-col cols='3'>
                    <b-img :src="item.url" fluid></b-img>
                  </b-col>
                  <b-col cols='9'>
                    <p>{{item.name}}</p>
                    <p>{{item.info}}</p>
                  </b-col>
                </b-row>
              </b-link>
            </b-col>
        </b-row>
        <b-row>
            <b-col  sm='12'>
              <h4>主流框架</h4>
            </b-col>
            <b-col v-for="item in frame" :key="item.id" sm='12' md='6' lg='4' xl='3'>
              <b-link :href="item.link">
                <b-row style="padding:0;" class="shadow" min-height="100px">
                  <b-col cols='3'>
                    <b-img :src="item.url" fluid></b-img>
                  </b-col>
                  <b-col cols='9'>
                    <p>{{item.name}}</p>
                    <p>{{item.info}}</p>
                  </b-col>
                </b-row>
              </b-link>
            </b-col>
        </b-row>
        <b-row>
            <b-col  sm='12'>
              <h4>CSS</h4>
            </b-col>
            <b-col v-for="item in CSS" :key="item.id" sm='12' md='6' lg='4' xl='3'>
              <b-link :href="item.link">
                <b-row style="padding:0;" class="shadow" min-height="100px">
                  <b-col cols='3'>
                    <b-img :src="item.url" fluid></b-img>
                  </b-col>
                  <b-col cols='9'>
                    <p>{{item.name}}</p>
                    <p>{{item.info}}</p>
                  </b-col>
                </b-row>
              </b-link>
            </b-col>
        </b-row>
        <b-row>
            <b-col  sm='12'>
              <h4>JS</h4>
            </b-col>
            <b-col v-for="item in JS" :key="item.id" sm='12' md='6' lg='4' xl='3'>
              <b-link :href="item.link">
                <b-row style="padding:0;" class="shadow" min-height="100px">
                  <b-col cols='3'>
                    <b-img :src="item.url" fluid></b-img>
                  </b-col>
                  <b-col cols='9'>
                    <p>{{item.name}}</p>
                    <p>{{item.info}}</p>
                  </b-col>
                </b-row>
              </b-link>
            </b-col>
        </b-row>
        <b-row>
            <b-col  sm='12'>
              <h4>VUE</h4>
            </b-col>
            <b-col v-for="item in VUE" :key="item.id" sm='12' md='6' lg='4' xl='3'>
              <b-link :href="item.link">
                <b-row style="padding:0;" class="shadow" min-height="100px">
                  <b-col cols='3'>
                    <b-img :src="item.url" fluid></b-img>
                  </b-col>
                  <b-col cols='9'>
                    <p>{{item.name}}</p>
                    <p>{{item.info}}</p>
                  </b-col>
                </b-row>
              </b-link>
            </b-col>
        </b-row>
        <b-row>
            <b-col sm='12'>
              <h4>工具</h4>
            </b-col>
            <b-col v-for="item in Appliance" :key="item.id" sm='12' md='6' lg='4' xl='3'>
              <b-link :href="item.link">
                <b-row style="padding:0;" class="shadow">
                  <b-col cols='3'>
                    <b-img :src="item.url" fluid></b-img>
                  </b-col>
                  <b-col cols='9'>
                    <p>{{item.name}}</p>
                    <p>{{item.info}}</p>
                  </b-col>
                </b-row>
              </b-link>
            </b-col>
        </b-row>
      </b-container>
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
        miniFrame:[],
        frame:[],
        CSS:[],
        JS:[],
        VUE:[],
        Appliance:[]
      };
    },

    methods: {
      showStudy(){
        this.$http.get('/study/select').then(res => {
          res.data.forEach(item => {
            switch(item.type){
            case '轻量级框架':
              this.miniFrame.push(item);
              break;
            case '主流前端框架':
              this.frame.push(item);
              break;
            case 'CSS生态':
              this.CSS.push(item);
              break;
            case 'JS生态':
              this.JS.push(item);
              break;
            case '工具':
              this.Appliance.push(item);
              break;
            default:
              this.VUE.push(item)
              break;
          }
          })
        })
      }
    },
    
    components: {
      Player,
      Navbar
    },
    
    computed: {},
    
    created() {
      this.showStudy()
    },
  }

</script>
<style scoped lang='less'>
.study{
  color: #fff;
  .bg-linear{
    background: linear-gradient(-45deg, #ee7752, #e74c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradientBG 10s ease-in-out infinite;
    .navbar{
      background: linear-gradient(-45deg, #ee7752, #e74c7e, #23a6d5, #23d5ab);
      background-size: 400% 400%;
      animation: gradientBG 10s ease-in-out infinite;
    }
  }
  .row:first-child{
      padding-top: 5rem;
  }
  .row{
    padding: 2rem 6vw;
    &>:not(:first-child){//选中除了第一个col之外的col元素
      margin-top: 1rem;
    }
    a{
      text-decoration: none;
      color: #000;
      .row{
        margin-left: 1vw;
        border-radius: 5px;
        min-height: 110.4px;
        &:hover{
          background-color: #fff;
        }
        .col-3{
          position: relative;
          .img-fluid{
            padding: 0px 1vw;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
          }
        }
        .col-9{
          :nth-of-type(2){
            font-size: 13px;
          }
        }
      }
    }
  }
@keyframes gradientBG {
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
}
}

</style>