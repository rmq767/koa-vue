<template>
  <div class="myInfo">
    <h3>我的信息</h3>
    <el-divider></el-divider>
    <el-form :model="userForm" :rules="rules" ref="userForm" label-width="100px">
    <el-form-item label="用户头像" prop="avatar">
      <el-upload
      ref="upload"
      action=""
      :auto-upload="false"
      list-type="picture-card"
      :limit="1"
      :file-list="showList"
      :on-preview="handlePictureCardPreview">
      <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-form-item>
    <el-form-item label="用户昵称" prop="name">
        <el-input v-model="userForm.name"></el-input>
    </el-form-item>
    <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="userForm.email"></el-input>
    </el-form-item>
    <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="userForm.sex">
        <el-radio label="男"></el-radio>
        <el-radio label="女"></el-radio>
        </el-radio-group>
    </el-form-item>
    <el-form-item label="个性签名" prop="signature">
        <el-input type="textarea" v-model="userForm.signature" :autosize="{ minRows: 4, maxRows: 6}"></el-input>
    </el-form-item>
    <el-divider></el-divider>
    <el-form-item>
        <el-button type="primary" @click="submitForm('userForm')" round>保存</el-button>
    </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
    data() {
        return {
          userForm:{
            name:'',
            email:'',
            sex:'',
            signature:''
          },
          rules: {
          name: [
              { required: true, message: '请输入昵称', trigger: 'blur' },
              { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
          ],
          email: [
              { required: true, message: '请输入邮箱地址', trigger: 'blur' },
              { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ],
          sex: [
              { required: false, message: '男', trigger: 'change' }
          ],
          signature: [
              { required: false, message: '请输入你的签名', trigger: 'blur' },
              { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
          ]
          },
          dialogImageUrl: '',
          dialogVisible: false,
          showList:[]
        }
    },
    methods: {
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const formData = new FormData();
            const file = this.$refs.upload.uploadFiles[0]
            if (file.raw == undefined) {
              formData.append('file', file.url);
            }else{
              formData.append('file', file.raw);
            }
            formData.append('name', this.userForm.name);
            formData.append('email', this.userForm.email);
            formData.append('sex', this.userForm.sex);
            formData.append('signature', this.userForm.signature);
            this.$http.put(`userinfo/${this.$store.state.user.id}`,formData).then(res => {
                  this.$message({
                    type: 'success',
                    message: '保存成功'
                  });
            }).catch(()=>{
                  this.$message({
                    type: 'error',
                    message: '保存失败'
                  });
            })
          } else {
            this.$message({
              type: 'error',
              message: '保存失败'
            });
            return false;
          }
        });
      },
    },
    created() {
      this.$http.get('/user/current').then(res => {
        this.userForm.name = res.data.name
        this.userForm.email = res.data.email
      })
    },
    mounted() {
      this.$http.get(`userinfo/${this.$store.state.user.id}`).then(res => {
        res.data[0].url = res.data[0].avatar
        this.showList = res.data
        this.userForm.name = res.data[0].name
        this.userForm.email = res.data[0].email
        this.userForm.sex = res.data[0].sex
        this.userForm.signature = res.data[0].signature
      })
    },
}
</script>

<style scoped lang='less'>
.myInfo{
    padding: 3vh 2vw;
}
</style>