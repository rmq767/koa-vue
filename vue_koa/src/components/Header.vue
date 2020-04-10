<template>
  <div class="header">
    <el-row type="flex" class="row-bg" justify="space-between">
    <el-col :span="18">
        <div class="grid-content bg-purple">
        <unicon name="align" fill="black" @click="isCollapse"/>
        <Breadcrumb></Breadcrumb>
        </div>
    </el-col>
    <el-col :span="6">
        <div class="avatar">
        <el-avatar :src="avatar" :size="50"></el-avatar>
        <el-dropdown @command="setDialogInfo" trigger="click">
          <span class="el-dropdown-link">
            <i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="info">个人信息</el-dropdown-item>
            <el-dropdown-item command="logout" @click="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        </div>
        </el-col>
    </el-row>
  </div>
</template>

<script>
import Breadcrumb from '../components/Breadcrumb'
  export default {
    props:[''],
    data () {
      return {
        screenWidth: '',
        avatar:''
      };
    },

    methods: {
        isCollapse(){
            this.$store.commit('isCollapse')
        },
        setDialogInfo(cmdItem){//点击哪个下拉菜单，传过来哪个command
          switch(cmdItem){
            case 'info':
              this.showInfo()
              break
            case 'logout':
              this.logout()
              break
          }
        },
        showInfo(){
          this.$router.push('/info')
        },
        logout(){
            this.$confirm('确认退出登录?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              // 清除token
              localStorage.removeItem('eleToken')
              // 设置vuex store，清除授权和用户
              this.$store.dispatch('clearCurrentState')
              // 跳转登录页面
              this.$router.push('/login')
              this.$message({
                type: 'success',
                message: '退出成功!'
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消退出'
              });          
            });
        }
    },

    components: {
      Breadcrumb
    },
    created() {
      this.$http.get(`userinfo/${this.$store.state.user.id}`).then(res => {
        this.avatar = res.data[0].avatar
      })
    },
  }

</script>
<style scoped lang='less'>
.header{
    .el-row{
        .el-col{
            svg{
                cursor: pointer;
            }
            .avatar{
              height: 100%;
              width: 70px;
              float: right;
              img{
                width: 50px;
                height: 50px;
                border-radius: 50%;
              }
              i{
                cursor: pointer;
              }
            }
        }
    }
}
</style>