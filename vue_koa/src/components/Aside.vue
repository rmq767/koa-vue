<template>
  <div>
    <el-menu default-active="1-4-1" class="el-menu-vertical-demo"
    :collapse="this.$store.state.isCollapse"
    router
    unique-opened
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    >
    <el-menu-item index="/admin">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
    </el-menu-item>
    <el-submenu index="article">
        <template slot="title">
        <i class="el-icon-document"></i>
        <span slot="title">文章</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index='/ad-article/add'>新增文章</el-menu-item>
          <el-menu-item index='/ad-article/handle'>文章管理</el-menu-item>
        </el-menu-item-group>
    </el-submenu>
    <el-submenu index="study">
        <template slot="title">
        <i class="el-icon-notebook-1"></i>
        <span slot="title">学习</span>
        </template>
        <el-menu-item-group>
        <el-menu-item index="/ad-study/add">学习添加</el-menu-item>
        <el-menu-item index="/ad-study/handle">学习管理</el-menu-item>
        </el-menu-item-group>
    </el-submenu>
    <el-submenu index="message">
        <template slot="title">
        <i class="el-icon-chat-dot-square"></i>
        <span slot="title">留言</span>
        </template>
        <el-menu-item-group>
        <el-menu-item index="/ad-message/handle">留言管理</el-menu-item>
        </el-menu-item-group>
    </el-submenu>
    <el-submenu index="notice">
        <template slot="title">
        <i class="el-icon-s-order"></i>
        <span slot="title">公告</span>
        </template>
        <el-menu-item-group>
        <el-menu-item index="/notice/add">添加公告</el-menu-item>
        <el-menu-item index="/notice/handle">公告管理</el-menu-item>
        </el-menu-item-group>
    </el-submenu>
    <el-submenu index="links">
        <template slot="title">
        <i class="el-icon-link"></i>
        <span slot="title">链接</span>
        </template>
        <el-menu-item-group>
        <el-menu-item index="/links/add">添加链接</el-menu-item>
        <el-menu-item index="/links/handle">链接管理</el-menu-item>
        </el-menu-item-group>
    </el-submenu>
    <el-submenu index="autograph">
        <template slot="title">
        <i class="el-icon-edit"></i>
        <span slot="title">我的签名</span>
        </template>
        <el-menu-item-group>
        <el-menu-item index="/autograph/add">添加签名</el-menu-item>
        <el-menu-item index="/autograph/handle">签名管理</el-menu-item>
        </el-menu-item-group>
    </el-submenu>
    </el-menu>
  </div>
</template>

<script>

  export default {
    props:[''],
    data () {
      return {
        drawer:'',
        direction:'ltr',
        screenWidth: '',
      };
    },

    methods: {
    },
    
    computed: {
    
    },
    
    mounted() {
      this.screenWidth = document.body.clientWidth;
      window.onresize = () => {//监听网页大小，改变侧边栏显示方式
        return (() => {
          this.screenWidth = document.body.clientWidth;
          if (this.screenWidth > 992) {
            this.$store.state.isCollapse = false
          }else{
            this.$store.state.isCollapse = true
          }
        })();
      };
    },
  }

</script>
<style scoped>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-drawer__header{
    margin: 0;
    padding: 0;
  }
  #el-drawer__title{
    margin: 0;
    padding: 0;
  }
</style>