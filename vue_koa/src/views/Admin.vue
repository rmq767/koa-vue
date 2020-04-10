<template>
  <div class="admin">
      <el-container v-show="show==1?true:false">
        <el-aside style="width:auto;">
          <Aside></Aside>
        </el-aside>
        <el-container>
          <el-header>
            <Header></Header>
          </el-header>
          <el-main style="padding:0;">
            <router-view></router-view>
          </el-main>
        </el-container>
      </el-container>
    <div v-show="show==1?false:true">
      <NotFound></NotFound>
    </div>
  </div>
</template>

<script>
import Aside from '../components/Aside'
import Header from '../components/Header'
import NotFound from './404'
  export default {
    props:[''],
    data () {
      return {
        show:0
      };
    },

    methods: {

    },

    components: {
      Aside,
      Header,
      NotFound
    },

    computed: {},

    created() {
      this.$http.get(`userinfo/${this.$store.state.user.id}`).then(res => {
        this.show = res.data[0].isadmin
      })
    },
  }

</script>
<style scoped lang='less'>
.admin{
  width: 100%;
  height: 100%;
  .el-container{
    width: 100%;
    height: 100%;
    .el-aside{
      height: 100%;
      // border-right: solid 2px #e6e6e6;
      background: #545c64;
    }
    .el-header{
      box-shadow: 0px 0px 5px 1px #e6e6e6;
    }
  }
}
</style>