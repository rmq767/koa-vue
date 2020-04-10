<template>
      <b-navbar toggleable="md" fixed="top" class="shadow">
        <b-navbar-brand to="/admin" v-b-popover.hover.bottom="'秘密基地'">
          <img src="../assets/np.jpg" alt="">
          Hi 
        </b-navbar-brand>
        <!-- 移动端导航条 -->
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <!-- 导航条 -->
        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto" small>
            <b-nav-item to="/index">文章</b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav small>
            <b-nav-item to="/study">学习</b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav small>
            <b-nav-item to="/message">留言板</b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav small>
            <b-nav-item to="/me">关于我</b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav class="ml-auto" small>
            <Rectangle></Rectangle>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
</template>

<script>
import Rectangle from './Rectangle'
export default {
  data() {
    return {
    }
  },
  components:{
    Rectangle
  }
}
</script>

<style scoped lang='less'>
  .navbar{
    .navbar-brand{
      img{
        width: 2rem;
        border-radius: 50%;
      }
    }
    .navbar-nav .nav-item{
      padding: 0 1.2rem;
      a{
        color: #515a6e;
      }
    }
    .navbar-nav .nav-item a:hover{
      border-bottom: 3px solid #515a6e;
    }
  }
</style>