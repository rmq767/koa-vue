<template>
  <div class="info">
    <el-row>
      <el-col :span="12" class="shadow" :push='1'>
        <MyInfo></MyInfo>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import MyInfo from '../components/MyInfo'
  export default {
    data() {
      return {
        imageUrl: ''
      };
    },
    methods: {
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    },
    components:{
      MyInfo
    }
  }

</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 20vw;
    height: 20vw;
    line-height: 20vw;
    text-align: center;
  }
  .avatar {
    width: 20vw;
    height: 20vw;
    display: block;
  }
</style>